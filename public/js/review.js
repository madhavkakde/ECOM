let ratingStarInput = [...document.querySelectorAll('.rating-star')];
let rate = 0;

ratingStarInput.map((star, index) => {
    star.addEventListener('click', () => {
        rate = `${index + 1}.0`;
        for (let i = 0; i < 5; i++) {
            if (i <= index) {
                ratingStarInput[i].src = '../img/fill star.png';
            }
            else {
                ratingStarInput[i].src = '../img/no fill star.png';
            }
        }
    })

})

// ADD REVIEW FORM 

let reviewHeadline = document.querySelector('.review-headline');
let review = document.querySelector('.review-field');
let loader = document.querySelector('.loader');

let addReviewBtn = document.querySelector('.add-review-btn');

addReviewBtn.addEventListener('click', () => {
    // form validation
    if (user.email == null) { // user is not logged in
        location.href = `/login?after_page=${productId}`;
    }
    else {
        if (!reviewHeadline.value.length || !review.value.length || rate == 0) {
            // if either of the fields is empty
            showFormError("all fields are required");
        }
        else if (reviewHeadline.value.length > 50) {
            showFormError("headline should not be more than 50 characters");
        }
        else if (review.value.length > 150) {
            showFormError("review should not be more than 150 characters");
        }
        else {
            // send data to the backend
            loader.style.display = "block";
            sendData('/add-review', {
                headline: reviewHeadline.value,
                review: review.value,
                rate: rate,
                email: user.email,
                product: productId
            })

        }
    }
})


// FETCH REVIEWS

const getReviews = () => {
    if (user == null) {
        user = {
            email: undefined
        }
    }

    sendData('/get-reviews', {
        email: user.email,
        product: productId
    })
        .then(response => {
            return response;
        })
        .then(data => {
            if (data.length) {
                createReviewSection(data);   // Process the data as needed
            }
        })
        .catch(error => {
            console.error('Error:', error); // Handle any errors
        });
}

const createReviewSection = (data) => {
    let section = document.querySelector('.review-section');
    section.innerHTML += `
    <h1 class="section-title">review</h1>
        <div class="review-container">
        ${createReviewCard(data)}
        </div>
    `;
}

const createReviewCard = data => {
    let cards = '';

    for (let i = 0; i < data.length; i++) {
        if (data[i]) {
            cards += `
            <div class="review-card">
                <div class="user-dp" data-rating="${data[i].rating}.0"><img src="../img/user-icon.png" alt="">
                </div>
                    <h2 class="review-title">${data[i].headline}</h2>
                <p class="review">${data[i].review}</p>
            </div>  
            `
        }
    }
    return cards;
}
getReviews();