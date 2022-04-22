import { initializeApp } from "firebase/app";
import * as fs from "firebase/firestore";
import { getAuth } from "firebase/auth";

var cuname;
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
  const ps = fs.collection(db, "users");
  const ss = fs.collection(db,"sdata");


  var domain;
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var url = tabs[0].url;
    if (url.indexOf("://") > -1) domain = url.split('/')[2];
    else domain = url.split('/')[0];
    domain = domain.split(':')[0];
    $('#site').val(domain);
  });

$('#alertMsg').hide();
$('#registerPanel').show();
$('#deletePanel').hide();
$('#userPanel').hide();
    
  $('#registerButton').click(async function()
  {
  if ( $('#usr').val().length == 0 || $('#pwd').val().length == 0 ) 
  {$('#alertMsg').text("Inputs cannot be blank");$('#alertMsg').show()}
  else
        {
            
            const c = fs.query(ps, fs.where("uname", "==", $('#usr').val()));
            console.log($('#usr').val());
            const qs = await fs.getDocs(c);
            console.log(qs.empty);
            if(qs.empty)
            {
                await fs.setDoc(fs.doc(db, "users",$('#usr').val()),{
                    pass: $('#pwd').val()
                  });
                  $('#alertMsg').text("User Registered,Please Login");
                  $('#registerPanel').show();
                  $('#alertMsg').show();
                  $('#deletePanel').hide();
                  $('#userPanel').hide();
            }
            else
            {
                $('#alertMsg').text("User Exits, Please login");
                $('#registerPanel').show();
                $('#alertMsg').show();
                $('#deletePanel').hide();
                $('#userPanel').hide();   
            }
        };
  });

  $('#loginButton').click(async function()
  {
  if ( $('#usr').val().length == 0 || $('#pwd').val().length == 0 )
  {$('#alertMsg').text("Inputs cannot be blank");$('#alertMsg').show()}
  else
        {
            var usern;
            var passw;
            var website;
            console.log($('#usr').val());
            const qs = await fs.getDoc(fs.doc(db,"users",$('#usr').val()));
            if(qs.exists())
            {
                let pass="";
                pass = qs.data().pass;
                if($('#pwd').val() == pass)
                {
                    cuname = $('#usr').val();
                    console.log(domain);
                    const wee = fs.query(ss,fs.where("uname","==",cuname));
                    const weer = await fs.getDocs(wee);
                    if(weer.empty)
                    {
                        $('#not').show();
                        $('#managed').hide();
                    }
                    else
                    {
                        weer.forEach((doc)=>
                        {
                            
                            usern = doc.data().username;
                            passw = doc.data().password; 
                            pass = doc.data().pass;
                            website = doc.data().website;
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
                    pass = "";
                }
                else 
                    {
                        $('#alertMsg').text("Incorrect password");
                        $('#alertMsg').show();
                    };
            }
            else
            {
                $('#alertMsg').text("User Does Not Exits, Please Register");
                $('#registerPanel').show();
                $('#alertMsg').show();
                $('#deletePanel').hide();
                $('#userPanel').hide();  

            };
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
            uname: cuname,
            password:crypt.encrypt($('#spwd').val()),
            website:domain,
            username:$('#usrname').val()
          });
          $('#copyUser').val($('#usrname').val());
          $('#copyPass').val(crypt.encrypt($('#spwd').val()));
          $('#managed').show();
          $('#saveChange').hide();
          $('#not').hide();
        } 
});

$('#copyButtonGen').click(function() {
    navigator.clipboard.writeText($('#gpwd').val());
})

$('#change').click(function() {
    $('#copyUser').attr('disabled', false);
    $('#copyPass').attr('disabled', false);
    
    $('#copyButtonUser').hide();
    $('#copyButtonPass').hide();
    
    $('#change').hide();
    $('#saveChange').show();
    $('#loginauto').hide();
});

$('#saveChange').click(async function() {
    if ( $('#copyUser').val().length == 0 || $('#copyPass').val().length == 0 ) console.log('error:: username or password missing');
    else { 
        const wee = fs.query(ss,fs.where("uname","==",cuname));
        const weer = await fs.getDocs(wee);
        var docid;
        weer.forEach(async (doc) => {
            if(doc.data().website==domain){
                console.log(doc.data());
            };
        })
          $('#copyUser').attr('disabled', true);
          $('#copyPass').get(0).type = 'password';
        $('#copyPass').attr('disabled', true)
          $('#managed').show();
          $('#saveChange').hide();
          $('#not').hide();
        } 
});

$('#loginauto').click(function(){
    chrome.tabs.query({active: true, currentWindow: true}, function (autofill) {
        chrome.tabs.executeScript(autofill[0].id,{code:"var uname =" + "'" + String($('#copyUser').val())+"';"+"var pass =" + "'" + String($('#copyPass').val())+"';"},function() {
            chrome.tabs.executeScript(autofill[0].id, {file: 'autofill.js'})

        });
    });
});

$('#show').click(function(){
    if($('#copyPass').get(0).type == 'password')
    {
        $('#copyPass').get(0).type = 'text';
        $('#show').text('hide');
    }
    else{
        $('#copyPass').get(0).type = 'password';
        $('#show').text('show');
    };
});

