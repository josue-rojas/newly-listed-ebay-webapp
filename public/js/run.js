// https://developer.mozilla.org/en-US/docs/Web/API/notification
let hasNotifications = false;
if (!("Notification" in window)) {
  if(notify) console.log('This browser does not support notifications');
}
else if (Notification.permission === "granted" && notify) {
  hasNotifications = true;
}
else if (Notification.permission !== "denied" && notify) {
  Notification.requestPermission( (permission)=> {
    if (permission === "granted")
      hasNotifications = true;
  });
}

const socket = io();
let notification = null;

// create a new listing html
function newListing(data){
  return (
    `<a class='listing' href='${data.link} target='_blank'> \
      <div class='img' style='background-image: url("${data.imageSrc}")'></div> \
      <div class='listing-title'>${data.title}</div> \
    </a>`
  )
}

// if settings change then refresh the page
socket.on('settings change', ()=>{
  location.reload();
})

socket.on('new listing', (data)=>{
  if(data.length > 0){
    const $listings = $('.listings-wrapper');
    data.reverse().forEach((e)=>{
      $listings.prepend(newListing(e));
    })
    // TODO: add a photo or somethign nice
    // Might be a problem for multiple pages open at the same time
    if(hasNotifications){
      notification= new Notification(`New listings found: ${data.length}`);
    }
  }
})
