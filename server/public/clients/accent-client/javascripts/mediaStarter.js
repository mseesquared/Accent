// Keep track of some UI elements
var overlayControls = document.getElementById('overlayControls');
var scaleTxt = document.getElementById('scaleTxt');
var offsetTxt = document.getElementById('offsetTxt');

// Track our overlays for re-use later
var overlays = [];

// Scale limits---tiny hats look silly, but tiny monocles are fun.
var minScale = [];
var maxScale = [];

var keepAnimating = false;

/** Responds to buttons
 * @param {string} name Item to show.
 */
function showOverlay(name) {
  hideAllOverlays();
  currentItem = name;
  setControlVisibility(true);
  overlays[currentItem].setVisible(true);
  updateControls();
}

function showNothing() {
  currentItem = null;
  hideAllOverlays();
  setControlVisibility(false);
}

/** Responds to scale slider
 * @param {string} value The new scale.
 */
function onSetScale(value) {
  scaleTxt.innerHTML = parseFloat(value).toFixed(2);

  if (currentItem == 'fancy') {
    overlays[currentItem].setScale(parseFloat(value),
        gapi.hangout.av.effects.ScaleReference.WIDTH);
  } else {
    overlays[currentItem].setScale(parseFloat(value));
  }
}

/** Responds to offset slider
 * @param {string} value The new offset.
 */
function onSetOffset(value) {
  console.log('Setting ' + value);

  offsetTxt.innerHTML = parseFloat(value).toFixed(2);

  if (currentItem == 'fancy') {
    overlays[currentItem].setPosition(0, parseFloat(value));
  } else {
    overlays[currentItem].setOffset(0, parseFloat(value));
  }
}

function setControlVisibility(val) {
  if (val) {
    overlayControls.style.visibility = 'visible';
  } else {
    overlayControls.style.visibility = 'hidden';
  }
}

function updateOverlayControls() {
  var overlay = overlays[currentItem];
  var min = minScale[currentItem];
  var max = maxScale[currentItem];

  // Overlays magnitude and which dimension of the screen to return
  var scale = overlay.getScale().magnitude;

  document.getElementById('scaleSlider').value = scale;
  document.getElementById('scaleSlider').min = min;
  document.getElementById('scaleSlider').max = max;
  document.getElementById('scaleTxt').innerHTML =
      scale.toFixed(2);

  document.getElementById('offsetSlider').value = overlay.getPosition().y;
  document.getElementById('offsetTxt').innerHTML =
      overlay.getPosition().y.toFixed(2);
}

function updateFaceTrackingOverlayControls() {
  var overlay = overlays[currentItem];
  var min = minScale[currentItem];
  var max = maxScale[currentItem];

  // FaceTrackingOverlays return only magnitude
  var scale = overlay.getScale();

  document.getElementById('scaleSlider').value = scale;
  document.getElementById('scaleSlider').min = min;
  document.getElementById('scaleSlider').max = max;
  document.getElementById('scaleTxt').innerHTML =
      scale.toFixed(2);

  document.getElementById('offsetSlider').value = overlay.getOffset().y;
  document.getElementById('offsetTxt').innerHTML =
      overlay.getOffset().y.toFixed(2);
}


/** Resets the controls for each type of wearable item */
function updateControls() {
  // Don't show these controls for
  if (currentItem == 'fancy') {
    updateOverlayControls();
  } else {
    updateFaceTrackingOverlayControls();
  }
}

/** For removing every overlay */
function hideAllOverlays() {
  for (var index in overlays) {
    overlays[index].setVisible(false);
  }
  disposeArbitraryOverlay();
  keepAnimating = false;
}

function createTextOverlay(string) {
  // Create a canvas to draw on
  var canvas = document.createElement('canvas');
  canvas.setAttribute('width', 166);
  canvas.setAttribute('height', 100);
  
  var context = canvas.getContext('2d');

  // Draw background
  context.fillStyle = '#BBB';
  context.fillRect(0,0,166,50);

  // Draw text
  context.font = '32pt Impact';
  context.lineWidth = 6;
  context.lineStyle = '#000';
  context.fillStyle = '#FFF';
  context.fillColor = '#ffff00';
  context.fillColor = '#ffff00';
  context.textAlign = 'center';
  context.textBaseline = 'bottom';
  context.strokeText(string, canvas.width / 2, canvas.height / 2);
  context.fillText(string, canvas.width / 2, canvas.height / 2);

  return canvas.toDataURL();
}

