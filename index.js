const express = require('express');
const app = express();
const port = 8080;
const path = require('path');

let ejs = require('ejs');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/game'));
app.use(express.static('game/static'));
app.use(express.static('shared'));

app.get('/', (req, res) => {
    res.render('index', { foo: 'FOO' });
});

app.listen(port);