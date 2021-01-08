
//Atmosphere selection list
let atmosphereDatabase = [
{
  id:1,
  name:"Turn Off",
  automationText:"Turn off all the devices in this room",
  style:"turnOffStyle",
  entity_id:"automation.turn_off_all_lights"
},
{
  id:2,
  name:"Basic",
  entity_id:"automation.basic_one",
  automation:[ {
            icon:"lampIcon",
            value:"80%"
             },{
            icon:"playMainIcon_off"
            }
           ]
}, {
  id:3,
  name:"Movie Night",
  entity_id:"automation.dim_all_the_lights_and_turn_off_music",
  automation:[ {
          icon:"lampIcon",
          value:"20%"
        },{
          icon:"tv",
          extraImage:"netflix"
        },{
          icon:"thermostatIconSmall",
          value:"19°C"
        }
      ]
},
{
  id:4,
  name:"Dinner time",
  entity_id:"automation.dinner_time",
  automation:[ {
          icon:"lampIcon",
          value:"80%"
        },{
          icon:"playMainIcon",
          extraImage:"dinner"
        },{
          icon:"thermostatIconSmall",
          value:"19°C"
        }
      ]
},
{
  id:5,
  name:"Romantic",
  entity_id:"automation.romantic_time",
  automation:[ {
    icon:"lampIcon",
    value:"40%"
  },{
    icon:"lightstripIcon",
    extraImage:"red"
  },{
    icon:"playMainIcon",
    extraImage:"romantic"
  },{
    icon:"thermostatIconSmall",
    value:"23°C"
  }
]
},
{
  id:6,
  name:"Party",
  entity_id:"automation.party_mode",
  automation:[ {
    icon:"lampIcon",
    value:"60%"
  },{
    icon:"lightstripIcon",
    extraImage:"colorloop"
  },{
    icon:"playMainIcon",
    extraImage:"party"
  },{
    icon:"thermostatIconSmall",
    value:"23°C"
  }
]
}

];

setupAtmospheres();


//Create all atmospheres scenes inside the carousel based on the atmosphereDatabase
function setupAtmospheres(){

    var container =   document.getElementById("atmosphereLayer");

    //For every scene, create an carousel tab
    for(var i = 0; i < atmosphereDatabase.length; i++){
      var mood = document.createElement("div");
      mood.setAttribute('id', 'sb_'+atmosphereDatabase[i].id);
      mood.setAttribute('class', 'gallery-cell moodBox');
      container.appendChild(mood);

      var name = document.createElement("p");
      name.setAttribute('class', 'moodName');
      name.setAttribute('id', 'moodName_'+i);
      name.innerHTML =    atmosphereDatabase[i].name;
      mood.appendChild(name);

    //If automation exists, create the visualization
    if(atmosphereDatabase[i].automation !=null && atmosphereDatabase[i].automation !=undefined){
    console.log("Creating Automation box");
    createAutomationBox(i);
    }else if(atmosphereDatabase[i].automationText !=null && atmosphereDatabase[i].automationText !=undefined){
    //Create the explanationary tab
      var text = document.createElement("p");
      text.setAttribute('class', 'AutomationExplanationText');
      text.innerHTML= atmosphereDatabase[i].automationText;
      mood.appendChild(text);
    }

    var button = document.createElement("button");
    button.setAttribute('id', 'button_'+atmosphereDatabase[i].id);
    button.i = i;
    console.log("i = ", i , button.i);
    button.setAttribute('class', 'onboardingButton moodApplyButton');

    //Set button to trigger the scene in Home Assistant
    button.onclick = function() {
    var result = this.i;
    HAWS.callService(Con, 'automation', 'trigger', { entity_id:  atmosphereDatabase[result].entity_id });
      console.log("Sending the message " + this.i, atmosphereDatabase[result].entity_id);
    };
    button.innerHTML = "Apply";
    mood.appendChild(button);


  }// For function END

    //Set up the carousel
    var elem = document.querySelector('.gallery');
    var flkty = new Flickity( elem, {
        prevNextButtons: false,
        pageDots: false,
        initialIndex: 2,
        on: {
        ready: function() {
          console.log('Flickity ready');
        },
        select: function(index) {
          console.log('Selected ', index);
        }
      }
    });

}



//Create a image list of the automations that is going to happen in this scene
function createAutomationBox(index){

  var container =   document.getElementById('sb_'+atmosphereDatabase[index].id);

//Create the main DIV box
  var automationBox = document.createElement("div");
  automationBox.setAttribute('id', 'moodAutomationBox');
  automationBox.setAttribute('class', 'moodAutomationBox');
  container.appendChild(automationBox);

// For every automation create an image and add additional elements
  for(var i = 0; i< atmosphereDatabase[index].automation.length; i++){
    var icon = document.createElement("img");
    icon.src="img/"+atmosphereDatabase[index].automation[i].icon+".png";
    icon.setAttribute('class', 'AutomationIcon');
    automationBox.appendChild(icon);

//Add text, for example, light brightness percentage
    if(atmosphereDatabase[index].automation[i].value != null && atmosphereDatabase[index].automation[i].value != undefined){
      var text = document.createElement("p");
      text.setAttribute('class', 'AutomationText');
      text.innerHTML= atmosphereDatabase[index].automation[i].value;
      automationBox.appendChild(text);
    }

//Add additional image, for example, the music playlist cover
    if(atmosphereDatabase[index].automation[i].extraImage != null && atmosphereDatabase[index].automation[i].extraImage != undefined){
      var extra = document.createElement("img");
      extra.setAttribute('class', 'AutomationIcon AutomationExtra');
      extra.src="img/"+atmosphereDatabase[index].automation[i].extraImage+".png";
      automationBox.appendChild(extra);
    }

//If the automation is not the last one, create a separation image
    if(i != atmosphereDatabase[index].automation.length-1){
    var separation = document.createElement("img");
    separation.src="img/separation-01.png";
    separation.setAttribute('class', 'AutomationSeparation');
    automationBox.appendChild(separation);
    }
  }//For

}
