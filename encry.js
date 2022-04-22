var encryptionKey = "UNIQUE";

function encrypt(data) {
    var charCount = data.length;
    var encrypted = [];
    var kp = 0;
    var kl = encryptionKey.length - 1;
    for (var i = 0; i < charCount; i++) {
        var other = data[i].charCodeAt(0) ^ encryptionKey[kp].charCodeAt(0);
        encrypted.push(other);
        kp = (kp < kl) ? (++kp) : (0);
    };
    console.log(encrypted);
    return dataToString(encrypted);
}

function dataToString(data) {
    var s = "";
    for (var i = 0; i < data.length; i++) {
      s += String.fromCharCode(data[i]);
    }
    return s;
  }


console.log(encrypt("123"));
console.log(encrypt(encrypt("123")));