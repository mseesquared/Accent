(function(){
  if (!annyang || !"speechSynthesis" in window || !io) {
    alert("Your web browser could not support Accent.");
    return;
  }

  var langAbbrevs = {
    "english" : { "webSpeech": "en-US", "microsoft": "en" },
    "french"  : { "webSpeech": "fr-FR", "microsoft": "fr" },
    "german"  : { "webSpeech": "de-DE", "microsoft": "de" },
    "spanish" : { "webSpeech": "es-US", "microsoft": "es" },
    "dutch"   : { "webSpeech": "nl-NL", "microsoft": "nl" },
    "italian" : { "webSpeech": "it-IT", "microsoft": "it" }
  };

  var url = window.location.href;
  var oldHangoutUrl = encodeURIComponent(url);
  var hangoutUrl = oldHangoutUrl.substring(0, oldHangoutUrl.indexOf('&'));

  var socket = io.connect('http://accent-both.herokuapp.com');

  var sanitizeLang = function(lang) {
    if (!lang) return null;
    lang = lang.toLowerCase();
    for (var key in langAbbrevs) {
      if (langAbbrevs.hasOwnProperty(key)) {
        if (lang.indexOf(key) > -1) return key;
      }
    }
    return null;
  }

  var nativeLang = sanitizeLang(prompt("What is your language?"));

  if (!nativeLang) {
    alert("Language not supported by Accent.");
    return;
  }

  var synthesize = function(translation) {
    var output = new SpeechSynthesisUtterance();
    output.lang = langAbbrevs[nativeLang]["webSpeech"];
    output.text = translation;
    output.onend = function() {
      annyang.start();
    }
    speechSynthesis.speak(output);
  }
  
  var translateUrl = function(utterance, from) {
    return "http://accent-both.herokuapp.com/translate?"
      + "text=" + encodeURI(utterance) + "&"
      + "from=" + langAbbrevs[from]["microsoft"] + "&"
      + "to=" + langAbbrevs[nativeLang]["microsoft"];
  }

  var translate = function(utterance, from) {
    console.log('Translating utterance ***************************');
    console.log(utterance);
    annyang.abort();
    $.get(
      translateUrl(utterance, from), 
      function(data) {
        synthesize(data["translation"]);
      }
    );
  }

  // socket called when an utterance is sent to this client
  socket.on('utterancePkg', function(utterancePkg) {

    // If the hangoutUrls do not match, ignore the broadcast
    if (utterancePkg.hangoutUrl !== hangoutUrl) return;

    var text = utterancePkg.text;
    var from = utterancePkg.from;

    translate(text, from);

  });

  var emit = function(utterance) {
    var utterancePkg = {};
    utterancePkg.hangoutUrl = hangoutUrl;
    utterancePkg.from = nativeLang;
    utterancePkg.text = utterance;
    socket.emit("utterancePkg", utterancePkg);
    console.log("Emitting utterance: " + utterancePkg);
  }

  var annyangCommands = { "*utterance": emit };
  annyang.setLanguage(langAbbrevs[nativeLang]["microsoft"]);
  annyang.addCommands(annyangCommands);
  annyang.start();
})();
