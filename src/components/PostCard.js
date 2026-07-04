import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../theme';

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'abhi';
  if (mins < 60) return mins + ' min pehle';
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + ' ghantay pehle';
  return Math.floor(hrs / 24) + ' din pehle';
}

export default function PostCard({ post }) {
  return (
    <View style={styles.card}>
      <Text style={styles.recno}>FILE NO. {post.id.slice(-6).toUpperCase()}</Text>
      <View style={styles.topRow}>
        <Text style={styles.title}>{post.title}</Text>
        {!!post.price && <Text style={styles.price}>Rs {post.price}</Text>}
      </View>
      <View style={styles.tagRow}>
        {!!post.location && <Text style={styles.tag}>📍 {post.location}</Text>}
        {!!post.route && <Text style={styles.tag}>🛣 {post.route}</Text>}
      </View>
      <Text style={styles.meta}>{timeAgo(post.created_at)}</Text>
      {!!post.image_url && <Image source={{ uri: post.image_url }} style={styles.image} />}
      <Text style={styles.body}>{post.body}</Text>
      <View style={styles.footer}>
        <Text style={styles.author}>
          {post.author_name} <Text style={styles.verified}>VERIFIED</Text>
        </Text>
        <Text style={styles.username}>@{post.author_username}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.rule, borderRadius: 3, padding: 16, marginBottom: 14 },
  recno: { fontFamily: FONTS.mono, fontSize: 10, color: COLORS.muted, marginBottom: 8 },
  topRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    borderBottomWidth: 1, borderColor: COLORS.rule, paddingBottom: 10, marginBottom: 8
  },
  title: { fontFamily: FONTS.display, fontSize: 17, color: COLORS.ink, flex: 1, paddingRight: 8 },
  price: { fontFamily: FONTS.mono, fontSize: 14, color: COLORS.seal },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 6 },
  tag: {
    fontFamily: FONTS.bodyBold, fontSize: 11, color: COLORS.inkSoft, backgroundColor: COLORS.paper,
    borderWidth: 1, borderColor: COLORS.rule, borderRadius: 2, paddingHorizontal: 8, paddingVertical: 2, overflow: 'hidden'
  },
  meta: { fontFamily: FONTS.mono, fontSize: 11, color: COLORS.muted, marginBottom: 8 },
  image: { width: '100%', height: 180, borderRadius: 3, borderWidth: 1, borderColor: COLORS.rule, marginBottom: 8 },
  body: { fontFamily: FONTS.body, fontSize: 14, lineHeight: 20, color: COLORS.inkSoft },
  footer: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderTopWidth: 1, borderStyle: 'dashed', borderColor: COLORS.rule, paddingTop: 10, marginTop: 12
  },
  author: { fontFamily: FONTS.bodyMedium, fontSize: 12.5, color: COLORS.inkSoft },
  verified: { fontFamily: FONTS.monoBold, fontSize: 9, color: COLORS.seal },
  username: { fontFamily: FONTS.mono, fontSize: 11.5, color: COLORS.muted }
});
