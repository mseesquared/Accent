var express = require('express');
var router = express.Router();
var MsTranslator = require('mstranslator');
var client = new MsTranslator({
                                'client_id': process.env.CLIENT_ID,
                                'client_secret': process.env.CLIENT_SECRET
                              });

/*
 * GET translation
 * GET /translate
 */

router.get('/', function(req, res) {
  var text, from, to;
  text = "hello world";
  from = "en";
  to = "es";

  var params = {
    'text': text,
    'from': from,
    'to': to
  };

  client.initialize_token(function(keys) {
    console.log(keys.access_token);

    client.translate(params, function(err, data) {

      console.log(data);

    });
  });

  res.json({test: "something"});
});

function translate(req, res, cb) {
}

module.exports = router;