// JavaScript source code
const Http = new XMLHttpRequest();
const urlRegister = 'http://localhost:3000/register';

function sendData() {
    var newUser = {
        "firstName": document.getElementById("firstName").value,
        "lastName": document.getElementById("lastName").value,
        "userName": document.getElementById("userName").value,
        "email": document.getElementById("email").value,
        "DOB": document.getElementById("DOB").value,
        "password": document.getElementById("password").value
    };
    Http.open("POST", urlRegister);
    Http.setRequestHeader("Content-type", "application/json");

    var strJson = JSON.stringify(newUser); 

    Http.send(strJson);
}