import { Linking } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "react-native-ui-lib";

export default function Page() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={{ margin: 10 }}>
          <Text text40 style={{ margin: 5 }}>
            About
          </Text>
          <Text style={{ margin: 5 }}>
            This app was made with the aim of bring safer AI Cantonese
            transcription to the general public, backed by whisper
            speech-to-text models developed by OpenAI and fine-tuned by wcyat.
            Your audio files are transcribed right in your device without ever
            leaving it.
          </Text>
          <Text text40 style={{ margin: 5 }}>
            Author
          </Text>
          <Text
            style={{ color: "blue", margin: 5 }}
            onPress={() => Linking.openURL("https://wcyat.me")}
          >
            wcyat
          </Text>
          <Text text40 style={{ margin: 5 }}>
            Contact
          </Text>
          <Text
            style={{ color: "blue", margin: 5 }}
            onPress={() => Linking.openURL("https://t.me/safecantoneseai")}
          >
            Telegram Group
          </Text>
          <Text
            style={{ color: "blue", margin: 5 }}
            onPress={() => Linking.openURL("mailto:wcyat@wcyat.me")}
          >
            wcyat@wcyat.me
          </Text>
          <Text text40 style={{margin: 5}}>
            Version
          </Text>
          <Text
            style={{ color: "blue", margin: 5 }}
            onPress={() =>
              Linking.openURL(
                "https://github.com/sdip15fa/safecantonese.ai.app/releases/tag/1.6.1"
              )
            }
          >
            1.6.1
          </Text>
          <Text text40 style={{ margin: 5 }}>
            Source Code
          </Text>
          <Text
            style={{ color: "blue", margin: 5 }}
            onPress={() =>
              Linking.openURL(
                "https://github.com/sdip15fa/safecantonese.ai.app"
              )
            }
          >
            https://github.com/sdip15fa/safecantonese.ai.app
          </Text>
          <Text text40 style={{ margin: 5 }}>
            Copyright
          </Text>
          <Text style={{ margin: 5 }}>
            Copyright © Wong Chun Yat (wcyat) 2024-present.
          </Text>
          <Text
            style={{ color: "blue", margin: 5 }}
            onPress={() =>
              Linking.openURL(
                "https://github.com/sdip15fa/safecantonese.ai.app/blob/1.6.1/LICENSE.md"
              )
            }
          >
            GPL-3.0-or-later
          </Text>
          <Text
          style={{ color: "blue", margin: 5 }}
            onPress={() => {
              Linking.openURL(
                "https://github.com/sdip15fa/safecantonese.ai.app/blob/1.6.1/third-party-licenses.txt"
              );
            }}
          >
            Third-party Licenses
          </Text>
          <Text text40 style={{ margin: 5 }}>
            Icon
          </Text>
          <Text
            style={{ color: "blue", margin: 5 }}
            onPress={() =>
              Linking.openURL(
                "https://www.flaticon.com/free-icons/artificial-intelligence"
              )
            }
          >
            Artificial intelligence icons created by Eucalyp - Flaticon
          </Text>
          <Text text40 style={{ margin: 5 }}>
            Privacy Policy
          </Text>
          <Text style={{ margin: 5 }}>
            None of your audio files ever leave your device. We do not host a
            server and do not collect data of any kind. To ensure maximum privacy,
            the app does not use the Internet for any purposes. For Android, the 
            Internet permission is disabled and it is not possible for the app
            to transmit data to any servers.
          </Text>
          <Text text40 style={{ margin: 5 }}>
            Disclaimer
          </Text>
          <Text style={{ margin: 5 }}>
            THERE IS NO WARRANTY FOR THE PROGRAM, TO THE EXTENT PERMITTED BY
            APPLICABLE LAW. EXCEPT WHEN OTHERWISE STATED IN WRITING THE
            COPYRIGHT HOLDERS AND/OR OTHER PARTIES PROVIDE THE PROGRAM "AS IS"
            WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED,
            INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
            MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. THE ENTIRE
            RISK AS TO THE QUALITY AND PERFORMANCE OF THE PROGRAM IS WITH YOU.
            SHOULD THE PROGRAM PROVE DEFECTIVE, YOU ASSUME THE COST OF ALL
            NECESSARY SERVICING, REPAIR OR CORRECTION.
          </Text>
          <Text style={{ margin: 5 }}>
            IN NO EVENT UNLESS REQUIRED BY APPLICABLE LAW OR AGREED TO IN
            WRITING WILL ANY COPYRIGHT HOLDER, OR ANY OTHER PARTY WHO MODIFIES
            AND/OR CONVEYS THE PROGRAM AS PERMITTED ABOVE, BE LIABLE TO YOU FOR
            DAMAGES, INCLUDING ANY GENERAL, SPECIAL, INCIDENTAL OR CONSEQUENTIAL
            DAMAGES ARISING OUT OF THE USE OR INABILITY TO USE THE PROGRAM
            (INCLUDING BUT NOT LIMITED TO LOSS OF DATA OR DATA BEING RENDERED
            INACCURATE OR LOSSES SUSTAINED BY YOU OR THIRD PARTIES OR A FAILURE
            OF THE PROGRAM TO OPERATE WITH ANY OTHER PROGRAMS), EVEN IF SUCH
            HOLDER OR OTHER PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH
            DAMAGES.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
