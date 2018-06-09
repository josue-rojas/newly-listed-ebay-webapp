A local web app that scrapes, notifies, and shows basic info in a website of new eBay items.

#### Info
So I made a python [script](https://github.com/josuerojasrojas/newly-listed-ebay) to continuously get new items of eBay. The purpose of this is that sometimes to get a good deal on eBay you must be the first to an item (especially online where you are competing with everyone else). The script was made quickly and only took in mind my computer, meaning it would probably not work in windows. This project is not a script (partially) but a local web-app that will do the same as the script in a cleaner way with more options. (Also I know eBay does have a service to notify, but theirs does not continuously check, rather it checks once in a long while, which is too slow especially on the internet)

#### Note
This is meant to run locally only since it is web scraping. Also I try to make the timeout between each request such as not to overflow or cause any trouble.

### Stuff Used/Helpful Links
- [Socket.io](https://socket.io/docs/) for website updates
- [Tutorial for web scraping using node](https://scotch.io/tutorials/scraping-the-web-with-node-js)
- [Notifications api](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API) for browsers

### Things to add later
- [text message notifications](https://www.twilio.com/docs/sms/tutorials/how-to-send-sms-messages-node-js)
