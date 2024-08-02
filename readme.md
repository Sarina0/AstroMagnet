# Astromagnet
AstroMagnet is a cutting-edge matchmaking mobile application that leverages astrology to find and connect users based on their astrological compatibility scores. Developed with React Native and Expo, AstroMagnet offers a seamless user experience across platforms. Key features of the application include:

Astrological Compatibility Scoring: Matches users based on detailed astrological rules.
Google Sign-In Integration: Provides secure and convenient authentication, storing only tokens for enhanced security.
Profile Management: Allows users to create and update their profiles easily.
Matchmaking: Features intuitive like and dislike icons to facilitate connections.
Matched User Search: Enables users to search and view profiles of users they've already matched with.
Real-Time Chat: Allows users to start conversations with their matches.
## Setup: 
1. run: 
```bat
yarn
``` 
⚠ you can use npm too but it will likely give an error about legacy, if it works for you, you are free to use it
intall yarn by: npm i -g yarn
## Step to run the project on Android emulator
1. Open android folder and create a folder name "local.properties"
2. Inside local.properties, add this: sdk.dir=/*PATH TO YOUR ANDROID SKD*/
⚠ path to your sdk can be found in android studio system setting -> sdk 
3. If you haven't created your SHA-1 fingerprint for our firebase console yet(astro-maget-pro)<br/>
you will have to create 1.
    - generate SHA-1 by running: 
  ```bat
    cd android && ./gradlew signingReport
  ``` 
    - After that copy the SHA-1 belong to 'debugAndroidTest' to firebase console(check firebases doc to see where to put this).  
4. Run 
```bat
 npx expo prebuild
```
⚠ do not do "npx expo prebuild --clean" since this will clear config of ios pod <br/>
⚠ if you already did prebuild --clean, paste these line again to ios pod file
```txt
  use_frameworks! :linkage => :static

  # Flags change depending on the env values.
  flags = get_default_flags()
  pod 'glog', :podspec => '../node_modules/react-native/third-party-podspecs/glog.podspec', :modular_headers => false
  pod 'FirebaseCoreInternal', :modular_headers => true
  pod 'FirebaseCore', :modular_headers => true
  pod 'GoogleUtilities', :modular_headers => true
  pod 'RNFBFirestore', :path => '../node_modules/@react-native-firebase/firestore', :modular_headers => true
```
5. Start your android emulator by going to android studio->start an emulator of your choice
6. Run
```bat
npx expo run:android
```
## Step to run on iOS emulator
run
```bat
cd ios && pod install
cd ../
npx expo run:ios
```

- Let me know if theres any problem on Discord 🦊 
