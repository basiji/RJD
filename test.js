const request = require('request-promise');

var options = {
    method: 'POST',
    uri: 'https://sandbox.zarinpal.com/pg/rest/WebGate/PaymentRequest.json',
    headers: {
        'cache-control': 'no-cache',
        'content-type': 'application/json'
    },
    body: {
        MerchantID : 'b74fa670-04f8-11e8-ad07-000c295eb8fc',
        Amount : 1000,
        Description : 'Some description',
        CallbackURL : 'http://google.com'
    },
    json: true 
  };

  request(options)
    .then(function (data) {
        var Status = data.status;
        var Authority = data.Authority;
        console.log('https://www.zarinpal.com/pg/StartPay/' + Authority + '/asan');
        //console.log(Authority);
})
  .catch(function (err) {
    console.log('Error happened');
  });