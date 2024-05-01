# Safecantonese.ai app

## About

This app was made with the aim of bring safer AI Cantonese
transcription to the general public, backed by whisper speech-to-text
models developed by OpenAI and fine-tuned by me. Your audio files
are transcribed right in your device without ever leaving it.

## Download

**Warning**: The app on play store & github release apks after v1.7.0 work out of the box. If you wish to build yourself or use apks in github releases （prior to version 1.7.0), you must add the models into the assets/models directory into the apk and re-sign it by yourself. If you don't know what it means, use google play.

[![Play Store](./images/google-play-badge.png)](https://play.google.com/store/apps/details?id=me.wcyat.safecantoneseai)

## Technologies

- react native (expo)
- [whisper.cpp](https://github.com/ggerganov/whisper.cpp) (using [whisper.rn](https://github.com/mybigday/whisper.rn))

## Build instructions

```bash
git clone --recurse-submodules https://github.com/sdip15fa/safecantonese.ai.app
yarn global install eas-cli
yarn install
eas build --platform android --profile production --local
```

## Support

[telegram group](https://t.me/safecantoneseai)

## Maintenance

Submit issues if you encounter any bugs or any feature requests.
I am going to take DSE soon so I won't be very active. Low-priority
issues may not be fixed. Please don't expect me (as I am really buzy)
to fix issues quickly. If a feature is deemed eazy to implement
(~10 mins of my time), then it's more possible I'll do it.

## Contributions

Pull requests are more than welcome. If you can fix a bug, or introduce a feature, feel free to do so. Please test carefully to make sure it doesn't break anything. Please also submit test videos for reference.

## License

[GPL-3.0-or-later](./LICENSE.md)
