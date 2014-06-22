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

  text = req.query.text;
  from = req.query.from;
  to = req.query.to;

  translate(text, from, to, function(translation) {
    res.json({'translation': translation});
  });
});

function translate(text, from, to, cb) {
  var params = {
    'text': text,
    'from': from,
    'to': to
  };
  console.log(to);

  client.initialize_token(function(keys) {
    // debug
    // console.log(keys.access_token);

    client.translate(params, function(err, data) {

      // debug
      // console.log(data);

      cb(data);
    });
  });
}

module.exports = router;