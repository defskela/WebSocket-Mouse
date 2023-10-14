var PKM_m = '0';
var LKM_m = '0';

var timer = new Date().getTime();

var first_move = 0;
var delta_x = '0';
var delta_y = '0';
var delta_v = '0 0';

var coordin_x = 0;
var coordin_y = 0;

var targetUrl = `ws://${location.host}/ws`;
var websocket;
window.addEventListener("load", onLoad);

function onLoad() {
  initializeSocket();
  
  var touchpad = document.getElementById("touchpad");
  touchpad.addEventListener("touchstart", TouchStart);
  touchpad.addEventListener("touchmove", function (evt) {
      if (first_move == 1) {
        coordin_x = parseInt(evt.changedTouches[0].pageX);
        coordin_y = parseInt(evt.changedTouches[0].pageY);
        first_move = 0
    }
    delta_x = String((parseInt(evt.changedTouches[0].pageX) - coordin_x) * 3);
    delta_y = String((parseInt(evt.changedTouches[0].pageY) - coordin_y) * 3);
    delta_v = delta_x + ' ' + delta_y;
    coordin_x = parseInt(evt.changedTouches[0].pageX);
    coordin_y = parseInt(evt.changedTouches[0].pageY);
    if (new Date().getTime() - timer > 20) {
        timer = new Date().getTime()
        sendMessage(delta_v + ' ' + LKM_m + ' ' + PKM_m);
    }
  });
  
  touchpad.addEventListener("mousedown", MouseStart);
  touchpad.addEventListener("mousemove", function (evt) {
      if (first_move == 1) {
        coordin_x = parseInt(evt.pageX);
        coordin_y = parseInt(evt.pageY);
        first_move = 0
    }
    delta_x = String((parseInt(evt.pageX) - coordin_x) * 3);
    delta_y = String((parseInt(evt.pageY) - coordin_y) * 3);
    delta_v = delta_x + ' ' + delta_y;
    coordin_x = parseInt(evt.pageX);
    coordin_y = parseInt(evt.pageY);
    if (new Date().getTime() - timer > 20) {
        timer = new Date().getTime()
        websocket.send(delta_v + ' ' + LKM_m + ' ' + PKM_m);
    }
  });
  
  var lkm = document.getElementById("LKM");
  lkm.addEventListener("mousedown", LefthandleStart);
  lkm.addEventListener("mouseup", LefthandleEnd);
  
  let pkm = document.getElementById("PKM");
  pkm.addEventListener("mousedown", RighthandleStart);
  pkm.addEventListener("mouseup", RighthandleEnd);
}

function initializeSocket() {
  console.log("Opening WebSocket connection MicroPython Server...");
  websocket = new WebSocket(targetUrl);
  websocket.onopen = onOpen;
  websocket.onclose = onClose;
  websocket.onmessage = onMessage;
}
function onOpen(event) {
  console.log("Starting connection to WebSocket server..");
}
function onClose(event) {
  console.log("Closing connection to server..");
  setTimeout(initializeSocket, 2000);
}
function onMessage(event) {
  console.log("WebSocket message received:", event);
  updateValues(event.data);
  updateChart(event.data);
}

function sendMessage(message) {
  websocket.send(message);
}

function TouchStart() {
    first_move = 1;
}

function MouseStart() {
    first_move = 1;
}

function HandleMove(evt) {
    if (first_move == 1) {
        coordin_x = parseInt(evt.changedTouches[0].pageX);
        coordin_y = parseInt(evt.changedTouches[0].pageY);
        first_move = 0
    }
    delta_x = String((parseInt(evt.changedTouches[0].pageX) - coordin_x) * 3);
    delta_y = String((parseInt(evt.changedTouches[0].pageY) - coordin_y) * 3);
    delta_v = delta_x + ' ' + delta_y;
    coordin_x = parseInt(evt.changedTouches[0].pageX);
    coordin_y = parseInt(evt.changedTouches[0].pageY);
    if (new Date().getTime() - timer > 20) {
        timer = new Date().getTime()
        sendMessage(delta_v + ' ' + LKM_m + ' ' + PKM_m);
    }
}


function LefthandleStart() {
    LKM_m = '1';
    sendMessage('0 0' + ' ' + LKM_m + ' ' + PKM_m);
}
function LefthandleEnd() {
    LKM_m = '0';
    sendMessage('0 0' + ' ' + LKM_m + ' ' + PKM_m);
}

function RighthandleStart() {
    PKM_m = '1';
    sendMessage('0 0' + ' ' + LKM_m + ' ' + PKM_m);
}

function RighthandleEnd() {
    PKM_m = '0';
    sendMessage('0 0' + ' ' + LKM_m + ' ' + PKM_m);
}

