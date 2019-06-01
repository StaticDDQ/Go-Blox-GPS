// JavaScript source code
var pwd = document.getElementById('pwd');
var letter = document.getElementById('let');
var number = document.getElementById('num');
var length = document.getElementById('len');

var isValid = false;

pwd.onkeyup = function() {

    // Validate lowercase letters
    var lowerCaseLetters = /[a-z]/g;
    if(pwd.value.match(lowerCaseLetters)) {  
        letter.classList.remove("invalid");
        letter.classList.add("valid");
    } else {
        letter.classList.remove("valid");
        letter.classList.add("invalid");
        isValid = false;
    }

    // Validate numbers
    var numbers = /[0-9]/g;
    if(pwd.value.match(numbers)) {  
        number.classList.remove("invalid");
        number.classList.add("valid");
    } else {
        number.classList.remove("valid");
        number.classList.add("invalid");
        isValid = false;
    }
  
    // Validate length
    if(pwd.value.length >= 8) {
        length.classList.remove("invalid");
        length.classList.add("valid");
    } else {
        length.classList.remove("valid");
        length.classList.add("invalid");
        isValid = false;
    }

    isValid = true;
}

function openSpan() {
    var popup = document.getElementById("pwdSpan");
    popup.classList.toggle("show");
}
    
function agreed(){
    var att = document.getElementById('agree');
    if(!att.checked) {
    alert('You must agree to the terms and conditions!');
    return false;
    }
    if(!isValid){
    alert('Password is still not valid!');
    return false;
    }
    return true;
}

function previewImage(event){
    var reader = new FileReader();
    var imageField = document.getElementById("image-field")
    reader.onload = function(){
        if(reader.readyState == 2){
            imageField.src = reader.result;
        }
    }
    reader.readAsDataURL(event.target.files[0]);
}

// Setting tab functions
function openPopup(){
    document.getElementById("overlay").style.display = "block";
}

function removePopup(){
    document.getElementById("overlay").style.display = "none";
}
