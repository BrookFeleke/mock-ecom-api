// File: server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');
const NodeCache = require('node-cache');

const app = express();
const PORT = 3000;

// File paths
const USERS_FILE = './users.csv';
const PRODUCTS_FILE = './products.csv';
const cache = new NodeCache({ stdTTL: 60 }); // Cache with 60 seconds TTL

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Load data from CSV files
const loadData = () => {
    const loadFile = (filePath) => {
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf-8');
            return parse(content, { columns: true, skip_empty_lines: true });
        }
        return []; // Return empty array if file doesn't exist
    };

    return {
        users: loadFile(USERS_FILE),
        products: loadFile(PRODUCTS_FILE),
    };
};

// Save data to CSV files
const saveData = (filePath, data) => {
    const csvContent = stringify(data, { header: true });
    fs.writeFileSync(filePath, csvContent);
};

// Initial data load
let database = loadData();

// Cache middleware
const cacheMiddleware = (req, res, next) => {
    const key = req.originalUrl;
    if (cache.has(key)) {
        return res.json(cache.get(key));
    }
    res.sendResponse = res.json;
    res.json = (body) => {
        cache.set(key, body);
        res.sendResponse(body);
    };
    next();
};

/** --- USER ENDPOINTS --- */
// Get all users (with caching)
app.get('/users', cacheMiddleware, (req, res) => {
    res.json(database.users);
});

// Create a new user
app.post('/users', (req, res) => {
    const user = req.body;
    user.id = Date.now().toString();
    database.users.push(user);
    saveData(USERS_FILE, database.users);
    res.status(201).json(user);
    cache.del('/users'); // Clear cache
});

// Update a user
app.put('/users/:id', (req, res) => {
    const id = req.params.id;
    const index = database.users.findIndex(user => user.id === id);
    if (index === -1) return res.status(404).json({ message: 'User not found' });

    database.users[index] = { ...database.users[index], ...req.body };
    saveData(USERS_FILE, database.users);
    res.json(database.users[index]);
    cache.del('/users'); // Clear cache
});

// Delete a user
app.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    database.users = database.users.filter(user => user.id !== id);
    saveData(USERS_FILE, database.users);
    res.status(204).send();
    cache.del('/users'); // Clear cache
});

/** --- PRODUCT ENDPOINTS --- */
// Get all products (with caching)
app.get('/products', cacheMiddleware, (req, res) => {
    res.json(database.products);
});

// Create a new product
app.post('/products', (req, res) => {
    const product = req.body;
    product.id = Date.now().toString();
    database.products.push(product);
    saveData(PRODUCTS_FILE, database.products);
    res.status(201).json(product);
    cache.del('/products'); // Clear cache
});

// Update a product
app.put('/products/:id', (req, res) => {
    const id = req.params.id;
    const index = database.products.findIndex(product => product.id === id);
    if (index === -1) return res.status(404).json({ message: 'Product not found' });

    database.products[index] = { ...database.products[index], ...req.body };
    saveData(PRODUCTS_FILE, database.products);
    res.json(database.products[index]);
    cache.del('/products'); // Clear cache
});

// Delete a product
app.delete('/products/:id', (req, res) => {
    const id = req.params.id;
    database.products = database.products.filter(product => product.id !== id);
    saveData(PRODUCTS_FILE, database.products);
    res.status(204).send();
    cache.del('/products'); // Clear cache
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
