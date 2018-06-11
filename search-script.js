let request = require('request');
let cheerio = require('cheerio');

// TODO add custom url support

class search_script {
  constructor(item) {
    this.item = encodeURI(item);
    this.seen_links = new Set([]);
  }

  // sort of acts a reset
  setItem(new_item) {
    this.seen_links = new Set([]);
    this.item = encodeURI(new_item);
  }

  getNewLinks(callback) {
    const url = `https://www.ebay.com/sch/i.html?_from=R40&_sacat=0&_ipg=50%27&_nkw=${this.item}&_sop=10`
    request(url, (error, responce, html)=> {
      if(error) {
        console.log('error in request');
        callback({error: true})
      }
      else {
        let $ = cheerio.load(html);
        // console.log('html', html);
        // return
        let not_seen = [];
        // this is the whole listing including title, img, price
        const listings = $('div.srp-river-results.clearfix .s-item');
        listings.each((i, single_listing)=> {
          // get important info for the page
          // for the first part since we are keeping a collection of seen, the check of link is to stop check the rest assuming the order stays the same (which it should if url is set ordered by newly listed)
          const $single_listing = $(single_listing);
          // ----------
          // get link
          const link = $single_listing.find('a.s-item__link').attr('href');
          if(this.seen_links.has(link)){
            return false
          }
          this.seen_links.add(link);
          // ----------
          // get image
          const $image = $single_listing.find('.s-item__image-wrapper .s-item__image-img');
          // so ebay might be setup in a way that src is added by js so it does not load all the images...(this might change as all things on ebay constantly changes) either way their src is still somewhere in the img tag
          const imageSRC = $image.attr('src') !== 'https://ir.ebaystatic.com/cr/v/c1/s_1x2.gif' ? $image.attr('src') : $image.attr('data-src');
          // ----------
          // get title
          // first remove any inner tags (new listings have a span tag)
          // https://stackoverflow.com/questions/3442394/using-text-to-retrieve-only-text-not-nested-in-child-tags
          const title = $single_listing.find('.s-item__title')
          .clone()
          .children()
          .remove()
          .end()
          .text();
          // finally we push the data in the not_seen to be sent out and handled somewhere else
          not_seen.push({
            link: link,
            imageSrc: imageSRC,
            title: title
          })
          // console.log(`info ${i}`, `link: ${link}, image: ${imageSRC}, title: ${title}`);
        })
        callback({error: false, not_seen: not_seen});
      }
    });
  }
}

// test
// const search = new search_script("ipad mini 4");
// search.getNewLinks();

module.exports.search_script = search_script;
