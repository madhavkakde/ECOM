window.onload = () => {
    if(!sessionStorage.user){
        location.replace('/login');
    }
}

// select place order btn
const placeOrderBtn = document.querySelector('.place-order-btn');

placeOrderBtn.addEventListener('click', () => {
    let address = getAdress();
    console.log(address);

    //send data to backend
});

const getAdress = () => {
    // validation form
    let name = document.querySelector('#name').value;
    let address = document.querySelector('#address').value;
    let street = document.querySelector('#street').value;
    let city = document.querySelector('#city').value;
    let state = document.querySelector('#state').value;
    let pincode = document.querySelector('#pincode').value;
    let landmark = document.querySelector('#landmark').value;

    if(!name.length || !address.length || !street.length || !city.length || !state.length || !pincode.length || !landmark.length){
        return showFormError('fill all the fields');
    }
    else{
        return {name, address, street, city, state, pincode, landmark};
    }
}