(function(){
  if (!annyang || !"speechSynthesis" in window) {
    alert("Your web browser could not support Accent.");
    return;
  }

  var langAbbrevs = {
    "english" : { "webSpeech": "en-US", "microsoft": "en" },
    "french"  : { "webSpeech": "fr-FR", "microsoft": "fr" },
    "german"  : { "webSpeech": "de-DE", "microsoft": "de" },
    "spanish" : { "webSpeech": "es-US", "microsoft": "es" }
  };

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

  var startLang = sanitizeLang(prompt("What language will you be speaking in?"));
  var endLang = sanitizeLang(prompt("What language will your speech to be translated to?"));

  if (!startLang || !endLang) {
    alert("Language not supported by Accent.");
    return;
  }

  var synthesize = function(translation) {
    var output = new SpeechSynthesisUtterance();
    output.lang = langAbbrevs[endLang]["webSpeech"];
    output.text = translation;
    output.onend = function() {
      annyang.start();
    }
    speechSynthesis.speak(output);
  }

  var translateUrl = function(utterance) {
    return "http://accent-both.herokuapp.com/translate?"
      + "text=" + encodeURI(utterance) + "&"
      + "from=" + langAbbrevs[startLang]["microsoft"] + "&"
      + "to=" + langAbbrevs[endLang]["microsoft"];
  }

  var translate = function(utterance) {
    annyang.abort();
    $.get(
      translateUrl(utterance), 
      function(data) {
        synthesize(data["translation"]);
      }
    );
  }

  var annyangCommands = { "*utterance": translate };
  annyang.setLanguage(langAbbrevs[startLang]["microsoft"]);
  annyang.addCommands(annyangCommands);
  annyang.start();
})();
