// Parts of code are taken from the Example code
// https://github.com/home-assistant/home-assistant-js-websocket
// and from https://glitch.com/edit/#!/hass-auth-demo

var Con;
var DeviceDatabase = {};

function renderEntities(connection, entities) {
  Con = connection;

  console.log(entities);
  document.getElementById('loginPart').remove();
  document.getElementById("AR_container").style.display = "block";

  Object.keys(entities).sort().forEach(function (entId) {
  DeviceDatabase[entId] = {};


  if (['light'].indexOf(entId.split('.', 1)[0]) !== -1) {

    DeviceDatabase[entId]['name'] = entities[entId].attributes.friendly_name;
    DeviceDatabase[entId]['type'] = "light";
    DeviceDatabase[entId]['state'] = entities[entId].state;

    if(entities[entId].attributes.hasOwnProperty('rgb_color')){
    DeviceDatabase[entId]['hue'] = "true";
    }


  }else if( (['media_player'].indexOf(entId.split('.', 1)[0]) !== -1) ){
    DeviceDatabase[entId]['name'] = entities[entId].attributes.friendly_name;
    DeviceDatabase[entId]['type'] = "Music";
    DeviceDatabase[entId]['state'] = entities[entId].state;
  }
  });
}

function useAuth(auth) {
  return HAWS.createConnection({ auth: auth })
    .then(function(connection) {
      console.log("UseAuth -> createConnection");

      history.replaceState(null, null, "/");
      HAWS.subscribeEntities(connection, function(entities) {
        console.log(entities);
        renderEntities(connection, entities)
      });
    });
}

function errorAuth(err) {
  if (err === HAWS.ERR_HASS_HOST_REQUIRED) {
    document.getElementById('ask-connect').style.display = 'block';
  } else {
    var error = document.createElement('h1');
    error.innerText = "ERROR: " + err;
    document.body.appendChild(error);
    console.log(error);
  }
}


function init() {
  document.getElementById('connect').onsubmit = function(ev) {
    ev.preventDefault();
    var host = document.getElementById('host').value;
    var options = { hassUrl: host };

    if (host.substr(0, 6) == 'http:') {
      options.clientId = "http://" + location.host ;
      options.redirectUrl = "http://" + location.host;
    }

    HAWS.getAuth(options).then(useAuth, errorAuth);
  }

  HAWS.getAuth().then(useAuth, errorAuth);
}

init();

function SendPing(){
console.log("Sending the ping");
    HAWS.callService(Con, 'mqtt', 'publish', { topic: "homeassistant/iot", payload:"-1", qos: 2, retain: true });
}


function SendCommand(){
    HAWS.callService(Con, 'homeassistant', 'toggle', { entity_id: "light.hue_white_lamp_1" });
}
