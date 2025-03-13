require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./db/db'); // Import the connectDB function
const User = require('./models/user.model'); // Import the User model
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const sellerModel = require('./models/seller.model');
const product = require('./models/product.model');
const Review = require('./models/review.model');
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const cors = require('cors');
const paypal = require("@paypal/checkout-server-sdk");
const {client} = require('./public/js/paypalConfig');

// Initialize the server
const app = express();
const PORT = process.env.PORT || 5000;

// // aws
// const aws = require('aws-sdk');
// const dotenv = require('dotenv');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
// Set up Multer with Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "ecommerce-images", // Folder in Cloudinary
        allowed_formats: ["jpg", "png", "jpeg", "webp"]
    }
});

const upload = multer({ storage });

// In-memory storage for the uploaded image URL
let uploadedImageUrl = '';

// Image upload route
app.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    uploadedImageUrl = req.file.path; // Store the image URL
    res.json({ imageUrl: uploadedImageUrl }); // Return the Cloudinary URL
});
app.get("/image-url", (req, res) => {
    if (!uploadedImageUrl) {
        return res.status(404).json({ error: "No image uploaded yet" });
    }
    res.json(uploadedImageUrl); // Return the stored image URL
});

// Middleware
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
let db = connectDB();

// Routes
app.get('/', (req, res) => {
    res.sendFile("index.html", { root: "public" });
});

// app.get('/product', (req, res) => {
//     res.sendFile("product.html", { root: "public" });
// });


app.get('/signup', (req, res) => {
    res.sendFile("signup.html", { root: "public" });
});

// Signup route
app.post('/signup', async (req, res) => {
    const { name, email, password, number, tc } = req.body;

    console.log('Received signup request:', req.body); // Log the request body

    // Form validation
    if (name.length < 3) {
        return res.json({ alert: 'Name must be at least 3 characters long' });
    } else if (!email.length) {
        return res.json({ alert: 'Enter your email' });
    } else if (password.length < 8) {
        return res.json({ alert: 'Password must be at least 8 characters long' });
    } else if (!Number(number) || number.length < 10) {
        return res.json({ alert: 'Enter a valid phone number' });
    } else if (!tc) {
        return res.json({ alert: 'You must agree to the terms and conditions' });
    }

    try {
        // Check if user already exists by email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ alert: 'Email already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phone: number, // Assuming you want to store the phone number
            seller: false, // Default value for seller
        });

        // Save the new user to the database
        await newUser.save();

        // Respond with the new user data (excluding the password)
        res.json({
            name: newUser.name,
            email: newUser.email,
            seller: newUser.seller,
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// login route
app.get('/login', (req, res) => {
    res.sendFile("login.html", { root: "public" });
})

app.post('/login', async (req, res) => {
    let { email, password } = req.body;

    // Check if email and password are provided
    if (!email.length || !password.length) {
        return res.json({ alert: 'Please fill in all fields' });
    }

    try {
        console.log('Login request body:', req.body); // Log the incoming request body
        // Find user by email

        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ alert: 'Email does not exist' });
        } else {
            // Compare password
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                console.log('Login successful for user:', user.email); // Log successful login
                // Password is correct

                return res.json({
                    name: user.name,
                    email: user.email,
                    seller: user.seller
                });
            } else {
                // Password is incorrect
                return res.json({ alert: 'Password is incorrect' });
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ alert: 'Server error' });
    }
});

// seller route
app.get('/seller', (req, res) => {
    res.sendFile("seller.html", { root: "public" });
});

app.post('/seller', async (req, res) => {
    let { name, address, about, number, email } = req.body;

    if (!name.length || !address.length || !about.length || number.length < 10 || !Number(number)) {
        return res.status(400).json({ error: 'Some information(s) are missing or invalid' }); // Improved error handling
    }
    else {


        try {
            // Create or update the seller document
            const seller = await sellerModel.findOneAndUpdate(
                { email: email },
                { name, address, about, number },
                { upsert: true, new: true } // Create if not exists, return the new document
            );

            // Update the user document to indicate they are a seller
            await User.findOneAndUpdate(
                { email: email },
                { seller: true },
                { new: true, upsert: true } // Create if not exists, return the new document
            );

            // Send response
            res.json({
                seller: true,
                message: 'Seller account created successfully!',
                sellerData: seller
            });
        } catch (error) {
            console.error("Error creating seller account:", error);
            res.status(500).json({
                error: "An error occurred while creating the seller account."
            });
        }
    }
});




