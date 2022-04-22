var inputs = document.getElementsByTagName('input');
var inputLength = inputs.length;
for (let i = 0; i < inputLength; i++) {
    const input = inputs.item(i);
    if(input.type=="text")
    {
        input.value = String(uname);
    };
    if(input.type=="password")
    {
        input.value = String(pass);
    };
};

