
// ***** Configs and thresholds
let colorThreshold = 30;
let disappearTime = 1000;    //Blob disappear time
let timeGap = 25;  //Time threshold to take the turn off time to pattern list
let startTime = new Date().getTime();

let lightDuration = 1000;
let msgLenght = 2;

let lookAutomations = false;
//Pseudo Database

let pseudoDatabase = [
  {
  id:"123",
  type:"Light",
  name:"Bed light",
  entity_id:"light.hue_white_lamp_2",  // arba 2
  icon:"lampIcon",
  x:0,
  y:0
},
{
id:"143",
entity_id:"light.hue_white_lamp_1",  // arba 2
name:"Hue light",
type:"Light",
icon:"lampIcon",
x:0,
y:0
},
{
  id:"232",
  type:"Hue",
  name:"Hue light",
  entity_id:"light.hue_lightstrip_1",
  icon:"lightStrip",
  extras:"note",
  noteText:"Dear guest,<br> I hope you are having a nice stay! In the cupboard next to this lamp, there is my home made wine. Try it out and let me know what you think! <br> <strong> Owner </strong>",
  x:0,
  y:0
},
{
  id:"121",
  name:"",
  type:"Motion Sensor",
  icon:"motionIcon",
  x:0,
  y:0
},
{
  id:"214",
  name:"Main heater",
  type:"Temp",
  icon:"thermostatIcon",
  currentValue:"18",
  x:0,
  y:0
},{
  id:"212",
  name:"Music",
  type:"Music",
  entity_id:"media_player.spotify_bembis16",  // arba 2
  icon:"playMainIcon",
  currentValue:"21",
  extras:"issue",
  issueText:"The battery is low! Please charge the speaker",
  x:0,
  y:0
}];


let automation = [
  {
    id:"111",
    triggerDevices:"121",
    triggerTaskName:'<p><span style="font-weight:bold">IF</span> Trigger</p>',
    executedDevices:"143",
    executedTaskName:'<p><span style="font-weight:bold">THEN</span>  Turn on</p>',
    name:"When trigger turn on the lamp",
    type:"Light"
  }
];



//Get FPS
const times = [];
let fps;

var smartBoxes = [];

let trackColor = [253,233,54];
let blobs = []; // array of blob objects

let blobCounter = 0;

let mouseClick = false;
let mouseCoord = [0,0];

let captureVideo;
let printing = false;


var scWidth = window.innerWidth;
var scHeight = window.innerHeight;

var videoCamera = document.getElementById('video');
var canvas = document.getElementById('c')
var ctx = canvas.getContext('2d')


Date.now = function() { return new Date().getTime(); }
var triggerMillis = 0;



