require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./db/db'); // Import the connectDB function
const User = require('./models/user.model'); // Import the User model
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const sellerModel = require('./models/seller.model')
const product = require('./models/product.model')
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const cors = require('cors');

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
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
let db = connectDB();

// Routes
app.get('/', (req, res) => {
    res.sendFile("index.html", { root: "public" });
});

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

// 404 route
app.get('/404', (req, res) => {
    res.sendFile("404.html", { root: "public" });
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

app.post('/add-product', (req, res) => {
    let { name, shortDes, detail, price, image, tags, email, draft } = req.body;

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
    else{
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
    let docName = `${name.toLowerCase()}.${Math.floor(Math.random() * 50000)}`;

    // Create a new product instance
    const newProduct = new product({
        name: docName,
        email: sellerModel.email,
        ...req.body // Spread the rest of the fields from the request body
    });

    // Save the product to the database
    newProduct.save()
        .then(() => {
            res.json({ product: name });
        })
        .catch(err => {
            console.error('Error adding product:', err);
            res.status(500).json({ alert: 'Some error occurred' });
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
    const { email } = req.body;
    console.log(req.body)
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    console.log("if")
    try {
        const products = await product.find({ email });
        console.log("finding email")
        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found' });
        }
        console.log("getting prod")
        const productArr = products.map(product => ({
            id: product._id,
            ...product.toObject()
        }));
        console.log("sendign res")
        res.status(200).json(productArr);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Redirect all other routes to 404
app.use((req, res) => {
    res.redirect('/404');
});
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
