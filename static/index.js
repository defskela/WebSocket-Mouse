// Disabled context menu when right-clicking
document.oncontextmenu = function (){
    return false;
}



let PK = 0; // 0 - mobile, 1 - PK

let PKM_m = "0"; // right mouse button state
let LKM_m = "0"; // left mouse button state

let timer = new Date().getTime(); // without lags

let first_move = 0; // Finger transfer
let delta_x = "0";
let delta_y = "0";
let delta_v = "0 0";

let coordin_x = 0;
let coordin_y = 0;

const touchpad = document.querySelector("#touchpad");
const lkm = document.querySelector("button.lkm");
const pkm = document.querySelector("button.pkm");
const btns = document.querySelector(".buttons");
const isMobile = window.innerWidth < 768; // false if PK and true if mobile

// if PK
if (isMobile == false) {
  Reverse_on_PK();
}

// console.log(window.innerWidth < 768);

// Hiding the buttons
function Reverse_on_PK() {
  btns.style.display = "none";
  PK = 1;
}

if (PK == false) {
  touchpad.addEventListener("touchstart", TouchStart);
  touchpad.addEventListener("touchmove", HandleMove);

  lkm.addEventListener("touchstart", LefthandleStart);
  lkm.addEventListener("touchend", LefthandleEnd);

  pkm.addEventListener("touchstart", RighthandleStart);
  pkm.addEventListener("touchend", RighthandleEnd);
  // We change and transfer data
  function HandleMove(evt) {
    if (first_move == 1) {
      coordin_x = parseInt(evt.changedTouches[0].pageX);
      coordin_y = parseInt(evt.changedTouches[0].pageY);
      first_move = 0;
    }
    delta_x = String((parseInt(evt.changedTouches[0].pageX) - coordin_x) * 3);
    delta_y = String((parseInt(evt.changedTouches[0].pageY) - coordin_y) * 3);
    delta_v = delta_x + " " + delta_y;
    coordin_x = parseInt(evt.changedTouches[0].pageX);
    coordin_y = parseInt(evt.changedTouches[0].pageY);
    // No more than once every 20 milliseconds
    if (new Date().getTime() - timer > 20) {
      timer = new Date().getTime();
      sendMessage(delta_v + " " + LKM_m + " " + PKM_m);
    }
  }
} else {
  touchpad.addEventListener("mousedown", PressMouse);
  touchpad.addEventListener("mouseup", UnPressMouse);
  touchpad.addEventListener("mousemove", HandleMove);

  function HandleMove(evt) {
    // Changing mouse sensitivity
    delta_x = String((parseInt(evt.pageX) - coordin_x) * 3);
    delta_y = String((parseInt(evt.pageY) - coordin_y) * 3);

    delta_v = delta_x + " " + delta_y;
    coordin_x = parseInt(evt.pageX);
    coordin_y = parseInt(evt.pageY);
    if (new Date().getTime() - timer > 20) {
      timer = new Date().getTime();
      sendMessage(delta_v + " " + LKM_m + " " + PKM_m);
    }
  }
}

function PressMouse(event) {
  if (event.button == 0) {
      LKM_m = "1";
      sendMessage("0 0" + " " + LKM_m + " " + PKM_m);
  }
  else if (event.button == 2) {
      PKM_m = "1";
      sendMessage("0 0" + " " + LKM_m + " " + PKM_m);
  }
}

function UnPressMouse(event) {
  if (event.button == 0) {
      LKM_m = "0";
      sendMessage("0 0" + " " + LKM_m + " " + PKM_m);
  }
  else if (event.button == 2) {
      PKM_m = "0";
      sendMessage("0 0" + " " + LKM_m + " " + PKM_m);
  }
}

function TouchStart(event) {
  first_move = 1;
}

function LefthandleStart() {
  LKM_m = "1";
  sendMessage("0 0" + " " + LKM_m + " " + PKM_m);
}

function LefthandleEnd() {
  LKM_m = "0";
  sendMessage("0 0" + " " + LKM_m + " " + PKM_m);
}

function RighthandleStart() {
  PKM_m = "1";
  sendMessage("0 0" + " " + LKM_m + " " + PKM_m);
}

function RighthandleEnd() {
  PKM_m = "0";
  sendMessage("0 0" + " " + LKM_m + " " + PKM_m);
}

// WebSockets support
const targetUrl = `ws://${location.host}/ws`; // connect websockets
let websocket;
window.addEventListener("load", onLoad);

function onLoad() {
  initializeSocket();
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
