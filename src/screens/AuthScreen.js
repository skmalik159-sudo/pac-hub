import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert
} from 'react-native';
import { supabase, usernameToEmail } from '../lib/supabase';
import { COLORS, FONTS } from '../theme';

export default function AuthScreen() {
  const [mode, setMode] = useState('join'); // 'join' | 'login'
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleJoin() {
    if (!name.trim() || !username.trim() || password.length < 6) {
      Alert.alert('Maloomat mukammal karen', 'Naam, username, aur kam az kam 6 character ka password chahiye.');
      return;
    }
    setLoading(true);
    const email = usernameToEmail(username);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setLoading(false);
      if (error.message.includes('already registered')) {
        Alert.alert('Ye username pehle se maujood hai', 'Dusra username try karen.');
      } else {
        Alert.alert('Error', error.message);
      }
      return;
    }
    const userId = data.user?.id;
    if (userId) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({ id: userId, name: name.trim(), username: username.trim().toLowerCase() });
      if (profileError) {
        Alert.alert('Error', 'Profile save nahi ho saka: ' + profileError.message);
      }
    }
    setLoading(false);
  }

  async function handleLogin() {
    if (!username.trim() || !password) {
      Alert.alert('Username aur password darj karen');
      return;
    }
    setLoading(true);
    const email = usernameToEmail(username);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      Alert.alert('Login nahi ho saka', 'Username ya password ghalat hai.');
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.paper }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
        <View style={styles.seal}>
          <Text style={styles.sealText}>PAC</Text>
        </View>
        <Text style={styles.appName}>PAC Hub</Text>
        <Text style={styles.tagline}>Department k tamam members aur unki families k liye</Text>

        <View style={styles.card}>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, mode === 'join' && styles.toggleBtnActive]}
              onPress={() => setMode('join')}
            >
              <Text style={[styles.toggleText, mode === 'join' && styles.toggleTextActive]}>NAYA ACCOUNT</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, mode === 'login' && styles.toggleBtnActive]}
              onPress={() => setMode('login')}
            >
              <Text style={[styles.toggleText, mode === 'login' && styles.toggleTextActive]}>LOGIN</Text>
            </TouchableOpacity>
          </View>

          {mode === 'join' && (
            <>
              <Text style={styles.label}>Full Name</Text>
              <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. Muhammad Aslam" placeholderTextColor={COLORS.muted} />
            </>
          )}

          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input} value={username} onChangeText={setUsername}
            placeholder="e.g. aslam22" autoCapitalize="none" placeholderTextColor={COLORS.muted}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input} value={password} onChangeText={setPassword}
            placeholder="Kam az kam 6 characters" secureTextEntry placeholderTextColor={COLORS.muted}
          />

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={mode === 'join' ? handleJoin : handleLogin}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : (
              <Text style={styles.submitText}>{mode === 'join' ? 'JOIN KAREN' : 'LOGIN KAREN'}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24, paddingTop: 60 },
  seal: {
    width: 64, height: 64, borderRadius: 32, borderWidth: 1.5, borderColor: COLORS.brass,
    alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.ink, marginBottom: 12
  },
  sealText: { color: COLORS.paper, fontFamily: FONTS.displayBold, fontSize: 16 },
  appName: { fontFamily: FONTS.display, fontSize: 26, color: COLORS.ink, marginBottom: 4 },
  tagline: { fontFamily: FONTS.mono, fontSize: 11.5, color: COLORS.muted, marginBottom: 26, textAlign: 'center' },
  card: {
    width: '100%', maxWidth: 420, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.rule,
    borderRadius: 4, padding: 22
  },
  toggleRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: COLORS.rule, marginBottom: 18 },
  toggleBtn: { flex: 1, paddingVertical: 10, borderBottomWidth: 3, borderBottomColor: 'transparent', alignItems: 'center' },
  toggleBtnActive: { borderBottomColor: COLORS.seal },
  toggleText: { fontFamily: FONTS.bodyBold, fontSize: 12, color: COLORS.muted, letterSpacing: 0.4 },
  toggleTextActive: { color: COLORS.ink },
  label: { fontFamily: FONTS.bodyBold, fontSize: 11, color: COLORS.inkSoft, textTransform: 'uppercase', letterSpacing: 0.4, marginTop: 14, marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: COLORS.rule, borderRadius: 3, paddingHorizontal: 12, paddingVertical: 10,
    fontFamily: FONTS.body, fontSize: 14.5, color: COLORS.ink, backgroundColor: '#fff'
  },
  submitBtn: { backgroundColor: COLORS.seal, borderRadius: 3, paddingVertical: 13, alignItems: 'center', marginTop: 22 },
  submitText: { color: '#fff', fontFamily: FONTS.bodyBold, fontSize: 13, letterSpacing: 0.5 }
});
