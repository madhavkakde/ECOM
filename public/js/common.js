async function sendData(url, data) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        loader.style.display = 'none'; // Hide loader after response
        const result = await response.json();
        // Handle success (e.g., show a success message or redirect)
        console.log('Success:', result);
        processData(result);
        return result;// Call processData with the result
    } catch (error) {
        loader.style.display = 'none'; // Hide loader on error
        showFormError('An error occurred while submitting your application. Please try again.');
        console.error('Error:', error);
    }
}

const processData = (data) => {
    loader.style.display = 'none';
    if (data.alert) {
        showFormError(data.alert);
    }
    else if (data.email) {
        sessionStorage.user = JSON.stringify(data);
        if (location.search.includes('after')) {
            let pageId = location.search.split('=')[1];
            location.replace(`/products/${pageId}`);
        }
        else {
            location.replace('/'); // Redirect to homepage
        }
    }
    else if (data.seller) {
        let user = JSON.parse(sessionStorage.user);
        user.seller = true;
        sessionStorage.user = JSON.stringify(user);
        location.replace('/dashboard');
    }
    else if (data.product) {
        location.replace('/dashboard');
    }
    else if (data) {
        console.log(data);
        // location.reload();
    }
}

const showFormError = (err) => {
    let errorEle = document.querySelector('.error');
    errorEle.innerHTML = err;
    errorEle.classList.add('show');

    setTimeout(() => {
        errorEle.classList.remove('show');
    }, 2000);
}
