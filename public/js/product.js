import {getProducts, createProductCards} from './home.js';

let ratingStarInput = [...document.querySelectorAll('.rating-star')];

ratingStarInput.map((star, index) => {
    star.addEventListener('click', () => {
        for(let i = 0; i < 5; i++){
            if(i <= index){
                ratingStarInput[i].src = 'img/fill star.png';
            }
            else{
                ratingStarInput[i].src = 'img/no fill star.png';
            }
        }
    })

})
// Product page setting
let productName = document.querySelector('.product-title');
let shortDes = document.querySelector('.product-des');
let price = document.querySelector('.price');
let productImage = document.querySelector('.product-image');
let detail = document.querySelector('.des'); // Ensure this element exists
let title = document.querySelector('title');

const setData = (data) => {
    title.innerHTML = data.name; // Set the title
    productName.innerHTML = data.name; // Use textContent for safety
    productImage.src = data.img; // Assuming data.img is a URL
    shortDes.innerHTML = data.shortDes; // Use textContent for safety
    detail.innerHTML = data.detail; // Use textContent for safety
    price.innerHTML = `$${data.price}`; // Use textContent for safety
    console.log(data)
}

const fetchProductData = () => {
    console.log('Product ID:', product_Id);
    const requestBody = { id: product_Id };
    console.log('Request Body:', requestBody);
    
    fetch('/get-products', {
        method: 'POST',
        headers: new Headers({'Content-Type': 'application/json'}),
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
        alert("product found")
        getProducts(data.tags[0]).then(res => createProductCards(res, 'similar products', '.best-selling-product-section'));
    })
    .catch(err => {
        console.log(err);
        alert('No product found');
        // location.replace('/404');
    });
}

let product_Id = null;
if (location.pathname !== '/add-product') {
    product_Id = decodeURI(location.pathname.split('/').pop());
    console.log(product_Id);
    fetchProductData();
}