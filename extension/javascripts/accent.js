(function(){

  if (annyang) return;

  var startLang = prompt("What language will you be speaking in?");
  var endLang = prompt("What language do you want your speech to be translated to?");

  var translate = function(utterance) {
    // Pass utterance to John's server-side speech translation API.
    // Pass the response into Yushi's client-side speech synthesis code.
  }

  var commands = { "*utterance": translate };

  annyang.init(commands);
  annyang.start();

})();
