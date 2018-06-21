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
let listingTimer = null;
let isRunning = false

// TODO bug where some random listing will not have title or text
// TODO add max price
// TODO add min price
// TODO add custom url
// http://www.helios825.org/url-parameters.php for custom url and more settings, ie: condition, specific seller, top rated sellers only, etc


app.use(express.static('public/'));
app.use(parser.json());
app.set('view engine', 'ejs');

app.get('/', (req, res)=>{
  res.render('pages/index.ejs');
});

app.get('/run', (req, res)=>{
  const url = `https://www.ebay.com/sch/i.html?_from=R40&_sacat=0&_ipg=50%27&_nkw=${settings.item}&_sop=10`
  res.render('pages/run.ejs', {settings: settings, listings: listings, ebay: url});
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
  io.sockets.emit('settings change');
  // although isRunning is false it should turn back on if anyone is at '/run' because this should refresh the page in the front end js this triggering socket.io connection
  // this should reset everything
  search_script.setItem(req.body.item)
  clearTimeout(listingTimer)
  isRunning = false;
  listings = [];
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
    // checking if first fixes ordering issue when a new item is added
    let data_send = null;
    if(listings.length === 0){
      data.not_seen.forEach((listing, index)=>{
        if(index > settings.max_show-1){
          return false;
        }
        listings.push(listing);
      })
      data_send = listings;
    }
    else {
      for(let i = data.not_seen.length-1; i > -1; i--){
        if(listings.length === settings.max_show){
          listings.pop();
        }
        listings.unshift(data.not_seen[i]);
      }
      data_send = data.not_seen;
    }
    io.sockets.emit('new listing', data_send)
  }
  console.log(`found ${data.not_seen.length} new listings`)
}

// only run search_script when there is at least one connection as to not waste resources, this keeps track of connections
let total_run_windows = 0;
// socket connection
io.on('connection', (socket)=>{
  total_run_windows++
  console.log(`someone connected to /run, total: ${total_run_windows}`);
  socket.on('disconnect', ()=>{
    total_run_windows--;
    console.log(`someone disconnected from /run, total: ${total_run_windows}`);
    if(total_run_windows === 0){
      console.log('stopping timer for fetching');
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
