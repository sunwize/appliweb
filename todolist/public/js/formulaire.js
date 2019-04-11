validatePassword = () => {
    var password = document.getElementById("password");
    var confirm_password = document.getElementById("confirm_password");

    if(password.value != confirm_password.value)
        confirm_password.setCustomValidity("Oops ! Les mots de passe sont différents !");
    else
        confirm_password.setCustomValidity('');
}