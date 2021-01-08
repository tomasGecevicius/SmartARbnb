// Blobis class
class Blobis {


  constructor(c, h) {

    var coord = indexToCoord(c);
    this.id = 0;
    this.x = coord[0];
    this.y = coord[1];
    this.minX = this.x;
    this.minY = this.y;
    this.maxX = this.x;
    this.maxY = this.y;
    this.blobThreshold = 20;
    this.taken = false;
    this.time = millis();
    this.turnedTime = millis();
    this.pattern = [];
    this.patternColor = [];
    this.objectId = "";
    this.pixels = [];
    this.hue = h;
    this.msg = ["0","0"];
  }

  setCoordinates(x,y) {
    this.x = x ;
    this.y = y;
  }


  isMouseOver() {
    return false;
  }

//Add the pixel to the blob
 add(c, h){
    var coord = indexToCoord(c); //Transform the index number to X,Y coordinates

    this.minX = min(this.minX, coord[0]);
    this.minY = min(this.minY, coord[1]);
    this.maxX = max(this.maxX, coord[0]);
    this.maxY = max(this.maxY, coord[1]);

    this.hue = h;
  }


//Function to check if the pixel is near this blob
isNear(c){
var coord = indexToCoord(c);
var cx = max(min(coord[0],this.maxX), this.minX);
var cy = max(min(coord[1],this.maxY), this.minY);

let d = distSq(cx,cy, coord[0], coord[1]);

    if( d< this.blobThreshold*this.blobThreshold){
      return true;
    }else{
      return false;
    }
}

//Get the center position of the blob
getCenter(){
  return [(this.minX + this.maxX)/2, (this.minY + this.maxY)/2];
}

//Get the Hue color
getHue(){
  return this.hue;
}


//Copy the new found blob to the corresponding blob
become(b){
this.minX = b.minX;
this.minY = b.minY;
this.maxX = b.maxX;
this.maxY = b.maxY;
this.taken = true;


var hueCol ="0";
if(b.hue > 205 && b.hue < 250){
     hueCol = "c";  // Found cyan color
}else if(b.hue > 150 && b.hue < 195){
    hueCol = "b"; // Found blue color
}
//If the hue is found add the color to the recorded pattern
if(hueCol !== "0"){
  //If the current hue is different then the new one, add the new color to the recorder pattern
  if(this.hue !== hueCol){
    this.addingToPattern(hueCol);
    this.hue = hueCol;
  }
}
this.time = millis();
}



addingToPattern(h){

        //Check how much time passed till the new hue appeared
        var timePassed = millis() - this.turnedTime;

    if(timePassed > 380 ){ // If the duration is higher than the END symbol
              //Analyze the pattern and get the read ID
              let gotId = analyzePattern(this.pattern, this.patternColor);
              //Check if the read ID is in the Database, if yes, get all the info about the device from PseudoDatabase
              let objId = checkTheDatabaseForId(gotId);
              if(objId !== "" && objId != null){
              //      console.log("object0Id =", objId );
              this.objectId = objId;

              if(this.smartBox == null){
                var deviceData = getDeviceData(this.objectId.entity_id, objId); // Get all the data from the HomeAssistant database
                this.smartBox = new SmartBox(deviceData);  // Create the SmartBox
                //Set the IoT communicator status as "scanned"
                connectToDevice(gotId);
              }
              //Device is found, clear all the collected light pattern
              this.pattern = [];
              this.patternColor = [];
              this.turnedTime = millis();
              }else{
              // No device is found, delete all the data, try again
              this.pattern = [];
              this.patternColor = [];
              this.turnedTime = millis();
              }
    }else{
      //Push a duration and hue to the recorded light pattern
      this.patternColor.push(h);
      this.pattern.push(timePassed);
      this.turnedTime = millis();
    }


}


getTimeLeft(){
  return disappearTime - (millis()-this.time);
}

//Show the rectangule around the blob
getRect(){
  return([this.minX, this.minY, this.maxX-this.minX, this.maxY-this.minY]);
}

}// END OF CLASS --------------------------------------------------------------------------------------------------------------------------------------


//Get the squared distance
function distSq(x1, y1, x2, y2){
  return (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1);
}


//Analyze the blobs light pattern
function analyzePattern(on_ptrn, color_ptrn){

 let answer = "";
  for(let i = 0; i < on_ptrn.length; i++){


    if(fitsValue(on_ptrn[i], 100)){
      if(color_ptrn[i] === "b") answer = answer + "1";
      if(color_ptrn[i] === "c") answer = answer + "2";
    }else if(fitsValue(on_ptrn[i], 200)){
      if(color_ptrn[i] === "b") answer = answer + "3";
      if(color_ptrn[i] === "c") answer = answer + "4";

    }else if(fitsValue(on_ptrn[i], 300)){
      if(color_ptrn[i] === "b") answer = answer + "5";
      if(color_ptrn[i] === "c") answer = answer + "6";

    }

  }

//WRITE THE ID TO SCREEN
document.getElementById("consol").innerHTML= answer;


  return answer;
}

//Checks if the value is around the threashold
function fitsValue(value, threshold){
  let fits = false;
  let timeThreshold = 45;
  if(value >= threshold-timeThreshold && value <= threshold + timeThreshold ) {
    fits = true;
  }
  return fits;
}


//Checks if the ID is found in the pseudodatabase
function checkTheDatabaseForId(gotId){
  for(let i = 0; i < pseudoDatabase.length; i++){
    if(gotId === pseudoDatabase[i].id){
      return pseudoDatabase[i];
    }
  }
  return "";
}



//Remove SmartBox when it is not needed
function removeSmartBox(id){
  console.log("Removing SmartBox ", id);
  var element = document.getElementById('sb_'+id);


//Fading down animation
  if(element != null){
  anime({
    targets: element,
    easing: 'easeOutQuad',
    opacity:0,
    duration:500,
    complete: function(anim) {
      element.remove();
      console.log("Removing Element");
    }
  });
  }

//Disconnect from the IoT communicator
disconnectFromDevice(id);
}


function min(a , b){
  if(a > b) return b;
  else return a;
}

function max(a,b){
  if(a > b) return a;
  else return b;
}


function getDeviceData(id, innerDatabase){

 for(var i = 0; i < Object.keys(DeviceDatabase).length; i++){
//   id="bad";
   if( Object.keys(DeviceDatabase)[i]===id){
     var data = innerDatabase;
     var d = DeviceDatabase[id];
     data.state = d.state;
     console.log(data);
     return data;
   }
 }
//If there is no device in real database, give back the pseudo one
return innerDatabase;
}


function connectToDevice(ptrn){
HAWS.callService(Con, 'mqtt', 'publish', { topic: "homeassistant/iot", payload:ptrn, qos: 2, retain: true });
}

function disconnectFromDevice(ptrn){
  var id = "-" + ptrn;
  HAWS.callService(Con, 'mqtt', 'publish', { topic: "homeassistant/iot", payload:id, qos: 2, retain: true });
}
