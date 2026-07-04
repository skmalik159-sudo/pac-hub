import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { supabase } from '../lib/supabase';
import { COLORS, FONTS, CATEGORIES } from '../theme';
import PostListScreen from './PostListScreen';
import MembersScreen from './MembersScreen';

const Tab = createBottomTabNavigator();

function Header({ profile, memberCount }) {
  return (
    <View style={styles.header}>
      <View style={styles.seal}><Text style={styles.sealText}>PAC</Text></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.appName}>PAC Hub</Text>
        <Text style={styles.subInfo}>Khush aamdeed, {profile.name}</Text>
      </View>
      <TouchableOpacity style={styles.logoutBtn} onPress={() => supabase.auth.signOut()}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function HomeScreen({ profile }) {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.paper }}>
      <Header profile={profile} />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: COLORS.ink,
            tabBarInactiveTintColor: COLORS.muted,
            tabBarStyle: { backgroundColor: '#EDE4CF', borderTopColor: COLORS.rule },
            tabBarLabelStyle: { fontFamily: FONTS.bodyBold, fontSize: 10 }
          }}
        >
          {CATEGORIES.map((cat) => (
            <Tab.Screen
              key={cat.key}
              name={cat.label}
              options={{ tabBarLabel: cat.label, tabBarIcon: () => <Text>{cat.icon}</Text> }}
            >
              {() => <PostListScreen category={cat} profile={profile} />}
            </Tab.Screen>
          ))}
          <Tab.Screen
            name="Members"
            component={MembersScreen}
            options={{ tabBarIcon: () => <Text>👥</Text> }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.ink, flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 18, paddingTop: 50, paddingBottom: 14, borderBottomWidth: 3, borderColor: COLORS.brass
  },
  seal: { width: 42, height: 42, borderRadius: 21, borderWidth: 1.5, borderColor: COLORS.brass, alignItems: 'center', justifyContent: 'center' },
  sealText: { color: COLORS.paper, fontFamily: FONTS.displayBold, fontSize: 12 },
  appName: { color: COLORS.paper, fontFamily: FONTS.display, fontSize: 18 },
  subInfo: { color: '#B9C2D6', fontFamily: FONTS.mono, fontSize: 10.5, marginTop: 2 },
  logoutBtn: { borderWidth: 1, borderColor: 'rgba(245,239,225,0.4)', borderRadius: 3, paddingHorizontal: 10, paddingVertical: 6 },
  logoutText: { color: COLORS.paper, fontFamily: FONTS.bodyMedium, fontSize: 11 }
});
