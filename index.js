let express = require('express');
let parser = require('body-parser');
let fs = require("fs");
read_settings = fs.readFileSync("default_settings.json");
let settings = JSON.parse(read_settings);
let search = require('./search-script');
// makes instance of search_script
// let search_script = search.search_script(settings.item);


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
  res.render('pages/settings.ejs', settings);
});

app.get('/*', (req, res)=>{
  res.redirect('/');
});

app.listen(PORT);
console.log(`listening on port ${PORT}`);
