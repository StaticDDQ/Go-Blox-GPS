// JavaScript source code
const Http = new XMLHttpRequest();
const urlRegister = 'http://goblox.herokuapp.com/members/register';

// submit user to mlab
function sendData() {
    
    var fName = document.getElementById("firstName").value;
    var lName = document.getElementById("lastName").value;
    var uName = document.getElementById("userName").value;
    var email = document.getElementById("email").value;
    var dob = document.getElementById("DOB").value;
    var password = document.getElementById("password").value;
    var confirmedPassword = document.getElementById("password_confirm").value;

    var newUser = {
        "firstName": fName,
        "lastName": lName,
        "userName": uName,
        "email": email,
        "DOB": dob,
        "password": password,
        "confirm": confirmedPassword
    };
    
    Http.open("POST", urlRegister);
    Http.setRequestHeader("Content-type", "application/json");

    var strJson = JSON.stringify(newUser);

    Http.send(strJson);
}