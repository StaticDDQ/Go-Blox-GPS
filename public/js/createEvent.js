// JavaScript source code
const Http = new XMLHttpRequest();
const urlRegister = 'http://localhost:3000/register';

// submit user to mlab
function sendData() {
    var newUser = {
        "firstName": document.getElementById("firstName").value,
        "lastName": document.getElementById("lastName").value,
        "email": document.getElementById("email").value,
        "phone": document.getElementById("hp").value,
        
    };
    Http.open("POST", urlRegister);
    Http.setRequestHeader("Content-type", "application/json");

    var strJson = JSON.stringify(newUser);

    Http.send(strJson);
}

// check whether the new user is a duplicate or not
function userCreated(isSuccess) {
    if (isSuccess) {
        alert("User submitted");
    }
    else {
        alert("UserName already existed");
    }
}