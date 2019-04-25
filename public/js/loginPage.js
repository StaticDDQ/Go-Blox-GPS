const Http = new XMLHttpRequest();
const urlRegister = 'http://localhost:3000/members/login';

// get user to mlab
function getData() {
    var newUser = {
        "userName": document.getElementById("userName").value,
        "password": document.getElementById("passWord").value
    };
    Http.open("POST", urlRegister);
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
