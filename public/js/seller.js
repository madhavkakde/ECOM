let loader = document.querySelector('.loader');
let applyBtn = document.querySelector('.apply-btn');

applyBtn.addEventListener('click', async () => {
    let businessName = document.querySelector('#name').value;
    let address = document.querySelector('#address').value;
    let about = document.querySelector('#about').value;
    let number = document.querySelector('#number').value;

    if (!businessName.length || !address.length || !about.length || number.length < 10 || !Number(number)) {
        showFormError('Some information(s) are missing or invalid');
    } else {
        loader.style.display = 'block';

        let email;
        try {
            email = JSON.parse(sessionStorage.user).email; // Attempt to parse email
        } catch (error) {
            console.error("Failed to parse sessionStorage.user:", error);
            showFormError('User  information is not available. Please log in again.');
            loader.style.display = 'none'; // Hide loader if there's an error
            return; // Exit the function
        }

        // Send data to the server
        await sendData('/seller', {
            name: businessName,
            address: address,
            about: about,
            number: number,
            email: email
        });
    }
});