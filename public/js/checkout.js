window.onload = () => {
    if (!sessionStorage.user) {
        location.replace('/login');
    }
};

// Select place order button
const placeOrderBtn = document.querySelector('.place-order-btn');

placeOrderBtn.addEventListener('click', async () => {
    // Get the address from the form
    let address = getAddress();

    // Check if the address is valid
    if (typeof address === "object") {
        // Retrieve the user object from sessionStorage
        const user = JSON.parse(sessionStorage.getItem("user"));
        const userId = user._id; // Extract the user ID

        // Get products from local storage
        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        // Map the cart items to the required format for the order
        const products = cart.map(item => ({
            productId: item.productId, // Assuming 'item' is the product ID
            product: item.name,
            price: item.price,
            quantity: item.item // Default quantity set to 1
        }));

        // Validate that products are not empty
        if (products.length === 0) {
            showFormError('Cart is empty or invalid.');
            return;
        }

        // Prepare the order data
        let orderData = {
            // userId: userId, // Use the correct user ID
            address: address, // The address object
            products: products, // Validated products array
            paymentMethod: "Cash on Delivery", // Payment method
        };

        console.log("Sending Order Data:", orderData);

        try {
            // Send the order data to the backend
            const response = await fetch('/place-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData) // Convert order data to JSON
            });

            // Parse the response from the server
            const data = await response.json();
            console.log("Response from Server:", data);

            // Check if the order was placed successfully
            if (data.success) {
                showFormError('Order placed successfully! Will be delivered soon.');
                sessionStorage.removeItem("cart"); // Clear the cart
                // setTimeout(() => location.replace('/orders'), 2000); // Redirect to orders page
            } else {
                showFormError(data.message || 'Something went wrong. Try again!');
            }
        } catch (err) {
            console.error("Error:", err);
            showFormError('Server error, please try again later.');
        }
    } else {
        showFormError('Please provide a valid address.');
    }
});
// Function to validate and get address
const getAddress = () => {
    let name = document.querySelector('#name').value;
    let address = document.querySelector('#address').value;
    let street = document.querySelector('#street').value;
    let city = document.querySelector('#city').value;
    let state = document.querySelector('#state').value;
    let pincode = document.querySelector('#pincode').value;
    let landmark = document.querySelector('#landmark').value;

    if (!name || !address || !street || !city || !state || !pincode || !landmark) {
        showFormError('Fill all the fields');
        return null;
    }
    return { name, address, street, city, state, pincode, landmark };
};
