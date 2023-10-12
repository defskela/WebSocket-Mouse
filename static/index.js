// WebSocket support
var PKM_m = '0';
var LKM_m = '0';

var delta_x = '0';
var delta_y = '0';
var delta_v = '0:0';

var coordin_x = '0';
var coordin_y = '0';

var targetUrl = `ws://${location.host}/ws`;
var websocket;
window.addEventListener("load", onLoad);

function onLoad() {
  initializeSocket();
  
  var touchpad = document.getElementById("touchpad");
  touchpad.addEventListener("touchstart", TouchStart);
  touchpad.addEventListener("touchmove", function(evt) {
    console.log(evt.changedTouches[0].pageX)
    delta_x = String(Number(Math.round(evt.changedTouches[0].pageX)) - Number(coordin_x));
    delta_y = String(Number(Math.round(evt.changedTouches[0].pageY)) - Number(coordin_y));
    delta_v = delta_x + ':' + delta_y;
    coordin_x = Math.round(evt.changedTouches[0].pageX);
    coordin_y = Math.round(evt.changedTouches[0].pageY);
    sendMessage(delta_v + ' ' + LKM_m + ' ' + PKM_m);
  });
  
  var lkm = document.getElementById("LKM");
  lkm.addEventListener("touchstart", LefthandleStart);
  lkm.addEventListener("touchend", LefthandleEnd);
  
  let pkm = document.getElementById("PKM");
  pkm.addEventListener("touchstart", RighthandleStart);
  pkm.addEventListener("touchend", RighthandleEnd);
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
    coordin_x = Math.round(evt.changedTouches[0].pageX);
    coordin_y = Math.round(evt.changedTouches[0].pageY);
}
function HandleMove() {
    delta_x = String(Number(Math.round(event.pageX)) - Number(coordin_x));
    delta_y = String(Number(Math.round(event.pageY)) - Number(coordin_y));
    delta_v = delta_x + ':' + delta_y;
    coordin_x = Math.round(event.pageX);
    coordin_y = Math.round(event.pageY);
    sendMessage(delta_v + ' ' + LKM_m + ' ' + PKM_m);
}


function LefthandleStart() {
    LKM_m = '1';
    sendMessage(delta_v + ' ' + LKM_m + ' ' + PKM_m);
}
function LefthandleEnd() {
    LKM_m = '0';
    sendMessage(delta_v + ' ' + LKM_m + ' ' + PKM_m);
}

function RighthandleStart() {
    PKM_m = '1';
    sendMessage(delta_v + ' ' + LKM_m + ' ' + PKM_m);
}

function RighthandleEnd() {
    PKM_m = '0';
    sendMessage(delta_v + ' ' + LKM_m + ' ' + PKM_m);
}
