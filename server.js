const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./db/db'); // Import the connectDB function
const User = require('./models/user.model'); // Import the User model
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

// Initialize the server
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

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
        const existingUser  = await User.findOne({ email });
        if (existingUser ) {
            return res.json({ alert: 'Email already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser  = new User({
            name,
            email,
            password: hashedPassword,
            phone: number, // Assuming you want to store the phone number
            seller: false, // Default value for seller
        });

        // Save the new user to the database
        await newUser .save();

        // Respond with the new user data (excluding the password)
        res.json({
            name: newUser .name,
            email: newUser .email,
            seller: newUser .seller,
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error', error });
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