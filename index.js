let express = require('express');
let parser = require('body-parser');
let fs = require("fs");
const app = express();
let server = require('http').createServer(app);
let read_settings = fs.readFileSync("default_settings.json");
let settings = JSON.parse(read_settings);
let search = require('./search-script');
const PORT = process.env.PORT || 8080;
var io = require('socket.io')(server);
// makes instance of search_script
// let search_script = search.search_script(settings.item);


app.use(express.static('public/'));
app.use(parser.json());
app.set('view engine', 'ejs');

app.get('/', (req, res)=>{
  res.render('pages/index.ejs');
});

app.get('/run', (req, res)=>{
  res.render('pages/run.ejs', settings);
});

app.get('/settings', (req, res)=>{
  res.render('pages/settings.ejs', settings);
});

app.get('/*', (req, res)=>{
  res.redirect('/');
});

app.post('/settings', (req, res)=>{
  settings.item = req.body.item;
  settings.sleep_time = req.body.sleep_time;
  settings.notify = req.body.notify;
  // TODO updae search_script instance
  io.sockets.emit('settings change');
  res.status(200).send({success : "Updated Successfully"})

});

// let total_run_windows = 0;
// socket connection
// io.on('connection', (socket)=>{
//   total_run_windows++
//   console.log(`someone connected to /run, total: ${total_run_windows}`);
//   socket.on('disconnect', ()=>{
//     total_run_windows--;
//     console.log(`someone disconnected from /run, total: ${total_run_windows}`);
//   })
// });

server.listen(PORT);
console.log(`listening on port ${PORT}`);
