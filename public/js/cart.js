// create card product cards

const createCartProductCards = (data) => {
    return `
    <div class="cart-product">
        <img src="${data.image}" alt="" class="cart-product-img">
        <div class="cart-product-text">
            <p class="cart-product-name">${data.name}</p>
            <p class="cart-product-des">${data.shortDes}</p>
        </div>
        <div class="item-counter">
            <button class="counter-btn decrement">-</button>
            <p class="item-count">${data.item}</p>
            <button class="counter-btn increment">+</button>
        </div>
        <p class="cart-product-price" data-price="${data.price}">$${data.price * data.item}</p>
        <button class="cart-delete-btn"><img src="img/close.png" alt=""></button>
    </div>
    `
}

let totalBill = 0;

const setCartProducts = () => {
    let cartContainer = document.querySelector('.cart-container');

    let cart = JSON.parse(localStorage.getItem('cart'));
    if (cart == null || !cart.length) {
        cartContainer.innerHTML += `<img src="img/empty-cart.png" alt="" class="empty-img">`;
    }
    else {
        for (let i = 0; i < cart.length; i++) {
            cartContainer.innerHTML += createCartProductCards(cart[i]);
            totalBill += Number(cart[i].price * cart[i].item);

            updateBill();
        }
    }
    setupCartEvents();
}

const updateBill = () => {
    updateNavCartCounter();
    let billPrice = document.querySelector('.bill');
    billPrice.innerHTML =  `$${totalBill}`
}

const setupCartEvents = () => {
    // setup cart events
    const counterMinus = document.querySelectorAll('.cart-container .decrement');
    const counterPlus = document.querySelectorAll('.cart-container .increment');
    const counts = document.querySelectorAll('.cart-container .item-count');
    const price = document.querySelectorAll('.cart-container .cart-product-price');
    const deleteBtn = document.querySelectorAll('.cart-container .cart-delete-btn');
    
    let product = JSON.parse(localStorage.getItem('cart'));
    
    counts.forEach((item, i) => {
        let cost = Number(price[i].getAttribute('data-price'));
        
        counterMinus[i].addEventListener('click', () =>{
            if(item.innerHTML > 1){
                item.innerHTML--;
                totalBill -= cost;
                updateBill();
                price[i].innerHTML = `$${item.innerHTML * cost}`;

                // code when refresh the page prices will stay the same
                product[i].item = item.innerHTML;
                localStorage.setItem('cart', JSON.stringify(product));
            }
        })
        counterPlus[i].addEventListener('click', () =>{
            if(item.innerHTML < 9){
                item.innerHTML++;
                totalBill += cost;
                updateBill();
                price[i].innerHTML = `$${item.innerHTML * cost}`;
                
                // code when refresh the page prices will stay the same
                product[i].item = item.innerHTML;
                localStorage.setItem('cart', JSON.stringify(product));
            }
        })
    })
    deleteBtn.forEach((item, i) => {
        item.addEventListener('click', () => {
            product = product.filter((data, index) => index != 1);
            localStorage.setItem('cart',JSON.stringify(product));
            location.reload();
        })
    })
}

setCartProducts();