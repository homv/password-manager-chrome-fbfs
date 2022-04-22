import { initializeApp } from "firebase/app";
import * as fs from "firebase/firestore";
import { getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword, signOut,onAuthStateChanged  } from "firebase/auth";

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

const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  


var crypt = {
    secret : "g48d5r6",
    encrypt : (clear) => {
      var cipher = CryptoJS.AES.encrypt(clear, crypt.secret);
      cipher = cipher.toString();
      return cipher;
    },
    decrypt : (cipher) => {
      var decipher = CryptoJS.AES.decrypt(cipher, crypt.secret);
      decipher = decipher.toString(CryptoJS.enc.Utf8);
      return decipher;
    }
  };

  const firebaseConfig = {
    apiKey: "AIzaSyAqtd6yWIIy9lvlb8uZdg9MYUGrGHGf5ys",
    authDomain: "psmanager-f53c2.firebaseapp.com",
    projectId: "psmanager-f53c2",
    storageBucket: "psmanager-f53c2.appspot.com",
    messagingSenderId: "145029273730",
    appId: "1:145029273730:web:21ef0878483b84c2a3bc9b",
    measurementId: "G-T77ZE04D6K"
  };

  const app = initializeApp(firebaseConfig);
  const db = fs.getFirestore(app);
  const auth = getAuth(app);
  const ss = fs.collection(db,"websites");


  var domain;
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var url = tabs[0].url;
    if (url.indexOf("://") > -1) domain = url.split('/')[2];
    else domain = url.split('/')[0];
    domain = domain.split(':')[0];
    $('#site').val(domain);
  });

  $('#alertMsg').hide();
  $('#registerPanel').hide();
  $('#deletePanel').hide();
  $('#userPanel').hide();
  $('#auth').hide();

onAuthStateChanged(auth, (user) => {
    if (user) {
      afterlogin(auth.currentUser.uid);
    } else {
      $('#alertMsg').hide();
$('#registerPanel').show();
$('#deletePanel').hide();
$('#userPanel').hide();
$('#auth').hide();
    }
  });  



 
  $('#registerButton').click(async function()
  {
  if ( $('#usr').val().length == 0 || $('#pwd').val().length == 0 ) 
  {$('#alertMsg').text("Inputs cannot be blank");$('#alertMsg').show()};
  if(!validateEmail($('#usr').val()))
  {
    $('#alertMsg').text("Enter Proper Email Id");$('#alertMsg').show();
  }
  else
        {

                createUserWithEmailAndPassword(auth, $('#usr').val(), $('#pwd').val()).then((userCredential) => {
                    const user = userCredential.user;
                    const uuid = String(user.uid);
                    fs.setDoc(fs.doc(db, "users",uuid),{
                        email: $('#usr').val()});
                        $('#alertMsg').text("User Registered,Please Login");
                        $('#registerPanel').show();
                        $('#alertMsg').show();
                        $('#deletePanel').hide();
                        $('#userPanel').hide();
                        $('#auth').hide();
                }).catch((error) => {
                  
                $('#alertMsg').text("User Exits, Please login");
                $('#registerPanel').show();
                $('#alertMsg').show();
                $('#deletePanel').hide();
                $('#userPanel').hide();   
                $('#auth').hide();
            })
        };
  });

  async function afterlogin(cuname){
      var usern;
      var passw;
      var website;
    console.log(domain);
    const wee = fs.query(ss,fs.where("uid","==",cuname));
    const weer = await fs.getDocs(wee);
    console.log(wee);
    if(weer.empty)
    {
        $('#not').show();
        $('#managed').hide();
    }
    else
    {
        weer.forEach((doc)=>
        {
          if(doc.data().website_name==domain)
          {
            usern = doc.data().username;
            passw = encrypt((doc.data().password)); 
            website = doc.data().website_name;
          };
        });
    if(website!=domain)
    {
        $('#not').show();
        $('#managed').hide();   
    }
    else
    {
        $('#copyUser').val(usern);
        $('#copyPass').val(passw);
        $('#copyPass').get(0).type = 'password';
        $('#managed').show();
        $('#saveChange').hide();
        $('#not').hide();
    };
    };
    $('#registerPanel').hide();
    $('#deletePanel').hide();
    $('#userPanel').show();
    $('#auth').hide();
  }

  $('#loginButton').click(async function()
  {
    if ( $('#usr').val().length == 0 || $('#pwd').val().length == 0 ) 
    {$('#alertMsg').text("Inputs cannot be blank");$('#alertMsg').show()};
    if(!validateEmail($('#usr').val()))
    {
      $('#alertMsg').text("Enter Proper Email Id");$('#alertMsg').show()
    }
    else
        {
            signInWithEmailAndPassword(auth, $('#usr').val(), $('#pwd').val()).then((userCredential) => {
            afterlogin(userCredential.user.uid);
        console.log("Verified");}).catch((error) => {
          $('#alertMsg').text("invalid credentials");$('#alertMsg').show();
        });
      

        }
  });



  $('#plength').on("input",function()
  {     
    $('#pLen').text($('input[name=plength]').val());
  }
  )

  $('#generate').click(function() {
    var array = [];
    
    var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
    for (let i=0; i<alphabet.length; ++i) array.push(alphabet[i]);
    
    if ( $('input[name=upper]').is(':checked') ) {
        var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        for (let i=0; i<alphabet.length; ++i) array.push(alphabet[i]);
    }
    
    if ( $('input[name=numeric]').is(':checked') ) {
        var number = '0123456789'.split('');
        for (let i=0; i<number.length; ++i) array.push(number[i]);
    }
    
    if ( $('input[name=spChar]').is(':checked') ) {
        var special = '!@#$%^&*(){}][:;><,.]'.split('');
        for (let i=0; i<special.length; ++i) array.push(special[i]);
    }
    
    var passe = "";
    for (let i=0; i<parseInt($('input[name=plength]').val()); ++i) {
        passe += array[Math.floor(Math.random() * array.length)];
    } 
    
    $('#gpwd').val(passe);
});

