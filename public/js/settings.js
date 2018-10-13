// TODO: TODO check inputs for correctness and onchange

function submitSettings() {
  const item = $('[name="item"]').val();
  const max_price = $('[name="max_price"]').val();
  const min_price = $('[name="min_price"]').val();
  const sleep_time = $('[name="sleep_time"]').val();
  const notify = $('[name="notify"]').val();
  const max_show = $('[name="max_show"]').val();
  const data = {
    item: item,
    max_price: max_price,
    min_price: min_price,
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

$('.inputs-wrapper .input-toggle-box').click(()=>{
  let nextVal = $('[name="notify"]').val() === 'true' ? 'false': 'true';
  $('[name="notify"]').val(nextVal);
  $('.inputs-wrapper .input-toggle-box').toggleClass('false');
})
