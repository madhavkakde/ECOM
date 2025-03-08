
// collage images
const collageImages = [...document.querySelectorAll('.collage-img')]

collageImages.map((item, i) => {
    item.addEventListener('mouseover', () => {
        collageImages.map((image, index) => {
            if (index != i ) {
                image.style.filter = `blur(10px)`;
                item.style.zIndex = 2;
            }
        })
    })
    item.addEventListener('mouseleave', () => {
    collageImages.map((image, index) => {
        image.style = null;
    })
    })
})

// get product function
let ProductId = null;
export const getProducts = (tag) => {
    return fetch('/get-products', {
        method: 'post',
        headers: new Headers ({ 'Content-Type': 'application/json'}),
        body: JSON.stringify({ tags: tag })
    })
    .then(res => {
        return res.json()})
    .then(data => {
        console.log("data fetched", data)
        return data;
    })
};

 export const createProductCards = (data, title, ele) => {
    const container = document.querySelector(ele);
    container.innerHTML += `
    <h1 class="section-title"> ${title}</h1>
        <div class="product-container">
         ${createCards(data)}
        </div>`;
}

const createCards = data => {
    let  cards = '';
    data.forEach(item => { 
        cards += `
    <div class="product-card">
        <img src="${item.img}" onclick="location.href='/products/${item._id}'" class="product-img" alt="">
        <p class="product-name">${item.name}</P>
    </div>
    `
})
    return cards;
}