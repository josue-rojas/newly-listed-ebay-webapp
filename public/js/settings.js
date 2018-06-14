// TODO check inputs for correctness and onchange

function submitSettings() {
  const item = $('[name="item"]').val();
  const sleep_time = $('[name="sleep_time"]').val();
  const notify = $('[name="notify"]').val();
  const notify = $('[name="max_show"]').val();
  const data = {
    item: item,
    sleep_time: sleep_time,
    notify: notify,
    max_show: max_show
  }
  fetch('/settings', {
    body: JSON.stringify(data),
    headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
    method: 'POST'
  })
  .then(res => res.json())
  .catch(error => console.error('Error:', error))
  .then(response => window.location = '/run');
}


$('.inputs-wrapper  .input').keyup(()=> {
  if (event.keyCode === 13) {
    submitSettings();
  }
});
