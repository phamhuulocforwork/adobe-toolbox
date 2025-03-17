function expressionPanel(thisObj) {
  var win =
    thisObj instanceof Panel ? thisObj : new Window("palette", "Expression Script", undefined);
  win.spacing = 6;
  var tabPanel = win.add("tabbedpanel");
  tabPanel.alignChildren = ["fill", "fill"];
  tabPanel.preferredSize = [350, 300];
}
var myPanel = new Window("palette", "SimpleAnimation v1.0", undefined, { resizeable: true });
myPanel.alignChildren = ["fill", "top"];
myPanel.spacing = 5;
myPanel.margins = 10;

// Motion Effects Group
var motionGroup = myPanel.add("panel", undefined, "Motion Effects");
motionGroup.orientation = "column";
motionGroup.alignChildren = ["fill", "top"];
motionGroup.spacing = 5;
motionGroup.margins = 10;

var motionButtonGroup = motionGroup.add("group");
motionButtonGroup.orientation = "row";
motionButtonGroup.alignChildren = ["left", "center"];
motionButtonGroup.spacing = 5;

var bounceBtn = motionButtonGroup.add("button", undefined, "Bounce");
bounceBtn.size = [80, 25];
bounceBtn.onClick = function () {
  applyBounceExpression();
};

var squashBtn = motionButtonGroup.add("button", undefined, "Squash");
squashBtn.size = [80, 25];
squashBtn.onClick = function () {
  applySquashExpression();
};

// Motion Settings
var motionSettings = motionGroup.add("group");
motionSettings.orientation = "row";
motionSettings.alignChildren = ["left", "center"];

// Loop Effects Group
var loopGroup = myPanel.add("panel", undefined, "Loop Effects");
loopGroup.orientation = "column";
loopGroup.alignChildren = ["fill", "top"];
loopGroup.spacing = 5;
loopGroup.margins = 10;

var loopButtonGroup = loopGroup.add("group");
loopButtonGroup.orientation = "row";
loopButtonGroup.alignChildren = ["left", "center"];
loopButtonGroup.spacing = 5;

var loopBtn = loopButtonGroup.add("button", undefined, "LoopOut");
loopBtn.size = [80, 25];
loopBtn.onClick = function () {
  openSubMenu();
};

var spinBtn = loopButtonGroup.add("button", undefined, "Spin");
spinBtn.size = [80, 25];
spinBtn.onClick = function () {
  applySpinExpression();
};

// Loop Settings
var loopSettings = loopGroup.add("group");
loopSettings.orientation = "row";
loopSettings.alignChildren = ["left", "center"];

// Transition Effects Group
var transitionGroup = myPanel.add("panel", undefined, "Transition Effects");
transitionGroup.orientation = "column";
transitionGroup.alignChildren = ["fill", "top"];
transitionGroup.spacing = 5;
transitionGroup.margins = 10;

var transitionButtonGroup = transitionGroup.add("group");
transitionButtonGroup.orientation = "row";
transitionButtonGroup.alignChildren = ["left", "center"];
transitionButtonGroup.spacing = 5;

var fadeInBtn = transitionButtonGroup.add("button", undefined, "Fade In");
fadeInBtn.size = [80, 25];
fadeInBtn.onClick = function () {
  applyFadeInExpression();
};

var smoothFollowBtn = transitionButtonGroup.add("button", undefined, "Smooth Follow");
smoothFollowBtn.size = [80, 25];
smoothFollowBtn.onClick = function () {
  applySmoothFollowExpression();
};

// Transition Settings
var transitionSettings = transitionGroup.add("group");
transitionSettings.orientation = "row";
transitionSettings.alignChildren = ["left", "center"];

// Special Effects Group
var specialGroup = myPanel.add("panel", undefined, "Special Effects");
specialGroup.orientation = "column";
specialGroup.alignChildren = ["fill", "top"];
specialGroup.spacing = 5;
specialGroup.margins = 10;

var specialButtonGroup = specialGroup.add("group");
specialButtonGroup.orientation = "row";
specialButtonGroup.alignChildren = ["left", "center"];
specialButtonGroup.spacing = 5;

var clockBtn = specialButtonGroup.add("button", undefined, "Clock");
clockBtn.size = [80, 25];
clockBtn.onClick = function () {
  createClockTextLayer();
};

// Special Settings
var specialSettings = specialGroup.add("group");
specialSettings.orientation = "row";
specialSettings.alignChildren = ["left", "center"];

// Layout and show
myPanel.layout.layout(true);
myPanel.layout.resize();
myPanel.center();
myPanel.show();

function applyBounceExpression() {
  var comp = app.project.activeItem;
  if (!comp || !(comp instanceof CompItem)) {
    alert("Please open a composition.");
    return;
  }

  var selectedProperty = comp.selectedProperties[0];
  if (!selectedProperty) {
    alert("Please select Position property with Keyframes.");
    return;
  }

  // Apply the bounce expression to the selected property
  selectedProperty.expression =
    "amp = 0.1;\n" +
    "freq = 2.0;\n" +
    "decay = 5.0;\n" +
    "n = 0;\n" +
    "time_max = 4;\n" +
    "if (numKeys > 0) {\n" +
    "  n = nearestKey(time).index;\n" +
    "  if (key(n).time > time) {\n" +
    "    n--;\n" +
    "  }\n" +
    "}\n" +
    "if (n == 0) {\n" +
    "  t = 0;\n" +
    "} else {\n" +
    "  t = time - key(n).time;\n" +
    "}\n" +
    "if (n > 0 && t < time_max) {\n" +
    "  v = velocityAtTime(key(n).time - thisComp.frameDuration/10);\n" +
    "  value + v * amp * Math.sin(freq * t * 2 * Math.PI) / Math.exp(decay * t);\n" +
    "} else {\n" +
    "  value;\n" +
    "}";
}

