// JavaScript source code
const Http = new XMLHttpRequest();
const urlRegister = 'http://localhost:3000/events/getEvent/';

// submit user to mlab
function sendData() {
    var newUser = {
        "name": document.getElementById("eventName").value,
        "date": document.getElementById("Date").value,
        "email": document.getElementById("email").value,
        "organiser": document.getElementById("organiser").value,
        "address": document.getElementById("location").value,
        "description": document.getElementById("description").value,
        "email": document.getElementById("email").value,
        "phone": document.getElementById("number").value
    };
    Http.open("POST", urlRegister);
    Http.setRequestHeader("Content-type", "application/json");

    var strJson = JSON.stringify(newUser);

    Http.send(strJson);
}

// // check whether the new user is a duplicate or not
// function userCreated(isSuccess) {
//     if (isSuccess) {
//         alert("User submitted");
//     }
//     else {
//         alert("UserName already existed");
//     }
// }