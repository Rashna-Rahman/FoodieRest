
/* FoodieRest - auth.js */

// Admin Registration
function validateRegister(role) {

    let fullName = document.getElementById("fullName").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let adminCode = document.getElementById("adminCode").value;
    let password = document.getElementById("password").value;
    let confirmPassword =
        document.getElementById("confirmPassword").value;
    let agree = document.getElementById("agree").checked;

    let gender = document.querySelector(
        'input[name="gender"]:checked'
    ).value;

    let errors = [];

    if (fullName == "") {
        errors.push("Full name is required.");
    }

    if (email == "" || email.indexOf("@") == -1 ||
        email.indexOf(".") == -1) {
        errors.push("Enter a valid email address.");
    }

    if (phone.length != 11 || phone.slice(0, 2) != "01" ||
        isNaN(phone)) {
        errors.push("Phone number must be 11 digits.");
    }

    if (adminCode != "admin123") {
        errors.push("Wrong admin secret code.");
    }

    if (password.length < 6) {
        errors.push("Password must be at least 6 characters.");
    }

    if (password != confirmPassword) {
        errors.push("Passwords do not match.");
    }

    if (!agree) {
        errors.push("Please agree to the terms.");
    }

    let users = getData("users");

    for (let i = 0; i < users.length; i++) {
        if (users[i].email == email) {
            errors.push("Email already registered.");
        }
    }

    if (errors.length > 0) {
        showMessage("formMessage", errors.join("<br>"), true);
        return false;
    }

    let newUser = {
        userId: getNextId(users, "userId"),
        fullName: fullName,
        email: email,
        phone: phone,
        password: password,
        gender: gender,
        address: "",
        role: "admin"
    };

    users.push(newUser);

    saveData("users", users);

    alert("Registration successful! Please login.");

    window.location.href = "admin-login.html";

    return false;
}


// Admin Login
function validateLogin(role) {

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let remember = document.getElementById("remember").checked;

    if (email == "" || password == "") {
        showMessage(
            "formMessage",
            "Please enter email and password.",
            true
        );

        return false;
    }

    let users = getData("users");
    let foundUser = null;

    for (let i = 0; i < users.length; i++) {

        if (users[i].email == email &&
            users[i].password == password &&
            users[i].role == "admin") {

            foundUser = users[i];
            break;
        }
    }

    if (foundUser == null) {
        showMessage(
            "formMessage",
            "Invalid email or password.",
            true
        );

        return false;
    }

    // Remember Email
    if (remember) {
        localStorage.setItem("rememberEmail", email);
    } else {
        localStorage.removeItem("rememberEmail");
    }

    // Save Current Admin
    let currentUser = {
        userId: foundUser.userId,
        fullName: foundUser.fullName,
        email: foundUser.email,
        role: foundUser.role
    };

    localStorage.setItem(
        "currentUser",
        JSON.stringify(currentUser)
    );

    window.location.href = "admin-dashboard.html";

    return false;
}


// Fill Remembered Email
function fillRememberedEmail() {

    let savedEmail = localStorage.getItem("rememberEmail");

    if (savedEmail != null) {

        let emailBox = document.getElementById("email");
        let rememberBox = document.getElementById("remember");

        if (emailBox != null) {
            emailBox.value = savedEmail;
        }

        if (rememberBox != null) {
            rememberBox.checked = true;
        }
    }
}
