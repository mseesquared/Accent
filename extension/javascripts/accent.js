(function(){
  if (!annyang || !"speechSynthesis" in window) {
    alert("Your web browser could not support Accent.");
    return;
  }

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
    output.lang = langAbbrevs[endLang];
    output.text = translation;
    speechSynthesis.speak(output);
  }

  var translateUrl = function(utterance) {
    return "http://accent-both.herokuapp.com/translate?" 
      + "text=" + utterance
      + "from=" + langAbbrevs[startLang]
      + "to=" + langAbbrevs[endLang];
  }

  var translate = function(utterance) {
    // $.get(
    //   translateUrl(utterance), 
    //   function(translation) {
    //     synthesize(translation);
    //   }
    // );

    var translation = "hola";
    synthesize(translation);
  }

  var commands = { "*utterance": translate };
  annyang.addCommands(commands);
  annyang.start();
})();
