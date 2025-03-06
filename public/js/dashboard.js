
let user = sessionStorage.user ? JSON.parse(sessionStorage.user) : null;

console.log('Session Storage:', sessionStorage.user);
console.log('Parsed User:', user);


if (!user || !user.email) {


    location.replace('/login');
}
else if(!user.seller){
    location.replace('/seller');
}

let greeting = document.querySelector('#seller-greeting');

if (user && user.name) {
    greeting.innerHTML += user.name;
} else {
    location.replace('/login');
}


// loader

let loader = document.querySelector('.loader');
let noProductImg = document.querySelector('.no-product');

loader.style.display = 'block';

const setupProducts = () => {
    // Show loader while fetching data
    loader.style.display = 'block';

    fetch('/get-products', {

        method: 'POST',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({ email: user.email }),
        redirect: 'manual' // Prevent automatic redirection
    })
    .then(res => {
        // Check if the response is a redirect (302)
        if (res.status === 302) {
            const newLocation = res.headers.get('Location');
            console.log(`Redirecting to: ${newLocation}`);
            // Handle the redirect manually
            return fetch(newLocation, {
                method: 'POST',
                headers: new Headers({'Content-Type': 'application/json'}),
                body: JSON.stringify({ email: user.email })
            });
        } else if (!res.ok) {
            // Handle other non-200 responses
            return res.text().then(text => {
                throw new Error(`HTTP error! status: ${res.status}, message: ${text}`);
            });
        }
        return res.json(); // Process the response as JSON
    })
    .then(data => {
        if (data.length === 0) {
            alert('No products found.'); // User-friendly message
            loader.style.display = 'none'; // Hide loader
            return; // Exit the function
        }
        console.log(data); // Handle the data received from the server

        loader.style.display = 'none'; // Hide loader after processing data
    })
    .catch(error => {
        console.error('Error fetching products:', error);
        loader.style.display = 'none'; // Hide loader in case of error
        alert('Failed to load products. Please try again later.');
    });
}

// Call the function to set up products
setupProducts();
