const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');

const app = express();
app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main',
}));

app.set('view engine', 'handlebars');
// static files
app.use(express.static('public'));

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