import 'test.dart';

class Encryption {
  static const encryptionKey = 'UNIQUE';

  static String encrypt(String data) {
    var charCount = data.length;
    var encrypted = [];
    var kp = 0;
    var kl = encryptionKey.length - 1;

    for (var i = 0; i < charCount; i++) {
      var other = data[i].codeUnits[0] ^ encryptionKey[kp].codeUnits[0];
      encrypted.insert(i, other);
      kp = (kp < kl) ? (++kp) : (0);
    }
    return dataToString(encrypted);
  }

  static String decrypt(data) {
    return encrypt(data);
  }

  static String dataToString(data) {
    var s = "";
    for (var i = 0; i < data.length; i++) {
      s += String.fromCharCode(data[i]);
    }
    return s;
  }
}

final en = Encryption.encrypt("124");
debugPrint(en);