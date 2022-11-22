# Astromagnet

## Authentication steps (Android)
1. Create an android project in firebase
2. For the `android package name` put  
    ```
    com.astromagnet.astromagnet
    ```
3. For the application name put 
    ```
    astro-magnet
    ```
4. For the SHA 1 key you will need to generate a new key
    1. 
    ```
    eas credentials
    ```
    2. follow the instructions to generate a new key
    3. copy the sha key and paste it there
4. After that go to the project setting and add the default SHA key
5. download the `google-services.json` file and put it in the main folder
6. run the following command to generate a development build
    ```
    eas build --profile development --platform android
    ```