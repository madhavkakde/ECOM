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
let imagePath = 'img/noImage.png';

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