function refreshLoop() {

let bl = [];

  ctx.drawImage(videoCamera,0,0,320,240);
  var apx = ctx.getImageData(0, 0, 320, 240);
  var data = apx.data;

if(printing) console.log("Start to go trhoug pixesl", millis());

var max = 0;

  for(var i = 0; i < data.length; i+=4)
  {
      let gotHsvColor = rgb2hsb(data[i+0],data[i+1],data[i+2]);

       let svValue = gotHsvColor.sat * gotHsvColor.bri;

      svValue = mapMinMax(svValue,0,10000,0, 255);

      data[i] = svValue;
      data[i+1] =svValue;
      data[i+2] = svValue;


      if(svValue >= 150){

      let found = false;
      for (let j = 0; j < bl.length; j++) {

     if(bl[j].isNear(i)){

         bl[j].add(i, gotHsvColor.hue);

            if(j == 0){
              data[i] = 0;
              data[i+1] = 0;
              data[i+2] = 255;
            }else if(j == 1){
              data[i] = 0;
              data[i+1] = 255;
              data[i+2] = 0;
            }else if(j == 2){
              data[i] = 255;
              data[i+1] = 0;
              data[i+2] = 0;
            }else{
              data[i] = 0;
              data[i+1] = 255;
              data[i+2] = 255;
            }
         found= true;
         break;
        }
      }

      if(!found){
      bl.push(new Blobis(i, gotHsvColor.hue));
      }

      }

  }

  apx.data = data;
  ctx.putImageData(apx,0,0)




  //Match the new found blobs to the previous ones
  if(blobs.length == 0 && bl.length> 0){
      for (let i = 0; i < bl.length; i++) {
        bl[i].id = blobCounter;
        blobs.push(bl[i]);
        blobCounter++;
      }
  }else{
      for(let i = 0; i < blobs.length; i++){
        let recordD = 1000000;
        let matched = 0;
            for(let j = 0; j < bl.length; j++){
            let centerB = blobs[i].getCenter();
            let centerCB = bl[j].getCenter();

                let dist = distSq(centerB[0], centerB[1], centerCB[0], centerCB[1]);
                if(dist <  recordD && !bl[j].taken){
                  recordD = dist;
                  matched = j;
                }
            }

        if(recordD< 200){
          bl[matched].taken = true;
          blobs[i].become(bl[matched]);
        }
      }
      for(let i = 0; i < blobs.length; i++){
      blobs[i].taken = false;

      }

    // If there is a blob that doesn't exist in the previous list, push a new one
      for(let i = 0; i < bl.length; i++){
        if(bl[i].taken == false){
            bl[i].id = blobCounter;
            blobs.push(bl[i]);
            blobCounter++;
        }
      }


      // Remove the not active blobs
      for(let i = blobs.length - 1; i >=0; i--){
        if(blobs[i].getTimeLeft() < 0){
          removeRecognitionAni(blobs[i].id);
          if(blobs[i].smartBox != null && blobs[i].smartBox != undefined){
            removeSmartBox(blobs[i].smartBox.id);
          }
          blobs.splice(i, 1);
        }
      }
  }



//  Indicate the smartBoxes
     for (let i = 0; i < blobs.length; i++) {

       if(blobs[i].objectId !== "" && blobs[i].objectId != null){

         var aspectWidth = document.getElementById('video').offsetWidth / 320;
         var aspectHeight =  document.getElementById('video').offsetHeight / 240;
         var x = blobs[i].getCenter()[0]*aspectWidth-10;
         var y = blobs[i].getCenter()[1]*aspectHeight-10;



              if(distSq(blobs[i].x, blobs[i].y, x, y) > 0){
                // Move the button to the blobs

                blobs[i].x = x;
                blobs[i].y = y;

                blobs[i].smartBox.display(x,y);
              }

        }
      }

var sBoxCount = 0;
  for(var i =0; i <blobs.length; i++){

      if(blobs[i].smartBox != null && blobs[i].smartBox != undefined){
        sBoxCount++;
      }

  }

if(sBoxCount > 0 && document.getElementById("scanningSymbol").style.opacity == 1){

  anime({
    targets: "#scanningSymbol",
    easing: 'easeOutQuad',
    opacity: 0,
    duration:400,
    complete: function(anim) {
  document.getElementById("scanningSymbol").style.display = "none";
    }
  });

}else if(sBoxCount==0  && document.getElementById("scanningSymbol").style.opacity == 0){
  document.getElementById("scanningSymbol").style.display = "flex";
  anime({
    targets: "#scanningSymbol",
    easing: 'easeOutQuad',
    opacity:1,
    duration:400,
      complete: function(anim) {

      }
  });
}


drawAutomationLines();

  //Get FPS
  window.requestAnimationFrame(() => {
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
    times.push(now);
    fps = times.length;
    document.getElementById("fps").innerHTML= fps + "  b:" + blobs.length;
   refreshLoop();
  });
}




window.onload = function() { // same as window.addEventListener('load', (event) => {
  var video = document.getElementById('video');
  var w = window.innerWidth;
  var h = window.innerHeight;

  var offsetW = w /2 - video.offsetWidth/ 2 ;
  video.style.left = offsetW + "px";

  refreshLoop();
  setVideoInMiddle();
 };



function distSq3D(x1,y1,z1,x2,y2,z2){
  return (x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1) + (z2 - z1)*(z2 - z1);
}


function indexToCoord(c){
  var videoWidth = 320;
   var y = Math.floor(Math.floor(c / 4) / videoWidth);
   var x = Math.floor(c / 4) % videoWidth;

return [x, y];
}

function millis(){
  return (new Date()).getTime() -startTime ;
}



function mapMinMax(value,oldMin,oldMax,newMin, newMax) {
  return  (newMax-newMin)*(value-oldMin)/(oldMax-oldMin)+newMin;
}

//Converts to color HSB object (code from here http://www.csgnetwork.com/csgcolorsel4.html with some improvements)
function rgb2hsb(r, g, b)
{
 r /= 255; g /= 255; b /= 255; // Scale to unity.
 var minVal = Math.min(r, g, b),
 maxVal = Math.max(r, g, b),
 delta = maxVal - minVal,
 HSB = {hue:0, sat:0, bri:maxVal},
 del_R, del_G, del_B;

 if( delta !== 0 )
 {
     HSB.sat = delta / maxVal;
     del_R = (((maxVal - r) / 6) + (delta / 2)) / delta;
     del_G = (((maxVal - g) / 6) + (delta / 2)) / delta;
     del_B = (((maxVal - b) / 6) + (delta / 2)) / delta;

     if (r === maxVal) {HSB.hue = del_B - del_G;}
     else if (g === maxVal) {HSB.hue = (1 / 3) + del_R - del_B;}
     else if (b === maxVal) {HSB.hue = (2 / 3) + del_G - del_R;}

     if (HSB.hue < 0) {HSB.hue += 1;}
     if (HSB.hue > 1) {HSB.hue -= 1;}
 }

 HSB.hue *= 360;
 HSB.sat *= 100;
 HSB.bri *= 100;

 return HSB;
}