function openSubMenu() {
  var subMenuWindow = new Window("palette", "LoopOut", undefined, { resizable: true });

  var subButton1 = subMenuWindow.add("button", undefined, "Ping Pong");
  var subButton2 = subMenuWindow.add("button", undefined, "Continue");
  var subButton3 = subMenuWindow.add("button", undefined, "Cycle");
  var subButton4 = subMenuWindow.add("button", undefined, "Offset");

  subButton1.onClick = function () {
    applyPingPongExpression();
    subMenuWindow.close();
  };

  subButton2.onClick = function () {
    applyContinueExpression();
    subMenuWindow.close();
  };

  subButton3.onClick = function () {
    applyCycleExpression();
    subMenuWindow.close();
  };

  subButton4.onClick = function () {
    applyOffsetExpression();
    subMenuWindow.close();
  };

  subMenuWindow.layout.layout(true);
  subMenuWindow.layout.resize();

  subMenuWindow.show();
}

function createClockTextLayer() {
  var comp = app.project.activeItem;
  if (!comp || !(comp instanceof CompItem)) {
    alert("Please open a composition.");
    return;
  }

  var textLayer = comp.layers.addText();
  textLayer.name = "Clock";

  var textProperty = textLayer.property("Source Text");
  textProperty.expression =
    "var currentTime = time;\n" +
    "var minutes = Math.floor((currentTime % 3600) / 60);\n" +
    "var seconds = Math.floor(currentTime % 60);\n" +
    'var minutesString = minutes.toString().padStart(2, "0");\n' +
    'var secondsString = seconds.toString().padStart(2, "0");\n' +
    'var timeString = minutesString + ":" + secondsString;\n' +
    "timeString;";
}

function applySquashExpression() {
  var comp = app.project.activeItem;
  if (!comp || !(comp instanceof CompItem)) {
    alert("Please open a composition.");
    return;
  }

  var selectedProperty = comp.selectedProperties[0];
  if (!selectedProperty) {
    alert("Please select Scale property.");
    return;
  }

  selectedProperty.expression =
    "maxDev = 50; // max deviation in pixels\n" +
    "spd = 20; // speed of oscillation\n" +
    "decay = 3; // how fast it slows down\n" +
    "t = time - inPoint;\n" +
    "x = scale[0] + maxDev * Math.sin(spd * t) / Math.exp(decay * t);\n" +
    "y = scale[0] * scale[1] / x;\n" +
    "[x, y]";
}

function applyPingPongExpression() {
  var comp = app.project.activeItem;
  if (!comp || !(comp instanceof CompItem)) {
    alert("Please open a composition.");
    return;
  }

  var selectedProperty = comp.selectedProperties[0];
  if (!selectedProperty) {
    alert("Please select a property with Keyframes.");
    return;
  }

  selectedProperty.expression = 'loopOut("pingpong")';
}

function applyContinueExpression() {
  var comp = app.project.activeItem;
  if (!comp || !(comp instanceof CompItem)) {
    alert("Please open a composition.");
    return;
  }

  var selectedProperty = comp.selectedProperties[0];
  if (!selectedProperty) {
    alert("Please select a property with Keyframes.");
    return;
  }

  selectedProperty.expression = 'loopOut("continue")';
}

function applyCycleExpression() {
  var comp = app.project.activeItem;
  if (!comp || !(comp instanceof CompItem)) {
    alert("Please open a composition.");
    return;
  }

  var selectedProperty = comp.selectedProperties[0];
  if (!selectedProperty) {
    alert("Please select a property with Keyframes.");
    return;
  }

  selectedProperty.expression = 'loopOut("cycle")';
}

function applyOffsetExpression() {
  var comp = app.project.activeItem;
  if (!comp || !(comp instanceof CompItem)) {
    alert("Please open a composition.");
    return;
  }

  var selectedProperty = comp.selectedProperties[0];
  if (!selectedProperty) {
    alert("Please select a property with Keyframes.");
    return;
  }

  selectedProperty.expression = 'loopOut("offset")';
}

function applyFadeInExpression() {
  var comp = app.project.activeItem;
  if (!comp || !(comp instanceof CompItem)) {
    alert("Please select a composition first");
    return;
  }

  var selectedProperty = comp.selectedProperties[0];
  if (!selectedProperty) {
    alert("Please select Opacity property");
    return;
  }

  selectedProperty.expression =
    "fadeDuration = 1; // seconds\n" + "linear(time, inPoint, inPoint + fadeDuration, 0, 100)";
}

function applySmoothFollowExpression() {
  var comp = app.project.activeItem;
  if (!comp || !(comp instanceof CompItem)) {
    alert("Please select Position property");
    return;
  }

  var selectedProperty = comp.selectedProperties[0];
  if (!selectedProperty) {
    alert("Please select Position property");
    return;
  }

  selectedProperty.expression =
    "smoothness = 100; // độ mượt\n" + "value + (valueAtTime(time - .1) - value)/smoothness";
}

function applySpinExpression() {
  var comp = app.project.activeItem;
  if (!comp || !(comp instanceof CompItem)) {
    alert("Please open a composition.");
    return;
  }

  var selectedProperty = comp.selectedProperties[0];
  if (!selectedProperty) {
    alert("Please select Rotation property.");
    return;
  }

  selectedProperty.expression =
    "speed = 360; // degrees per second\n" + "value + speed * (time - inPoint)";
}
