// JavaScript source code
const Http = new XMLHttpRequest();
const urlRegister = 'http://localhost:3000/members/register';

// submit user to mlab
function sendData() {

    var fName = document.getElementById("firstName").value;
    var lName = document.getElementById("lastName").value;
    var uName = document.getElementById("userName").value;
    var email = document.getElementById("email").value;
    var dob = document.getElementById("DOB").value;
    var password = document.getElementById("password").value;
    var confirmedPassword = password.length > 0 && password === document.getElementById("password_confirm").value;

    if (fName.length > 0) {
        if (lName.length > 0) {
            if (uName.length > 0) {
                if (confirmedPassword) {
                    var validEmail = validate(email);
                    if (validEmail) {
                        if (dob.length > 0) {
                            var newUser = {
                                "firstName": fName,
                                "lastName": lName,
                                "userName": uName,
                                "email": email,
                                "DOB": dob,
                                "password": password
                            };
                            Http.open("POST", urlRegister);
                            Http.setRequestHeader("Content-type", "application/json");

                            var strJson = JSON.stringify(newUser);

                            Http.send(strJson);
                        } else {
                            alert("Enter Date of birth");
                        }
                    } else {
                        alert("Enter valid email");
                    }
                } else {
                    alert("Enter/confirm password");
                }
            } else {
                alert("Enter user name");
            }
        } else {
            alert("Enter last name");
        }
    } else {
        alert("Enter first name");
    }
}

function validate(email) {
    var format = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return format.test(String(email).toLowerCase());
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