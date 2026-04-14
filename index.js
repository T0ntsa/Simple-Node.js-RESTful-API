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
        title: 'Simple Node.js RESTful API'
    });
});

// ABOUT
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About this page'
    });
});


// // https://stackoverflow.com/questions/10011011/how-do-i-read-a-json-file-into-server-memory
// var obj;
// fs.readFile('file', 'utf8', function (err, data) {
//     if (err) throw err;
//     obj = JSON.parse(data);
// });

// SHOW ALL THE BOOKS 
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

// API endpoint to get all books as JSON
app.get('/api/books', (req, res) => {
    const filePath = path.join(__dirname, 'data', 'books.json');
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(JSON.parse(data));
    });
});
// API endpoint to get a single book by ID
app.get('/api/books/:id', (req, res) => {
        const id = Number(req.params.id);

        const filePath = path.join(__dirname, 'data', 'books.json');
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                return res.status(500).json({ error: 'Internal Server Error' });
            }
        const books = JSON.parse(data);
        const book = books.find(book => book.id === id);

        if (book) {
            res.json(book)
        }
        else {
            res.status(404).json({
                msg: 'Not found'
            });
        }
    });
});

// Create a book (you can send the values using Postman) 
app.post('/api/books', (req, res) => {
    const filePath = path.join(__dirname, 'data', 'books.json');

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
        }

        const books = JSON.parse(data);

        if (req.body.title && req.body.author && req.body.published && req.body.genre) {
        const newID = books.length ? books[books.length - 1].id + 1 : 1;

        const newBook = {
            id: newID,
            title: req.body.title,
            author: req.body.author,
            published: req.body.published,
            genre: req.body.genre
        };

        books.push(newBook);

        return res.status(201).json(books, newBook);
        } else {
        return res.status(400).json({
            msg: 'title, author, published and genre needed'
        });
        }
    });
});





// Page not found 404
app.use((req, res) => {
    // The magic of backticks ;)
    res.status(404).send(`Page ${req.host}<b>${req.originalUrl}</b> not found.<br><br><a href="/">Homepage</a>`);
    // Log to see what was the original URL that caused the 404 error
    console.log(`404 error: ${req.originalUrl} not found`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});