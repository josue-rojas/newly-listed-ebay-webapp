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
let search_script = new search.search_script(settings.item);
let listings = [];

// TODO settings should include max_show to display in run page


app.use(express.static('public/'));
app.use(parser.json());
app.set('view engine', 'ejs');

app.get('/', (req, res)=>{
  res.render('pages/index.ejs');
});

app.get('/run', (req, res)=>{
  res.render('pages/run.ejs', {settings: settings, listings: listings});
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


// callback for getNewLinks in search_script
function setListings(data) {
  console.log('fetching new listings');
  if(data.error){
    console.log('error in search script');
    return false;
  }
  if(data.not_seen.length > 0){
    data.not_seen.forEach((listing)=>{
      listings.push(listing);
    })
    io.sockets.emit('new listing', data.not_seen)
  }
  console.log(`found ${data.not_seen.length} new listings`)
}

// only run search_script when there is at least one connection as to not waste resources, this keeps track of connections
let total_run_windows = 0;
let listingTimer = null;
let isRunning = false
// socket connection
io.on('connection', (socket)=>{
  total_run_windows++
  console.log(`someone connected to /run, total: ${total_run_windows}`);
  socket.on('disconnect', ()=>{
    total_run_windows--;
    console.log(`someone disconnected from /run, total: ${total_run_windows}`);
    console.log('stopping timer for fetching');
    if(total_run_windows === 0){
      clearTimeout(listingTimer)
      isRunning = false;
      // TODO might decide to reset everything
    }
  })

  if(total_run_windows === 1 && !isRunning){
    // start timer and set isRunning to prevent others from runnning
    console.log('starting timer for fetching');
    isRunning = true;
    // run initial to get first 50
    search_script.getNewLinks(setListings)
    listingTimer = setInterval(()=>{
      search_script.getNewLinks(setListings)
    }, settings.sleep_time);
  }

});

server.listen(PORT);
console.log(`listening on port ${PORT}`);