//dashboard route
app.get('/dashboard', (req, res) => {
    res.sendFile("dashboard.html", { root: "public" });
});

//add-product route
app.get('/add-product', (req, res) => {
    res.sendFile("add-product.html", { root: "public" });
})

app.get('/add-product/:id', (req, res) => {
    res.sendFile("add-product.html", { root: "public" });
})



app.post('/add-product', (req, res) => {
    let { name, shortDes, detail, price, image, tags, email, draft, id } = req.body;

    if(!draft){
        if (!name.length) {
            res.json({ 'alert': 'should enter the product name' });
        }
        else if (!shortDes.length) {
            res.json({ 'alert': 'enter the product description' });
        }
        else if ((!price.length) || !Number(price)) {
            res.json({ 'alert': 'enter the product price' });
        }
        else if (!detail.length) {
            res.json({ 'alert': 'enter the product details' });
        }
        else if (!tags.length) {
            res.json({ 'alert': 'enter the product tags' });
        }
    }
        // code for firebase

        // let docName = `${name.toLowerCase()}.${Math.floor(Math.random() * 50000)}`

        // let product = collection(db, "products");
        // setDoc(doc(products, docName), req.body)
        // .then(data => {
        //     res.json({'product': name});
        // })
        // .catch(err => {
        //     res.json({'alert': 'some error occured'});
        // })

        // code for mongodb
         // Create a unique document name
        // Check if id is defined
if (id === undefined) {
    console.log(id)
    // Generate a new document name
    const docName = `${name.toLowerCase()}.${Math.floor(Math.random() * 50000)}`;
    // Create a new product instance
    const newProduct = new product({
        name: docName,
        email: sellerModel.email,
        img: uploadedImageUrl == '' ? image : uploadedImageUrl,
        ...req.body // Spread the rest of the fields from the request body
    });
    console.log(4)
    // Save the product to the database
    newProduct.save()
        .then(savedProduct => {
            res.json({ product: savedProduct });
        })
        .catch(err => {
            console.error('Error adding product:', err);
            res.status(500).json({ alert: 'An error occurred while adding the product' });
        });
} else {
    // If id is defined, update the existing product
    product.findByIdAndUpdate(id, {
        name: req.body.name || undefined, // Only update if provided
        email: sellerModel.email,
        img: uploadedImageUrl,
        ...req.body // Spread the rest of the fields from the request body
    }, { new: true }) // Return the updated document
    .then(updatedProduct => {
        if (!updatedProduct) {
            return res.status(404).json({ alert: 'Product not found' });
        }
        res.json({ product: updatedProduct });
    })
    .catch(err => {
        console.error('Error updating product:', err);
        res.status(500).json({ alert: 'An error occurred while updating the product' });
    });
}
    
})

//get-products route



// CODE FROM YOUTUBE FOR FIRESTORE

//     let products = collection(db, "products");
//     let docRef;

//     docRef = getDocs(query(products, where("email", "==", email)))

//     docRef.then(products => { 
//         if(products.empty){
//             return res.json('no products');
//         }
//         let productArr = [];

//         products.forEach(item => {
//             let data = item.data();
//             data.id = item.id;
//             productArr.push(data);
//         })
//         res.json(productArr);
//     })

// })

