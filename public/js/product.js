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

//product page setting
let productName = document.querySelector('.product-title');
let shortDes = document.querySelector('.product-des');
let price = document.querySelector('.price');
let productImage = document.querySelector('.product-image');
let title = document.querySelector('title');

const setData = (data) => {
    productName.innerHTML += title.innerHTML = data.name;
    productImage.innerHTML += data.img;
    shortDes.innerHTML += data.shortDes;
    detail.innerHTML += data.detail;
    price.innerHTML += `${data.price}`;
}

const fetchProductData = () => {
    console.log('Product ID:', product_Id);
    const requestBody = { id: product_Id };
    console.log('Request Body:', requestBody);
    fetch('/get-products', {
        method: 'POST',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({ id: product_Id }) 
    })
    .then(res => {
        console.log(res)
    })
    .then(data => {
         if (!data || !data.name) { // Check if the product data is valid
        alert('Product not found');
        location.replace('/404');
        console.log(2)
        return;
    }
    setData(data);
    })
    .catch(err => {
        console.log(err);
        alert('no product found');
        location.replace('/404');
    })
}

let product_Id = null;
if(location.pathname != '/add-product'){
    product_Id = decodeURI(decodeURI(location.pathname.split('/').pop()));
    console.log(product_Id)
    fetchProductData();
}