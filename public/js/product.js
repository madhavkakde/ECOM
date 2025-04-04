// Product page setting
let productName = document.querySelector('.product-title');
let shortDes = document.querySelector('.product-des');
let price = document.querySelector('.price');
let productImage = document.querySelector('.product-image');
let detail = document.querySelector('.des'); // Ensure this element exists
let title = document.querySelector('title');

let cartBtn = document.querySelector('.cart-btn');
// let buyNowBtn = document.querySelector('.buy-btn');

const setData = (data) => {
    title.innerHTML = data.name; // Set the title
    productName.innerHTML = data.name; // Use textContent for safety
    productImage.src = data.img; // Assuming data.img is a URL
    shortDes.innerHTML = data.shortDes; // Use textContent for safety
    detail.innerHTML = data.detail; // Use textContent for safety
    price.innerHTML = `$${data.price}`; // Use textContent for safety

    cartBtn.addEventListener('click', () => {
        cartBtn.innerHTML = add_product_to_cart(data);
    })
}
//function to fetch product data
const fetchProductData = () => {
    console.log('Product ID:', productId);
    const requestBody = { id: productId };
    console.log('Request Body:', requestBody);

    fetch('/get-products', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(requestBody)
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json(); // Parse the JSON response
        })
        .then(data => {
            if (!data || !data.name) { // Check if the product data is valid
                alert('Product not found');
                location.replace('/404');
                return;
            }
            setData(data);
            getProducts(data.tags[0]).then(res => createProductCards(res, 'similar products', '.best-selling-product-section'));
        })
        .catch(err => {
            console.log(err);
            alert('No product found');
            // location.replace('/404');
        });
}

let productId = null;
if (location.pathname !== '/add-product') {
    productId = decodeURI(location.pathname.split('/').pop());
    console.log("productId")
    console.log(productId);
    fetchProductData();
}