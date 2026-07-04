import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput,
  ScrollView, Image, ActivityIndicator, Alert, RefreshControl
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../lib/supabase';
import { COLORS, FONTS } from '../theme';
import PostCard from '../components/PostCard';

export default function PostListScreen({ category, profile }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [pickedImage, setPickedImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchPosts = useCallback(async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('category', category.key)
      .order('created_at', { ascending: false });
    if (!error) setPosts(data || []);
    setLoading(false);
    setRefreshing(false);
  }, [category.key]);

  useEffect(() => {
    fetchPosts();
    const channel = supabase
      .channel('posts-' + category.key)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts', filter: `category=eq.${category.key}` },
        (payload) => setPosts((prev) => [payload.new, ...prev])
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchPosts, category.key]);

  function openModal() {
    setFormValues({});
    setPickedImage(null);
    setModalVisible(true);
  }

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission chahiye', 'Tasveer chunne k liye gallery ki permission den.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
      allowsEditing: true
    });
    if (!result.canceled) setPickedImage(result.assets[0]);
  }

  async function submitPost() {
    for (const f of category.fields) {
      if (!formValues[f.key] || !formValues[f.key].trim()) {
        Alert.alert('Sab fields bharen', f.label + ' zaroori hai.');
        return;
      }
    }
    setSubmitting(true);
    let imageUrl = null;
    try {
      if (pickedImage) {
        const fileExt = pickedImage.uri.split('.').pop();
        const fileName = `${profile.id}_${Date.now()}.${fileExt}`;
        const response = await fetch(pickedImage.uri);
        const blob = await response.blob();
        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(fileName, blob, { contentType: pickedImage.mimeType || 'image/jpeg' });
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from('post-images').getPublicUrl(fileName);
        imageUrl = publicUrlData.publicUrl;
      }
      const { error } = await supabase.from('posts').insert({
        category: category.key,
        title: formValues.title || null,
        price: formValues.price || null,
        location: formValues.location || null,
        route: formValues.route || null,
        body: formValues.body || null,
        image_url: imageUrl,
        author_id: profile.id,
        author_name: profile.name,
        author_username: profile.username
      });
      if (error) throw error;
      setModalVisible(false);
      fetchPosts();
    } catch (err) {
      Alert.alert('Post nahi ho saki', err.message);
    }
    setSubmitting(false);
  }

  if (loading) {
    return <View style={styles.center}><ActivityIndicator color={COLORS.ink} /></View>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.paper }}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 14, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchPosts(); }} />}
        renderItem={({ item }) => <PostCard post={item} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>{category.icon}</Text>
            <Text style={styles.emptyText}>Abhi is section mein koi post nahi.{'\n'}Sab se pehle post karen!</Text>
          </View>
        }
      />
      <TouchableOpacity style={styles.fab} onPress={openModal}>
        <Text style={styles.fabText}>+ NAYI POST</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.sheet}>
            <ScrollView keyboardShouldPersistTaps="handled">
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>{category.icon} Nayi Post — {category.label}</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeBtn}>✕</Text>
                </TouchableOpacity>
              </View>
              {category.fields.map((f) => (
                <View key={f.key}>
                  <Text style={styles.label}>{f.label}</Text>
                  <TextInput
                    style={[styles.input, f.multiline && { height: 90, textAlignVertical: 'top' }]}
                    placeholder={f.placeholder}
                    placeholderTextColor={COLORS.muted}
                    multiline={f.multiline}
                    value={formValues[f.key] || ''}
                    onChangeText={(t) => setFormValues((prev) => ({ ...prev, [f.key]: t }))}
                  />
                </View>
              ))}
              <Text style={styles.label}>Tasveer (optional)</Text>
              <TouchableOpacity style={styles.imagePickBtn} onPress={pickImage}>
                <Text style={styles.imagePickText}>{pickedImage ? 'Tasveer badlen' : 'Tasveer Chunen'}</Text>
              </TouchableOpacity>
              {pickedImage && <Image source={{ uri: pickedImage.uri }} style={styles.previewImg} />}

              <TouchableOpacity style={styles.submitBtn} onPress={submitPost} disabled={submitting}>
                {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>POST KAREN</Text>}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.paper },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 34, marginBottom: 10, opacity: 0.6 },
  emptyText: { fontFamily: FONTS.body, color: COLORS.muted, textAlign: 'center', fontSize: 14 },
  fab: {
    position: 'absolute', bottom: 20, right: 20, backgroundColor: COLORS.seal,
    paddingHorizontal: 18, paddingVertical: 13, borderRadius: 3, elevation: 4
  },
  fabText: { color: '#fff', fontFamily: FONTS.bodyBold, fontSize: 12.5, letterSpacing: 0.4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(20,20,15,0.55)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: COLORS.paper, borderTopWidth: 3, borderColor: COLORS.brass, borderRadius: 6, maxHeight: '88%', padding: 20 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sheetTitle: { fontFamily: FONTS.display, fontSize: 18, color: COLORS.ink, flex: 1 },
  closeBtn: { fontSize: 16, color: COLORS.muted, borderWidth: 1, borderColor: COLORS.rule, width: 28, height: 28, textAlign: 'center', textAlignVertical: 'center', borderRadius: 2 },
  label: { fontFamily: FONTS.bodyBold, fontSize: 11, color: COLORS.inkSoft, textTransform: 'uppercase', letterSpacing: 0.4, marginTop: 14, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: COLORS.rule, borderRadius: 3, paddingHorizontal: 12, paddingVertical: 10, fontFamily: FONTS.body, fontSize: 14.5, color: COLORS.ink, backgroundColor: '#fff' },
  imagePickBtn: { borderWidth: 1, borderColor: COLORS.rule, borderRadius: 3, paddingVertical: 12, alignItems: 'center', backgroundColor: '#fff' },
  imagePickText: { fontFamily: FONTS.bodyBold, fontSize: 13, color: COLORS.inkSoft },
  previewImg: { width: 140, height: 140, borderRadius: 3, marginTop: 10, borderWidth: 1, borderColor: COLORS.rule },
  submitBtn: { backgroundColor: COLORS.seal, borderRadius: 3, paddingVertical: 13, alignItems: 'center', marginTop: 20, marginBottom: 10 },
  submitText: { color: '#fff', fontFamily: FONTS.bodyBold, fontSize: 13, letterSpacing: 0.5 }
});
