(function(){
  if (!annyang || !"speechSynthesis" in window) {
    alert("Your web browser could not support Accent.");
    return;
  }

  var sanitizeLang = function(lang) {
    return lang;
  }

  var startLang = sanitizeLang(prompt("What language will you be speaking in?"));
  var endLang = sanitizeLang(prompt("What language do you want your speech to be translated to?"));

  var langAbbrevs = {
    "english": "en-US",
    "spanish": "es-US",
    "french": "fr-FR",
    "german": "de-DE",
    "chinese": "cmn-Hans-CN",
    "dutch": "nl-NL",
    "catalan": "ca-ES",
    "czech": "cs-CZ",
    "finnish": "fi-FI",
    "polish": "pl-PL",
    "russian": "ru-RU"
  };

  var synthesize = function(translation) {
    var output = new SpeechSynthesisUtterance();
    output.lang = langAbbrevs[endLang];
    output.text = translation;
    speechSynthesis.speak(output);
  }

  var translate = function(utterance) {
    // $.get("", function(translation) {
    //   synthesize(translation);
    // });

    var translation = "hola";
    synthesize(translation);
  }

  var commands = { "*utterance": translate };
  annyang.addCommands(commands);
  annyang.start();
})();
