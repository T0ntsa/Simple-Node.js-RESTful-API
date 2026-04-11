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


app.get('/', (req, res) => {
    res.render('index', {
        title: 'This is title'
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});