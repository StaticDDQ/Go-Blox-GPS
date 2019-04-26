// JavaScript source code
const Http = new XMLHttpRequest();
const urlRegister = 'http://localhost:3000/members/register';
var moment = require('moment');


// submit user to mlab
function sendData() {

    var fName = document.getElementById("firstName").value;
    var lName = document.getElementById("lastName").value;
    var uName = document.getElementById("userName").value;
    var email = document.getElementById("email").value;
    var dob = document.getElementById("DOB").value;
    var password = document.getElementById("password").value;
    var confirmedPassword = document.getElementById("password_confirm").value;
    var today = moment().format('yyyy-mm-dd:hh:mm:ss');

    var newUser = {
        "firstName": fName,
        "lastName": lName,
        "userName": uName,
        "email": email,
        "DOB": dob,
        "password": password,
        "confirm": confirmedPassword,
        "joined_date": today
    };
    Http.open("POST", urlRegister);
    Http.setRequestHeader("Content-type", "application/json");

    var strJson = JSON.stringify(newUser);

    Http.send(strJson);
}