$('#save').click(async function() {
    if ( $('#usrname').val().length == 0 || $('#spwd').val().length == 0 ) console.log('error:: username or password missing');
    else { 
        await fs.addDoc(ss, {
            uid: auth.currentUser.uid,
            password:encrypt($('#spwd').val()),
            website_name :domain,
            username:$('#usrname').val(),
            fingerprint: false,
            notification:false
          });
          $('#copyUser').val($('#usrname').val());
          $('#copyPass').val($('#spwd').val());
          $('#managed').show();
          $('#saveChange').hide();
          $('#not').hide();
        } 
});

$('#copyButtonGen').click(function() {
    navigator.clipboard.writeText($('#gpwd').val());
})

$('#change').click(async function() {
  console.log(auth.currentUser.uid);      
      var cooo = false;
      var website;
      var fingerprint;  
      var cudoc;
      const wee = fs.query(ss,fs.where("uid","==",auth.currentUser.uid));
      const weer = await fs.getDocs(wee);
      weer.forEach((doc)=>
      {
        if(doc.data().website_name==domain)
        {
          cudoc = doc.id;
        };
      });
      const notpa = fs.doc(db, "websites", String(cudoc));
      await fs.updateDoc(notpa, {notification: true});
      while(!cooo)
      {
    const wee = fs.query(ss,fs.where("uid","==",auth.currentUser.uid));
      const weer = await fs.getDocs(wee);
      weer.forEach((doc)=>
      {
        if(doc.data().website_name==domain)
        {
        website = doc.data().website_name;
        fingerprint = doc.data().fingerprint;
        cudoc = doc.id;
        };
      });
      cooo = fingerprint;  
      };
      const fupaut = fs.doc(db, "websites", String(cudoc));
      await fs.updateDoc(fupaut, {fingerprint: false,notification: false});
    $('#copyUser').attr('disabled', false);
    $('#copyPass').attr('disabled', false);
    $('#copyPass').get(0).type = 'text';
    $('#copyButtonUser').hide();
    $('#copyButtonPass').hide();
    $('#show').hide();
    $('#change').hide();
    $('#saveChange').show();
    $('#loginauto').hide();
});

