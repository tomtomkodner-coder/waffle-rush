# Waffle Rush — ONE sign-in + ads across web, Android & iOS

The game is already coded for a **single shared identity**. You do **not** write different
code per platform — you reuse **one Web OAuth client id** everywhere.

## Google Sign-In — one client id for all platforms

How it already works in the code:
- **Web (HTML site):** Google Identity Services (GIS) — `googleSignIn()` in `waffle-rush.html`.
- **Android (APK):** native Credential Manager — `JellyAccountNative.java`.
- **iOS:** Google Sign-In SDK — drop-in in `ios-native/`.
All three request an **ID token whose audience is the same Web client id**, so the user
(and their Google Drive `appDataFolder` save) is identical on every platform.

Do this once:
1. One **Google Cloud project** → *APIs & Services → Credentials*.
2. Create **OAuth client ID → Web application**. Copy it — it ends in
   `.apps.googleusercontent.com`. **This single id is your identity everywhere.**
3. Enable the **Google Drive API** (for cloud save).
4. Put that one id in each shell:
   - **Web:** set `GOOGLE_OAUTH.clientId = '<id>.apps.googleusercontent.com'` in
     `waffle-rush.html` (or add `?gclient=<id>` to the URL, or paste it in the in-game
     Account panel — `setGoogleClient()` stores it).
   - **Android:** `android/app/src/main/res/values/strings.xml` →
     `<string name="google_web_client_id"><id>.apps.googleusercontent.com</string>`.
   - **iOS:** use the **same** web id as `serverClientID` in the Google Sign-In config.

Two per-platform *registrations* are still required by Google for security (they are NOT
extra code or keys you manage — just entries in the console so Google trusts each app):
- **OAuth client → Android** (package `com.tomkodner.jellykingdom` + your signing SHA-1).
- **OAuth client → iOS** (your bundle id).

Result: one project, one web client id in code, same account + same save on web, APK and iOS.

## Ads

- **Android APK (AdMob)** — already wired: app id + rewarded + interstitial live in
  `build.gradle` (test units in *debug*, real units in *release*). Real ads only **fill**
  once the app is live on Google Play **or** your device is registered as an AdMob
  **test device** (AdMob → Settings → Test devices → add the device id printed in logcat).
  Before that, the release build reports "no fill" — that is normal AdMob behaviour, not a bug.
- **Website (AdSense H5 Games Ads)** — set your publisher id
  `GOOGLE_ADS.client = 'ca-pub-XXXXXXXXXXXXXXXX'` in `waffle-rush.html` (or `?adclient=ca-pub-…`).
  Then real rewarded/interstitial ads play in the browser. With **no** publisher id the game
  grants the reward **instantly** (no video) — that is the built-in fallback you are seeing now.
- **iOS** — add Google Mobile Ads SDK with your AdMob iOS app id (same pattern as Android).

Reward integrity: the reward is granted **only** by the ad network's official completion
callback (or instantly on web when no network is configured). It is never faked.
