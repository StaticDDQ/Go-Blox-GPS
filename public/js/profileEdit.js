document.getElementById('start').click();

var pwd = document.getElementById('newPwd');
var letter = document.getElementById('let');
var number = document.getElementById('num');
var length = document.getElementById('len');

var isValid = false;

pwd.onkeyup = function () {

    // Validate lowercase letters
    var lowerCaseLetters = /[a-z]/g;
    if (pwd.value.match(lowerCaseLetters)) {
        letter.classList.remove("invalid");
        letter.classList.add("valid");
    } else {
        letter.classList.remove("valid");
        letter.classList.add("invalid");
        isValid = false;
    }

    // Validate numbers
    var numbers = /[0-9]/g;
    if (pwd.value.match(numbers)) {
        number.classList.remove("invalid");
        number.classList.add("valid");
    } else {
        number.classList.remove("valid");
        number.classList.add("invalid");
        isValid = false;
    }

    // Validate length
    if (pwd.value.length >= 8) {
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

function openTab(evt, tabName) {

    // Declare all variables
    var i, tabcontent, tablinks;
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Setting tab functions
function openSettings() {
    document.getElementById("overlay").style.display = "block";
}

var tags = [];
var tagLst = document.getElementById('checked');

function removeSettings() {
    document.getElementById("overlay").style.display = "none";
    tags = [];
}

function previewImage(event) {
    var reader = new FileReader();
    var imageField = document.getElementById("image-field")
    reader.onload = function () {
        if (reader.readyState == 2) {
            imageField.src = reader.result;
        }
    }
    reader.readAsDataURL(event.target.files[0]);
}

function addTag() {
    var tagValue = document.getElementById('input');

    if (tagValue.value.length > 0 && !tags.includes(tagValue.value.toLowerCase())) {
        var tag = document.createElement('input');
        tag.type = 'text';
        tag.value = tagValue.value.toLowerCase();
        tag.name = 'interests';
        tag.readonly = true;
        tag.onclick = function () {
            var index = tags.indexOf(tag.value.toLowerCase());
            tags.splice(index, 1);
            tag.parentNode.removeChild(tag);
        }

        tagLst.appendChild(tag);

        tags.push(tagValue.value.toLowerCase());
    }
    tagValue.value = "";
}
