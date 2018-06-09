let express = require('express');
let parser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 8080;
let search = require('./search-script');
// makes instance of search_script
let search_script = search.search_script_inst;
let sleep_time = search_script.sleep_time;

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