$('#saveChange').click(async function() {
    if ( $('#copyUser').val().length == 0 || $('#copyPass').val().length == 0 ) console.log('error:: username or password missing');
    else { 
      var cudoc;
        const wee = fs.query(ss,fs.where("uid","==",auth.currentUser.uid));
        const weer = await fs.getDocs(wee);
        weer.forEach(async (doc) => {
            if(doc.data().website_name==domain){
                console.log("inside");
                cudoc = doc.id;
            };
        });
        const fupaut = fs.doc(db, "websites", String(cudoc));
        await fs.updateDoc(fupaut, {username: $('#copyUser').val(),password:encrypt($('#copyPass').val())});
        $('#change').show();
        $('#saveChange').hide();
        $('#loginauto').show();
        $('#show').show()
          afterlogin(auth.currentUser.uid);
        } 
});

$('#loginauto').click(async function(){
  console.log(auth.currentUser.uid);
  $('#auth').show(); 
  $('#registerPanel').hide();
  $('#alertMsg').hide();
  $('#deletePanel').hide();
  $('#userPanel').hide();
  
  var cooo = false;
  var website;
  var fingerprint;  
  var cudoc;
  const wee = fs.query(ss,fs.where("uid","==",auth.currentUser.uid));
  const weer = await fs.getDocs(wee);
  weer.forEach((doc)=>
  {
    if(doc.data().website_name==domain)
    {
      cudoc = doc.id;
    };
  });
  const notpa = fs.doc(db, "websites", String(cudoc));
  await fs.updateDoc(notpa, {notification: true});
  while(!cooo)
  {
const wee = fs.query(ss,fs.where("uid","==",auth.currentUser.uid));
  const weer = await fs.getDocs(wee);
  weer.forEach((doc)=>
  {
    if(doc.data().website_name==domain)
    {
    website = doc.data().website_name;
    fingerprint = doc.data().fingerprint;
    cudoc = doc.id;
    };
  });
  cooo = fingerprint;  
  };
  afterlogin(auth.currentUser.uid);
    chrome.tabs.query({active: true, currentWindow: true}, function (autofill) {
        chrome.tabs.executeScript(autofill[0].id,{code:"var uname =" + "'" + String($('#copyUser').val())+"';"+"var pass =" + "'" + String($('#copyPass').val())+"';"},function() {
            chrome.tabs.executeScript(autofill[0].id, {file: 'autofill.js'})
        });
    });
    const fupaut = fs.doc(db, "websites", String(cudoc));
    await fs.updateDoc(fupaut, {fingerprint: false});
});

$('#show').click(async function(){

    if($('#copyPass').get(0).type == 'password')
    {
      console.log(auth.currentUser.uid);      
      var cooo = false;
      var website;
      var fingerprint;  
      var cudoc;
      const wee = fs.query(ss,fs.where("uid","==",auth.currentUser.uid));
      const weer = await fs.getDocs(wee);
      weer.forEach((doc)=>
      {
        if(doc.data().website_name==domain)
        {
          cudoc = doc.id;
        };
      });
      const notpa = fs.doc(db, "websites", String(cudoc));
      await fs.updateDoc(notpa, {notification: true});
      while(!cooo)
      {
    const wee = fs.query(ss,fs.where("uid","==",auth.currentUser.uid));
      const weer = await fs.getDocs(wee);
      weer.forEach((doc)=>
      {
        if(doc.data().website_name==domain)
        {
        website = doc.data().website_name;
        fingerprint = doc.data().fingerprint;
        cudoc = doc.id;
        };
      });
      cooo = fingerprint;  
      };
      const fupaut = fs.doc(db, "websites", String(cudoc));
      await fs.updateDoc(fupaut, {fingerprint: false,notification: false});
        $('#copyPass').get(0).type = 'text';
        $('#show').text('hide');
    }
    else{
        $('#copyPass').get(0).type = 'password';
        $('#show').text('show');
    };
});

$('#logout').click(function(){
  signOut(auth).then(() => {
    console.log('signedout');
  }).catch((error) => {
    console.log('some error');
  });
  $('#alertMsg').hide();
$('#registerPanel').show();
$('#deletePanel').hide();
$('#userPanel').hide();
$('#auth').hide();
});
