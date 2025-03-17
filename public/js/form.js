window.onload = () => {
    if (sessionStorage.user) {
        user = JSON.parse(sessionStorage.user);
        if (user.email) {
            location.replace('/');
        }
    }
}

// form
let formBtn = document.querySelector('.submit-btn');
let loader = document.querySelector('.loader');

formBtn.addEventListener('click', () => {
    let fullname = document.querySelector('#name') || null;
    let email = document.querySelector('#email');
    let password = document.querySelector('#password');
    let number = document.querySelector('#number') || null;
    let tc = document.querySelector('#tc') || null;

    // form validation
    if (fullname != null) { // sign up page
        if (fullname.value.length < 3) {
            showFormError('Name must be at least 3 characters long');
        }
        else if (!email.value.length) {
            showFormError('Enter your email');
        }
        else if (password.value.length < 8) {
            showFormError('Password must be at least 8 characters long');
        }
        else if (Number(number) || number.value.length < 10) {
            showFormError('Enter a valid phone number');
        }
        else if (!tc.checked) {
            showFormError('You must agree to the terms and conditions');
        }
        else {
            //submit form
            loader.style.display = 'block';
            sendData('/signup', {
                name: fullname.value,
                email: email.value,
                password: password.value,
                number: number.value,
                tc: tc.checked
            });
        }
    }
    else {     // login page
        if (!email.value.length || !password.value.length) {
            showFormError('Please fill in all fields');
        }
        else {
            //submit form
            loader.style.display = 'block';
            sendData('/login', {
                email: email.value,
                password: password.value
            });
        }
    }
});