// navbar
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (scrollY >= 180) {
        navbar.classList.add('bg');
    } else {
        navbar.classList.remove('bg');
    }
    console.log(scrollY);
})

//navbar 
const createNavbar = () => {
let navbar = document.querySelector('.navbar');
navbar.innerHTML += `
<ul class="links-container">
            <li class="link-item"><a href="#" class="link">Home</a></li>
            <li class="link-item"><a href="#" class="link">Product</a></li>
            <li class="link-item"><a href="#" class="link">About</a></li>
            <li class="link-item"><a href="#" class="link">Contact</a></li>
        </ul>
        <div class="user-interactions">
            <div class="cart">
                <img src="./img/cart.png" class="cart-icon" alt="">
                <span class="cart-item-count">00</span>
            </div>
            <div class="user">
                <img src="./img/user.png" class="user-icon" alt="">
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


if(user != null || undefined) { //user is logged in
    text.innerHTML = `logged in as, ${user.name}`;
    actionBtn.innerHTML = 'log out';
    actionBtn.addEventListener('click', () =>logout());
}
else{
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
