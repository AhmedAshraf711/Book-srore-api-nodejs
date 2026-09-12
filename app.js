const express = require('express');
const mongoose = require('mongoose');
const logger = require('./middlewares/logger');
const connectToDB = require('./config/db')
const app = express();

app.set('view engine','ejs');

// Middleware
app.use(express.json());
app.use(logger);

// Load environment variables
require('dotenv').config();

// MongoDB connection
connectToDB();

// API Routes
app.use('/api/books', require('./routes/books'));
app.use('/api/authors', require('./routes/authors'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));

// Error handling middleware
const { notFound, errorHandler } = require('./middlewares/errors');
app.use(notFound);
app.use(errorHandler);

// Start server
const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on http://localhost:${port}`);
});