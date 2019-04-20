const Http = new XMLHttpRequest();
const urlRegister = 'http://localhost:3000/login';

// submit user to mlab
function sendData() {
    var newUser = {
        "userName": document.getElementById("userName").value,
        "password": document.getElementById("password").value
    };
    Http.open("GET", urlRegister);
    Http.setRequestHeader("Content-type", "application/json");

    var strJson = JSON.stringify(newUser);

    Http.send(strJson);
}

function userCreated(isSuccess) {
    if (isSuccess) {
        alert("Access granted");
    }
    else {
        alert("Not correct");
    }
}
