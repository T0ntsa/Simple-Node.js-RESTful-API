const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const fs = require('fs');
require('dotenv').config();

const app = express();
// We can can get json data from the client
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main',
}));

app.set('view engine', 'handlebars');
// static files
app.use(express.static('public'));

// My array


// HOME
app.get('/', (req, res) => {
    res.render('index', {
        title: 'This is title'
    });
});

// ABOUT
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About this page'
    });
});
/*
var obj;
fs.readFile('file', 'utf8', function (err, data) {
    if (err) throw err;
    obj = JSON.parse(data);
});
*/
// BOOKS 
app.get('/books', (req, res) => {
    const filePath = path.join(__dirname, 'data', 'books.json');
    
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading books.json:', err);
            return res.status(500).send('Internal Server Error');
        }
        const books = JSON.parse(data);
        res.render('books', {
            title: 'List of books',
            books
        });
    });
});

// Page not found 404
app.use((req, res) => {
    res.status(404).send(`Page ${req.host}<b>${req.originalUrl}</b> not found. <a href="/">Homepage</a>`);
    // Log to see what was the original URL that caused the 404 error
    console.log(`404 error: ${req.originalUrl} not found`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});