# PAC Hub — Mobile App (Expo / React Native)

Ye app Supabase (real database) se connect hoti hai — real accounts, real posts,
real images. Neeche step-by-step guide hai.

## Step 1: Supabase Setup (5 minutes)

1. https://supabase.com par jayen, GitHub se sign up karen.
2. "New Project" banayen — naam "pac-hub" rakhen, database password set karen (yaad rakhen).
3. Project ban jane k baad, left sidebar mein **SQL Editor** kholen.
4. Is folder ki `supabase-schema.sql` file ka pura content copy karen, SQL Editor mein
   paste karen, aur **Run** dabayen.
5. Left sidebar -> **Authentication** -> **Providers** -> **Email** kholen ->
   **"Confirm email"** ko **OFF** kar den. (Ye zaroori hai warna login nahi ho sakega.)
6. Left sidebar -> **Project Settings** -> **API** kholen. Yahan se copy karen:
   - **Project URL**
   - **anon public key**
7. `src/lib/supabase.js` file kholen aur `SUPABASE_URL` aur `SUPABASE_ANON_KEY`
   ki jagah apni values paste karen.

## Step 2: App ko apne computer par chalana

Terminal mein is folder k andar jakar:

```bash
npm install
npx expo install --fix
npx expo start
```

QR code scan karen apne phone par **Expo Go** app se (Play Store se install karen) —
app turant chal jayegi test k liye.

## Step 3: Real APK/AAB banana (Play Store k liye)

1. EAS CLI install karen:
   ```bash
   npm install -g eas-cli
   eas login
   ```
   (Expo.dev par pehle free account bana len agar nahi hai)

2. `app.json` mein `"package": "com.pachub.app"` ko apne unique naam se badal den
   (e.g. `com.yourdepartmentname.pachub`) — ye Play Store par unique hona zaroori hai.

3. Build configure karen:
   ```bash
   eas build:configure
   ```

4. Android build banayen (AAB file, Play Store k liye):
   ```bash
   eas build --platform android
   ```
   Ye cloud par build hota hai (10-20 min), aakhir mein ek download link milega — 
   wahan se `.aab` file download karen.

## Step 4: Google Play Console par Publish Karna

1. https://play.google.com/console par jayen, $25 one-time fee de kar account banayen.
2. "Create app" -> naam "PAC Hub" -> details fill karen.
3. **App content** section mein:
   - Privacy Policy URL chahiye hoga (simple privacy policy page banwa len — bata den to main draft kar dun ga)
   - Content rating questionnaire fill karen
4. **Store listing** mein:
   - Short description, full description (main likh kar de sakta hn)
   - Screenshots (app chalakar khud le len, ya main guide karta hn)
   - App icon (assets/icon.png yahan use hoga)
5. **Production** -> **Create new release** -> apni `.aab` file upload karen.
6. Submit for review — usually 1-3 din lagte hain.

## Folder Structure

```
pac-hub-app/
├── App.js                  # Main entry point
├── app.json                 # Expo config
├── package.json
├── supabase-schema.sql      # Database setup script
├── src/
│   ├── lib/supabase.js      # Supabase connection (apni keys yahan dalen)
│   ├── theme.js             # Colors, fonts, categories config
│   ├── screens/
│   │   ├── AuthScreen.js    # Join / Login
│   │   ├── HomeScreen.js    # Tab navigation
│   │   ├── PostListScreen.js
│   │   └── MembersScreen.js
│   └── components/PostCard.js
└── assets/                  # Icons, splash screen
```

## Naye Sections/Features Add Karne K Liye

Bas `src/theme.js` mein `CATEGORIES` array mein naya object add karen — baqi sab
automatically kaam kar jayega (tab, form, list sab).

## Koi Masla Aaye To

- "Invalid API key" — `src/lib/supabase.js` mein URL/key dubara check karen
- Login nahi ho raha — Supabase mein "Confirm email" OFF hai ya nahi check karen
- Images nahi dikh rahi — Supabase Storage bucket "post-images" public hai ya nahi check karen
