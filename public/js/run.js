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

// if settings change then refresh the page
socket.on('settings change', ()=>{
  location.reload();
})
