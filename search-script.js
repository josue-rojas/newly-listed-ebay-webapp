let fs = require("fs");
let request = require('request');
let cheerio = require('cheerio');
read_settings = fs.readFileSync("default_settings.json");
let settings = JSON.parse(read_settings);

class search_script {
  constructor(item, sleep_time) {
    this.item = encodeURI(item);
    this.sleep_time = sleep_time;
    this.seen_links = new Set([]);
  }

  setItem(new_item) {
    this.item = encodeURI(new_item);
  }

  // set time is handle outside cause it has nothing to do here
  // setTime(new_sleep_time) {
  //   this.sleep_time = new_sleep_time;
  // }

  getNewLinks(callback) {
    const url = `https://www.ebay.com/sch/i.html?_from=R40&_sacat=0&_ipg=50%27&_nkw=${this.item}&_sop=10`
    request(url, (error, responce, html)=> {
      if(error) {
        callback({erro: true})
      }
      else {
        let $ = cheerio.load(html);
        let not_seen = [];
        // class search might...
        const links = $('a.s-item__link');
        links.each((i, link)=>{
          const l = $(link).attr('href');
          if(this.seen_links.has(l)) {
            return false;
          }
          this.seen_links.add(l);
          not_seen.push(l)
        });
        callback({error: false, not_seen: not_seen});
      }
    });
  }

}

module.exports.search_script_obj = search_script;
module.exports.search_script_inst = new search_script(settings.item, settings.sleep_time);