function drawAutomationLines(){
  var cl = document.getElementById("smartLines");
  var ctxl = cl.getContext("2d");
   ctxl.clearRect(0, 0, cl.width, cl.height);

if(lookAutomations) {
  for (let i = 0; i < blobs.length; i++) {
        for(let j = 0; j < automation.length; j++){

          if(blobs[i].objectId.id != undefined ){

            if(blobs[i].objectId.id == automation[j].triggerDevices){


              var posE = getSmartBoxPosition(automation[j].executedDevices);
              if(posE != false){
              ctxl.beginPath();
              ctxl.lineWidth = 3;
              ctxl.lineJoin = "round";

              //Making adjustments
              var x1 = blobs[i].x-5+77;
              var y1 = blobs[i].y+60;

              var x2 = posE[0]-60+33;
              var y2 = posE[1]+30;

               var offset = 0;
                var headlen = 25; // length of head in pixels
                var dx = x2 - x1; //distance in X axis
                var dy = y2 - y1; // distance in Y axis
                var angle = Math.atan2(dy, dx); // Finding the angle

                //Creating offset
                var startY = offset * Math.sin(angle);
                var startX = offset * Math.cos(angle);

                ctxl.moveTo(x1 + startX*1.2, y1 + startY*1.2);
                x2= x2- startX;
                y2= y2- startY;
                ctxl.lineTo(x2, y2);
                ctxl.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6));
                ctxl.moveTo(x2, y2);
                ctxl.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6));

                ctxl.strokeStyle = "#21cad5";
                ctxl.stroke();

                showAutomationOnSmartBoxes(automation[j]);
              }

            }
          }

        }
   }
}

}



function showAutomationOnSmartBoxes(data){
  for (let i = 0; i < blobs.length; i++) {
        if(blobs[i].objectId.id != undefined ){
            if(blobs[i].objectId.id == data.triggerDevices){
              blobs[i].smartBox.pushAutomation(true, data.triggerTaskName);
            }
            if(blobs[i].objectId.id == data.executedDevices){
              blobs[i].smartBox.pushAutomation(false, data.executedTaskName);
            }
        }
  }
}


function sendTime(){
triggerMillis = millis();
}


function setVideoInMiddle(){
  var video = document.getElementById('video');
  var w = window.innerWidth;0
  var h = window.innerHeight;
  var offsetW = 0;
  var videoOffsetWidth = 0;
  if(video.offsetWidth != 0){
    videoOffsetWidth = video.offsetWidth;
  }

  if(w > videoOffsetWidth){
   offsetW = w /2 - videoOffsetWidth/ 2 ;
 }else{
   offsetW = 0 - (videoOffsetWidth/ 2 - w /2);
 }

  video.style.left = offsetW + "px";
  setCanvasInMiddle(videoOffsetWidth);
}


function getSmartBoxPosition(id){
  var pos =[-1,-1];
  for (let i = 0; i < blobs.length; i++) {
        if(blobs[i].objectId.id != undefined ){
            if(blobs[i].objectId.id == id){
              pos[0] = blobs[i].x;
              pos[1] = blobs[i].y;
            }
        }
  }
  if(pos[0] != -1){
    return pos;
  }else{
    return false;
  }
}

function setCanvasInMiddle(v){
  var video = document.getElementById('video');
  var c = document.getElementById('smartLines');
  c.width  =  v;
  c.height = video.offsetHeight;
  c.style.left = video.style.left;
}




window.onresize = function(event) {
  setVideoInMiddle();
};


function removePopUpAutomation(){
var pop = document.getElementById("popup_automation");
var layer = document.getElementById("popUpLayer");
anime({
  targets: pop, layer,
  easing: 'easeOutQuad',
  opacity: 0,
  duration:600,
      complete: function(anim) {
        pop.style.display="none";
        layer.style.display="none";
      }
});
blurTheBackground();
}


function showAutomationBox(){
  var pop = document.getElementById("popup_automation");
  var layer = document.getElementById("popUpLayer");
  layer.style.display="flex";
  pop.style.display="block";
blurTheBackground();
  anime({
    targets: pop, layer,
    easing: 'easeOutQuad',
    opacity: 1,
    duration:600,

  });

}

function showAutomationInAR(){
  lookAutomations = true;
  var layer = document.getElementById("atmosphereLayer");
  layer.style.display = "none";
  document.getElementById("popup_automation").style.display = "none";

  document.getElementById("popup_automation_example").style.display = "block";
  document.getElementById("popUpLayer").style.display = "block";

  blurTheBackground();
}

function hideAutomationInAR(){
  lookAutomations = false;
  var layer = document.getElementById("atmosphereLayer");
  layer.style.display = "block";

    document.getElementById("popup_automation_example").style.display = "block";
    document.getElementById("popUpLayer").style.display = "none";


    if(document.getElementById('sb_'+automation[0].triggerDevices) != null)  document.getElementById('sb_'+automation[0].triggerDevices).classList.toggle("automationActive");
    if(document.getElementById('sb_'+automation[0].executedDevices) != null)  document.getElementById('sb_'+automation[0].executedDevices).classList.toggle("automationActive");

}


function blurTheBackground(){
document.getElementById("smartLayer").classList.toggle("blur");
document.getElementById("atmosphereLayer").classList.toggle("blur");
document.getElementById("video").classList.toggle("blur");
document.getElementById("popUpLayer").classList.toggle("darker");

}
