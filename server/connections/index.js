
function connectionResponse(io) {

  // The function
  return function (socket) {
    socket.on('utterancePkg', function(utterancePkg) {
      /*
      var hangoutUrl, from, text;
      hangoutUrl  = utterancePkg.hangoutUrl; // hangoutUrl for the msg
      from        = utterancePkg.from; // the language from which we are translating
      text        = utterancePkg.text; // the text we are translating
      */
      console.log('---------------------------------------');
      console.log(utterancePkg);
      console.log('---------------------------------------');
      socket.broadcast.emit('utterancePkg', utterancePkg);
    });
  }
}

module.exports = connectionResponse;