// CODE FOR MONGODB
app.post('/get-products', async (req, res) => {
    const { email, id, tags } = req.body;
    console.log(req.body); // Log the incoming request body
    console.log(id)
    // Check if an ID is provided
    console.log(1)
    if (id) {
        try {
            // Find the product by ID
            const productID = await product.findById(id);
            console.log(productID); // Log the found product

            // Check if the product was found
            if (!productID) {
                return res.status(404).json({ error: 'Product not found' });
            }

            // Send the found product as a response
            console.log("product sent")
            return res.status(200).json(productID);
        } catch (error) {
            console.error('Error finding product by ID:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    else if(tags){
        // CODE FROM YOUTUBE FOR FIRESTORE
        // docRef = getDocs(query(products, where("tags", "array-container", tag)))
        try{
        //CODE FOR YOUTUBE
        const query = { tags: { $in: tags } }; 
        const results = await product.find(query).lean(); // Use lean() for plain JavaScript objects
        console.log('Found products:', results);
        if (results.length === 0) {
            return res.status(404).json({ message: 'No products found for the given tags' });
        }
        return res.status(200).json(results);
    }
        catch (error) {
            console.error('Error finding products by tags:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
     else {
        // If no ID is provided, check for email
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        console.log("Finding products by email");
        try {
            const products = await product.find({ email });
            console.log("Products found:", products);

            if (products.length === 0) {
                return res.status(404).json({ message: 'No products found' });
            }

            // Map the products to include their IDs
            const productArr = products.map(prod => ({
                id: prod._id,
                ...prod.toObject()
            }));

            // Send the array of products as a response
            return res.status(200).json(productArr);
        } catch (error) {
            console.error("Error fetching products:", error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
});

// delete-product route

// CODE FROM YOUTUBE FOR FIRESTORE

// app.post('/delete-product', (req, res) => {
//     let {id} = req.body;

//     deleteDoc(doc(collection(db, "products"), id))
//     .then(data => {
//         res.json('success');
//     }).catch(err => {
//         res.json('err');
//     })
// })

// CODE FOR MONGODB
app.post('/delete-product', async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'Product ID is required' });
    }

    try {
        // Delete the product by ID
        const result = await product.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Send success response
        res.json('success');
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// product page
app.get('/products/:id', async (req, res) => {
    res.sendFile("product.html", { root: "public" });
});

// search page
app.get('/search/:key', async (req, res) => {
    res.sendFile("search.html", { root: "public" });
});

// review route
app.post('/add-review', (req, res) => {
    let { headline, review, rate, email, product } = req.body;
    console.log(req.body)
    
    // FORM VALIDATION
    if (!headline.length || !review.length || rate == 0 || email == null || !product) {
        return res.json({ 'alert': 'Fill all the inputs' });
    }

    // CODE FROM YOUTUBE FOR FIRESTORE
    // storing review in db
    // let reviews = collection(db, "reviews");
    // let docName =  `review-${email}-${product}`;

    // setDoc(doc(reviews, docName), req.body)
    // .then(data => {
    //     return res.json({'review': data.data()})
    // }).catch(err => res.json({'alert': 'some error occured'}));

    // CODE FOR MONGODB
    const newReview = new Review({
        headline,  // Use the correct variable names
        review,    // Use the correct variable names
        rating: rate, // Use the correct variable names
        email,
        product
    });

    newReview.save()
        .then(data => {
            return res.json({ 'review': data });
        })
        .catch(err => {
            console.error('Error saving document: ', err);
            return res.json({ 'alert': 'Some error occurred' });
        });
})

// get-reviews route
app.post('/get-reviews', async (req, res) => {
    let { product, email } = req.body;

    // Validate the product parameter
    if (!product) {
        return res.status(400).json({ alert: 'Product parameter is required' });
    }

    try {
        // Find reviews for the specified product, limited to 4
        const reviews = await Review.find({ product: product }).limit(4);
        let reviewArr = [];

        // Check if reviews are found
        if (reviews.length === 0) {
            return res.json(reviewArr); // Return an empty array if no reviews are found
        }

        let userEmail = false;

        // Process the reviews
        reviews.forEach(item => {
            let reviewEmail = item.email; // Access email directly
            if (reviewEmail === email) {
                userEmail = true; // Check if the user's email matches
            }
            reviewArr.push(item); // Push the review document into the array
        });

        // If the user's email is not found in the reviews, fetch the specific review
        if (!userEmail) {
            const specificReview = await Review.findOne({ email: email, product: product });
            if (specificReview) {
                reviewArr.push(specificReview); // Push the found review into the array
            }
        }

        // Send the response with the collected reviews

        return res.json(reviewArr);
    } catch (err) {
        console.error('Error fetching reviews: ', err);
        res.status(500).json({ alert: 'An error occurred while fetching reviews' });
    }
});

// CART Route
app.get('/cart', (req, res) => {
    res.sendFile("cart.html", { root: "public" });
})

//  Checkout route
app.get('/checkout', (req, res) => {
    res.sendFile("checkout.html", { root: "public" });
});


app.post("/create-order", async (req, res) => {
    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
        intent: "CAPTURE",
        purchase_units: [
            {
                amount: {
                    currency_code: "USD",
                    value: req.body.amount, // Pass the total order amount
                },
            },
        ],
    });

    try {
        const order = await client().execute(request);
        res.json({ id: order.result.id });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post("/capture-order", async (req, res) => {
    const orderId = req.body.orderID;
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    try {
        const capture = await client().execute(request);
        res.json(capture.result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


// 404 route
app.get('/404', (req, res) => {
    res.sendFile("404.html", { root: "public" });
});

// Redirect all other routes to 404
app.use((req, res) => {
    res.redirect('/404');
});
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
