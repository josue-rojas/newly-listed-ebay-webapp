let express = require('express');
let parser = require('body-parser');
let fs = require("fs");
let request = require('request');
let cheerio = require('cheerio');
let read_settings = fs.readFileSync("settings.json");
let settings = JSON.parse(read_settings);
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static('public/'));
app.use(parser.json());
app.set('view engine', 'ejs');

app.get('/', (req, res)=>{
  res.render('pages/index.ejs');
});

app.get('/run', (req, res)=>{

});

app.get('/settings', (req, res)=>{

});

app.get('/*', (req, res)=>{
  res.redirect('/');
});



app.listen(PORT);
console.log(`listening on port ${PORT}`);
