const express = require('express');
const path = require('path');

const app = express();

const port = 3000;


const myLogger = (req, res, next) => {
    console.log("Middelware log 1");
    next();

}

const myLogger2 = (req, res, next) => {
    console.log("Middelware log 2");
    next();

}

app.use(express.static('public'));
app.use(myLogger);
app.use(myLogger2);


app.get('/', (req, res) => {

    res.sendFile(path.resolve(__dirname, 'temp/index.html'));
});

app.get('/about', (req, res) => {
    res.send('About Page');
});


app.listen(port, ()=> {
    console.log(`Sunucu ${port} portunda başlatıldı.`)
});
