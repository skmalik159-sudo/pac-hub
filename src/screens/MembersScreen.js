import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';
import { COLORS, FONTS } from '../theme';

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return 'aaj';
  return days + ' din pehle';
}

export default function MembersScreen() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) setMembers(data || []);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator color={COLORS.ink} /></View>;
  }

  return (
    <FlatList
      data={members}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 14 }}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.sub}>@{item.username}</Text>
          </View>
          <Text style={styles.sub}>{timeAgo(item.created_at)}</Text>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.sub}>Abhi koi member nahi</Text>}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.paper },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 13, borderBottomWidth: 1, borderColor: COLORS.rule },
  name: { fontFamily: FONTS.display, fontSize: 14.5, color: COLORS.ink },
  sub: { fontFamily: FONTS.mono, fontSize: 11.5, color: COLORS.muted }
});
