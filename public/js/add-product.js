let user = JSON.parse(sessionStorage.user || null);

window.onload = () =>{
    if(user == null){
        location.replace('/login');
    }
}

let editables = [...document.querySelectorAll('*[contenteditable="true"]')];
editables.map((element) => {
    let placeholder = element.getAttribute('data-placeholder');
    element.innerHTML = placeholder;
    element.addEventListener('focus', () => {
        if(element.innerHTML == placeholder){
            element.innerHTML = '';
        }
    })
    element.addEventListener('focusout', () => {
        if(!element.innerHTML.length){
            element.innerHTML = placeholder;
        }
    })
})

// image upload
let uploadInput = document.querySelector('#upload-img');
let imagePath = "./img/noImage.png";
console.log("at assign ", imagePath);

//code from youtube

// uploadInput.addEventListener('change', () => {
//     const file = uploadInput.files[0];
//     let imageUrl;

//     if(file.type.includes('image')){
//         // means its an image
//         fetch("/image-url").then(res => res.json())
//         .then(url =>{
//             fetch(url, {
//                 method: 'PUT',
//                 headers: new Headers({
//                 'Content-Type': 'multipart/form-data'}),
//                 body: file
//         }).then(res => {
//             imagePath = url;

//             let productImage = document.querySelector('.product-img');
//             productImage.src = imagePath;
//         })

//         })
//     }
// })

// FROM AI
uploadInput.addEventListener('change', () => {
    const file = uploadInput.files[0];

    if (file && file.type.includes('image')) {
        // Create FormData to send the file
        const formData = new FormData();
        formData.append('image', file); // Append the image file to the form data

        // Upload the image to the server
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            // Assuming the response contains the new image URL
            const imagePath = data.imageUrl;
            // Update the image source in the DOM
            let productImage = document.querySelector('.product-img');
            productImage.src = imagePath;
            console.log('Image uploaded successfully:', imagePath);
        })
        .catch(err => {
            console.error('Error uploading image:', err);
        });
    } else {
        alert('Please select a valid image file.');
    }
});

//form submission
let addProductBtn = document.querySelector('.add-product-btn');
let loader = document.querySelector('.loader');

let productName = document.querySelector('.product-title');
let shortDes = document.querySelector('.product-des');
let price = document.querySelector('.price');
let detail = document.querySelector('.des');
let tags = document.querySelector('.tags');

addProductBtn.addEventListener('click', () => {
    //verification
    if(productName.innerHTML == productName.getAttribute('data-placeholder')){
        showFormError('should enter the product name');
    }
    else if(shortDes.innerHTML == shortDes.getAttribute('data-placeholder')){
        showFormError('enter the product description');
    }
    else if((price.innerHTML == price.getAttribute('data-placeholder')) || !Number(price.innerHTML))
        {
        showFormError('enter the product price');
        }
    else if(detail.innerHTML == detail.getAttribute('data-placeholder')){
            showFormError('enter the product details');
            }
    else if(tags.innerHTML == tags.getAttribute('data-placeholder')){
                showFormError('enter the product tags');
                }
    else{
        //submit form
        loader.style.display = 'block';
        let data = productData(); 
        if(productId){ // checking for existing id 
            data.id = productId;
        }
        sendData('/add-product', data);
    }
})

const productData = () =>{
    let tagsArr = tags.innerText.split(",");
    tagsArr.forEach((item, i) => tagsArr[i].trim().toLowerCase());

    return{
        
        name: productName.innerText,
        shortDes: shortDes.innerText,
        price: price.innerText,
        detail: detail.innerText,
        tags: tagsArr,
        image: imagePath,
        email: JSON.parse(sessionStorage.user).email,
        draft: false
    }
}
// draft btn
let draftBtn = document.querySelector('.draft-btn');
draftBtn.addEventListener('click', () => {
    if(!productName.innerHTML.length || productName.innerHTML == productName.getAttribute('data-placeholder')){
        showFormError('enter the product name');
    }else{
        let data = productData();
        loader.style.display = 'block';
        data.draft = true;
        if(productId){ // checking for existing id 
            data.id = productId;
        }
        console.log("-1",data)
        sendData('/add-product', data);
        console.log(data)
    }
})

// Edit page
const fetchProductData = () => {
    addProductBtn.innerHTML = 'Save Product'; // Ensure button text is user-friendly
    console.log('Fetching product data...');

    // Check if productId is valid before making the fetch call
    if (!productId) {
        console.error('Product ID is not set. Cannot fetch product data.');
        return; // Exit the function if productId is not valid
    }
    fetch('/get-products', {
        method: 'POST',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({ id: productId }) // Send the product ID in the request body
    })
    .then(res => {
        console.log('Response received:', res);
        if (!res.ok) {
            throw new Error('Network response was not ok: ' + res.statusText);
        }
        return res.json(); // Return the parsed JSON data
    })
    .then(data => {
        console.log('Product data received:', data);
        setFormData(data); // Populate the form with the received data
    })
    .catch(err => console.error('Error fetching product data:', err));
};

const setFormData = (data) => {
    // Check if data is valid before accessing properties
        productName.innerHTML = data.name; // Set the product name and other info in the form
        shortDes.innerHTML = data.shortDes;
        price.innerHTML = data.price;
        detail.innerHTML = data.detail;
        tags.innerHTML = data.tags;

        let productImg = document.querySelector('.product-img'); // Getting the product image
        productImg.src = data.image ? data.image : imagePath;
        console.log(imagePath)
        console.log(productImg.src)

};

let productId = null;
if (location.pathname !== '/add-product') {
    console.log('Not on add-product page, fetching product ID...');
    productId = decodeURI(location.pathname.split('/').pop()); // Extract product ID from URL
    console.log('Product ID:', productId);
    fetchProductData(); // Fetch product data using the extracted ID
}