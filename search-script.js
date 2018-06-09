let request = require('request');
let cheerio = require('cheerio');

class search_script {
  constructor(item) {
    this.item = encodeURI(item);
    this.seen_links = new Set([]);
  }

  setItem(new_item) {
    this.seen_links = new Set([]);
    this.item = encodeURI(new_item);
  }

  getNewLinks(callback) {
    const url = `https://www.ebay.com/sch/i.html?_from=R40&_sacat=0&_ipg=50%27&_nkw=${this.item}&_sop=10`
    request(url, (error, responce, html)=> {
      if(error) {
        callback({erro: true})
      }
      else {
        let $ = cheerio.load(html);
        let not_seen = [];
        // class search might change...
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

module.exports.search_script = search_script;