/** Initialize our constants, build the overlays */
function createOverlays() {
  var topHat = gapi.hangout.av.effects.createImageResource(
      'http://hangoutmediastarter.appspot.com/static/topHat.png');
  overlays['topHat'] = topHat.createFaceTrackingOverlay(
      {'trackingFeature':
       gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
       'scaleWithFace': true,
       'rotateWithFace': true,
       'scale': 1.0});
  minScale['topHat'] = 0.25;
  maxScale['topHat'] = 1.5;

  var mono = gapi.hangout.av.effects.createImageResource(
      'http://hangoutmediastarter.appspot.com/static/monocle.png');
  overlays['mono'] = mono.createFaceTrackingOverlay(
      {'trackingFeature':
       gapi.hangout.av.effects.FaceTrackingFeature.RIGHT_EYE,
       'scaleWithFace': true,
       'scale': 1.0});
  minScale['mono'] = 0.5;
  maxScale['mono'] = 1.5;

  var stache = gapi.hangout.av.effects.createImageResource(
      'http://hangoutmediastarter.appspot.com/static/mustache.png');
  overlays['stache'] = stache.createFaceTrackingOverlay(
      {'trackingFeature':
       gapi.hangout.av.effects.FaceTrackingFeature.NOSE_TIP,
       'scaleWithFace': true,
       'rotateWithFace': true});
  minScale['stache'] = 0.65;
  maxScale['stache'] = 2.5;

  var fancy = gapi.hangout.av.effects.createImageResource(
      createTextOverlay('Hello!'));
  // Create this non-moving overlay that will be 100% of the width
  // of the video feed.
  overlays['fancy'] = fancy.createOverlay(
      {'scale':
       {'magnitude': 0.5,
        'reference': gapi.hangout.av.effects.ScaleReference.WIDTH}});
  // Put the text x-centered and near the bottom of the frame
  overlays['fancy'].setPosition(0, 0.45);
  minScale['fancy'] = 1.0;
  maxScale['fancy'] = 2.5;
}

// Arbitray overlay
var arbitraryResource = null;
var arbitraryOverlay = null;

function disposeArbitraryOverlay() {
    if (arbitraryResource) {
	arbitraryResource.dispose();
	arbitraryResource = null;
    }
}

function loadOverlay(uri) {
    showNothing();
    
    arbitraryResource = gapi.hangout.av.effects.createImageResource(
	uri);

    // Use an onLoad handler 
    arbitraryResource.onLoad.add( function(event) {
	if ( !event.isLoaded ) {
	    alert("We could not load your overlay.");
	} else {
	    alert("We loaded your overlay.");
	}
    });

    // Create this non-moving overlay that will be 50% of the width
    // of the video feed.
    arbitraryOverlay = arbitraryResource.createOverlay(
	{'scale':
	 {'magnitude': 0.5,
          'reference': gapi.hangout.av.effects.ScaleReference.WIDTH}});
    // Put the text x-centered and halfway down the frame
    arbitraryOverlay.setPosition(0, 0.25);
    arbitraryOverlay.setVisible(true);
}


// Animated
var frameCount = 0;

var animatedResource = null;
var animatedOverlay = null;

function updateAnimatedOverlay(time) {  
    var oldResource = animatedResource;
    var oldOverlay = animatedOverlay;

    animatedResource = gapi.hangout.av.effects.createImageResource(
	createTextOverlay('Tick: ' + frameCount));
    // Create this non-moving overlay that will be 50% of the width
    // of the video feed.
    animatedOverlay = animatedResource.createOverlay(
	{'scale':
	 {'magnitude': 0.5,
          'reference': gapi.hangout.av.effects.ScaleReference.WIDTH}});
    // Put the text x-centered and near the bottom of the frame
    animatedOverlay.setPosition(0, 0.45);
    animatedOverlay.setVisible(true);

    if (oldResource) {
	// This will also dispose of the related overlay.
	oldResource.dispose();
	oldResource = null;
    }
}

function animLoop() {
    if (keepAnimating) {
	window.setTimeout(animLoop, 1000);
	frameCount++;
	updateAnimatedOverlay(frameCount);
    }
}

function showAnimatedOverlay() {
    showNothing();
    keepAnimating = true;
    animLoop();
}

createOverlays();

// SOUND

var gooddaySoundURL =
    'http://hangoutmediastarter.appspot.com/static/goodday.wav';

var gooddaySound = gapi.hangout.av.effects.createAudioResource(
    gooddaySoundURL).createSound({loop: false, localOnly: false});

// Note that we are playing a global audio event,
// so other hangouts will hear it.
function sayGoodDay() {
    gooddaySound.play();
}

// Set mirroring and unmirroring
function updateMirroring() {
  var val =  document.querySelector('#mirror-checkbox').checked;

  gapi.hangout.av.setLocalParticipantVideoMirrored(val);
}

function init() {
  gapi.hangout.onApiReady.add(function(eventObj) {
    console.log("everything ready");
    document.querySelector('#fullUI').style.visibility = 'visible';
  });
}

function toggleTranslate() {
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
  var oldHangoutUrl = url.substring(0, url.indexOf('&'));
  var hangoutUrl = encodeURIComponent(oldHangoutUrl);

  var socket = io.connect('https://accent-both.herokuapp.com');

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
    return "https://accent-both.herokuapp.com/translate?"
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
}

gadgets.util.registerOnLoadHandler(init);
