(function(){
  if (!annyang || !"speechSynthesis" in window) {
    alert("Your web browser could not support Accent.");
    return;
  }

  var langAbbrevs = {
    "chinese" : { "translate": "zh-CHS", "synthesize": "cmn-Hans-CN" },
    "czech"   : { "translate": "cs", "synthesize": "cs-CZ" },
    "dutch"   : { "translate": "nl", "synthesize": "nl-NL" },
    "english" : { "translate": "en", "synthesize": "en-US" },
    "finnish" : { "translate": "fi", "synthesize": "fi-FI" },
    "french"  : { "translate": "fr", "synthesize": "fr-FR" },
    "german"  : { "translate": "de", "synthesize": "de-DE" },
    "polish"  : { "translate": "pl", "synthesize": "pl-PL" },
    "russian" : { "translate": "ru", "synthesize": "ru-RU" },
    "spanish" : { "translate": "es", "synthesize": "es-US" }
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
    output.lang = langAbbrevs[endLang]["synthesize"];
    output.text = translation;
    output.onend = function() {
      annyang.start();
    }
    speechSynthesis.speak(output);
  }

  var translateUrl = function(utterance) {
    return "http://accent-both.herokuapp.com/translate?" 
      + "text=" + encodeURI(utterance) + "&"
      + "from=" + langAbbrevs[startLang]["translate"] + "&"
      + "to=" + langAbbrevs[endLang]["translate"];
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
  annyang.addCommands(annyangCommands);
  annyang.start();
})();
