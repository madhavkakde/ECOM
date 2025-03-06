document.querySelector('.submit-btn').addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent default form submission

    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log('Login Response:', data); // Debugging log to check the response


    if (data.alert) {
        alert(data.alert); // Show alert if there's an error
    } else {
        // Store user data in sessionStorage
        console.log('Storing user data in sessionStorage:', data); // Debugging log before storing

        sessionStorage.setItem('user', JSON.stringify(data));
        window.location.href = '/dashboard'; // Redirect to dashboard
    }
});
