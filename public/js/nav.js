// navbar
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (scrollY >= 180) {
        navbar.classList.add('bg');
    } else if (scrollY <= 180){
        navbar.classList.remove('bg');
    }
})

//navbar 
const createNavbar = () => {
    let navbar = document.querySelector('.navbar');
    navbar.innerHTML += `
<ul class="links-container">
            <li class="link-item"><a href="/" class="link">Home</a></li>
            <li class="link-item"><a href="/products" class="link">Product</a></li>
            <li class="link-item"><a href="/Dashboard" class="link">Dashboard</a></li>
            <li class="link-item"><a href="#" class="link">About</a></li>
            <li class="link-item"><a href="#" class="link">Contact</a></li>
        </ul>
        <div class="user-interactions">
            <div class="search-box">
                <input type="text" class="search" placeholder="search item">
                <button class="search-btn"><img src="../img/search.png" alt="">
                </button>
            </div>
            <div class="cart" onclick=cartBtnFunction()>
                <img src="../img/cart.png" class="cart-icon" alt="">
                <span class="cart-item-count">00</span>
            </div>
            <div class="user">
                <img src="../img/user.png" class="user-icon" alt="">
                <div class="user-icon-popup">
                    <p>login to your account</p>
                    <a>login</a>
                </div>
            </div>
        </div>`
}
createNavbar();

// user-icon-popup

const userIcon = document.querySelector('.user-icon');
const userIconPopup = document.querySelector('.user-icon-popup');
userIcon.addEventListener('click', () => userIconPopup.classList.toggle('active'));

let text = userIconPopup.querySelector('p');
let actionBtn = userIconPopup.querySelector('a');
let user = null;
try {
    user = JSON.parse(sessionStorage.user || 'null');
} catch (e) {
    console.error('Error parsing user from sessionStorage:', e);
    sessionStorage.removeItem('user');
}


if (user != null || undefined) { //user is logged in
    text.innerHTML = `logged in as, ${user.name}`;
    actionBtn.innerHTML = 'log out';
    actionBtn.addEventListener('click', () => logout());
}
else {
    text.innerHTML = 'login to your account';
    actionBtn.innerHTML = 'login';
    actionBtn.addEventListener('click', () => {
        console.log('Login button clicked');
        location.href = '/login';
    });

}

//logout function
const logout = () => {
    sessionStorage.clear('user');
    location.reload();
}

// SEARCH BOX
let searchBtn = document.querySelector('.search-btn');
let searchBox = document.querySelector('.search');
searchBtn.addEventListener('click', () => {
    if (searchBox.value.length) {
        location.href = `/search/${searchBox.value}`;
    }
})

// nav cart count

const updateNavCartCounter = () => {
    let cartCounter = document.querySelector('.cart-item-count');

    let cartItem = JSON.parse(localStorage.getItem('cart'));

    if (cartItem == null) {
        cartCounter.innerHTML == '00';
    }
    else {
        if (cartItem.length > 9)
            cartCounter.innerHTML = '9+';

        else if (cartItem.length <= 9) {
            cartCounter.innerHTML = `0${cartItem.length}`;
        }
    }
}

updateNavCartCounter();

const cartBtnFunction = () => {
    if(user == null || undefined){
        alert('login to view cart');
        location.href = '/login';
    }
    else{
        location.href = '/cart';
    }
}