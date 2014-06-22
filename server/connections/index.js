
function connectionResponse(io) {

  // The function
  return function (socket) {
    socket.on('utterance', function(utterance) {
      /*
      var hangoutUrl, text;
      hangoutUrl  = utterance.hangoutUrl;
      text        = utterance.text;
      */
      console.log(utterance);
      io.broadcast(utterance);
    });
  }
}

module.exports = connectionResponse;