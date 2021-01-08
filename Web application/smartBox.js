var Duration = 3000;

class SmartBox {

  constructor(deviceData) {
    this.id = deviceData.id;

    this.collapsed = true;
    this.automationTag = false;
    this.automationStartTime = millis();
    this.typeData = deviceData.type;
    this.entity_id = deviceData.entity_id;

    createBoxHTML(deviceData, this.id, this.entity_id);



    anime({
      targets: '#sb_main_button_'+this.id,
      easing: 'easeInQuad',
      direction:'reverse',
      height:0,
      width: 0,
      duration:400,
      complete:function(anim){
      }
    });
    anime({
      targets: '#icon_'+this.id,
      easing: 'easeInQuad',
      direction:'reverse',
       opacity:0,
      duration:800
    });
  }




  display(x,y){
    var id = this.id;
  var elementExists = document.getElementById('sb_'+id);

    if( elementExists != null){
        var videoLeft = document.getElementById('video').style.left;
        var xx =  parseInt(videoLeft) + (x - elementExists.clientWidth*1);
        var yy = y - elementExists.clientHeight*1.5;
        document.getElementById('sb_'+this.id).style.transform = 'translateY('+(yy)+'px)';
        document.getElementById('sb_'+this.id).style.transform += 'translateX('+(xx)+'px)';

        this.checkIfMiddle(xx+elementExists.clientWidth,yy);

        this.checkIfItShouldBeAutomated();
    }


    if(this.automationTag && (millis()- this.automationStartTime) > 200){
      var element = document.getElementById('automationAction_'+id);
      anime({
        targets: element,
        easing: 'easeOutQuad',
        opacity:0,
        duration:500,
        complete: function(anim) {
          console.log('automationAction_'+id);
          if(element != null) element.style.display = "none";
          if(document.getElementById('sb_'+this.id) != null)  document.getElementById('sb_'+this.id).classList.toggle("automationActive");
        }
      });
      this.automationTag = false;
    }
  }

  checkIfMiddle(x,y){

    if(x > screen.width*0.35 && x < screen.width*0.65){

      if(this.collapsed == true){ //Expand elements

      anime({
        targets: "#sb_menu_"+this.id,
        easing: 'easeOutQuad',
        opacity:1,
        duration:400
      });

          document.getElementById('sb_textbox_'+this.id).style.display="flex";
          document.getElementById('sb_textbox_'+this.id).style.opacity="1";
        anime({
          targets: '#sb_textbox_'+this.id,
          easing: 'easeOutQuad',
          direction: 'reverse',
          opacity:0,
          duration:400
        });

        anime({
          targets: '#sb_'+this.id,
          easing: 'easeOutQuad',
          height:'130',
          duration:400
        });


    }

  this.collapsed = false;
    }else{

      if(this.collapsed == false){  // Shrink everything
        console.log("Shrinking!");

        anime({
          targets: "#sb_menu_"+this.id,
          easing: 'easeOutQuad',
          opacity:0,
          duration:400
        });

              document.getElementById('sb_textbox_'+this.id).style.display="none";
              document.getElementById('sb_textbox_'+this.id).style.opacity="0";
            anime({
              targets: '#sb_textbox_'+this.id,
              easing: 'easeOutQuad',
              direction: 'reverse',
              opacity:1,
              duration:400
            });

            anime({
              targets: '#sb_'+this.id,
              easing: 'easeOutQuad',
              height:70,
              duration:400
            });


    }
  this.collapsed = true;
    }
  }

pushAutomation(isTrigger, taskName){


  //Automation box
  if(!this.automationTag){
    document.getElementById('automationAction_'+this.id).style.display = "flex";
    document.getElementById('automationAction_'+this.id).innerHTML = taskName;
    this.automationTag = true;
    this.automationStartTime = millis();

    document.getElementById('sb_'+this.id).classList.toggle("automationActive");

    anime({
      targets: '#automationAction_'+this.id,
      easing: 'easeOutQuad',
      opacity:1,
      duration:500
    });
  }else{
        this.automationStartTime = millis();
  }
}

checkIfItShouldBeAutomated(){

     if(lookAutomations){

       if(this.id == automation[0].triggerDevices || this.id == automation[0].executedDevices){
            if(document.getElementById('sb_'+this.id) != null){
                  if(!document.getElementById('sb_'+this.id).classList.contains("automationActive")){
                    document.getElementById('sb_'+this.id).classList.toggle("automationActive");
                  }
            }
       }
  }
}

}// --------------------------------- END OF SmartBox


function createBoxHTML(data, id, entId){

  var smartBx = document.createElement("div");
  smartBx.setAttribute('id', 'sb_'+id);
  smartBx.setAttribute('class', 'smartBox');
  document.getElementById("smartLayer").appendChild(smartBx);

  //Add Main icon
  if(data.type == "Music"){

    var statusIcon = document.createElement("img");
     if(data.state === "playing") statusIcon.setAttribute('src', 'img/'+data.icon+'_off.png');
     else if(data.state === "pause") statusIcon.setAttribute('src', 'img/'+data.icon+'.png');
     else{
       statusIcon.setAttribute('src', 'img/'+data.icon+'.png');
     }
     statusIcon.setAttribute('state', data.state);
     statusIcon.setAttribute('id', 'icon_'+id);
     statusIcon.setAttribute('class', 'smartBoxIcon');
     statusIcon.setAttribute('onclick', "toggleMusicButton(\'"+id+"\', \'"+entId+"\', \'"+data.icon+"\')");

     smartBx.appendChild(statusIcon);

  }else if(data.type =="Temp"){
      var tempType =  document.createElement("p");
      tempType.setAttribute('id', 'sb_temperature_'+id);
      tempType.setAttribute('class', 'temperatureText');
      tempType.innerHTML =    data.currentValue;
      smartBx.appendChild(tempType);

      var icon = document.createElement("img");
      icon.setAttribute('src', 'img/'+data.icon+".png");
      icon.setAttribute('id', 'icon_'+id);
      icon.setAttribute('class', 'smartBoxIcon');
      smartBx.appendChild(icon);
    }
  else{

  var icon = document.createElement("img");
  if(data.state === "on") icon.setAttribute('src', 'img/'+data.icon+'.png');
  else if(data.state === "off") icon.setAttribute('src', 'img/'+data.icon+'_off.png');
  else{
  icon.setAttribute('src', 'img/'+data.icon+'.png');
  }
     icon.setAttribute('state', data.state);
    icon.setAttribute('id', 'icon_'+id);
    icon.setAttribute('onclick', "toggleButton(\'"+id+"\', \'"+entId+"\', \'"+data.icon+"\')");

    icon.setAttribute('class', 'smartBoxIcon');
    smartBx.appendChild(icon);
  }

  var textBox =  document.createElement("div");
  textBox.setAttribute('id', 'sb_textbox_'+id);
  textBox.setAttribute('class', 'smartBoxTextBox');
  smartBx.appendChild(textBox);


  var textType =  document.createElement("p");
  textType.setAttribute('id', 'sb_textType_'+id);
  textType.setAttribute('class', 'smartBoxTextBoxType');
  textType.innerHTML =    data.type;
  textBox.appendChild(textType);

  var textName =  document.createElement("p");
  textName.setAttribute('id', 'sb_textName_'+id);
  textName.setAttribute('class', 'smartBoxTextBoxName');
  textName.innerHTML =    data.name;
  textBox.appendChild(textName);

//Automation box
  var automation = document.createElement("div");
  automation.setAttribute('class', 'automationAction from');
  automation.setAttribute('id', 'automationAction_'+id);
  automation.innerHTML = "Trigger";
  smartBx.appendChild(automation);




  //++++++ Menu button
    var sideMenuButton =  document.createElement("div");
    sideMenuButton.setAttribute('id', 'sb_menu_'+id);
    sideMenuButton.setAttribute('class', 'smartBoxButton smartBoxMenu');
    sideMenuButton.setAttribute('onclick','showDevicePopUp( "'+id+'" )');
    smartBx.appendChild(sideMenuButton);

  var iconMenu = document.createElement("img");
    iconMenu.setAttribute('src', 'img/menuIcon.png');
    sideMenuButton.appendChild(iconMenu);



    if(data.extras != null && data.extras != undefined){

      if(data.extras === "note"){

      //Create the Note element
      var sideExtras =  document.createElement("div");
      sideExtras.setAttribute('id', 'sb_note_'+id);
      sideExtras.setAttribute('class', 'smartBoxNotificationBox');
      smartBx.appendChild(sideExtras);

      var iconExtras = document.createElement("img");
        iconExtras.setAttribute('class', 'NotificationImage');
        iconExtras.setAttribute('src', 'img/noteIcon.png');
        sideExtras.appendChild(iconExtras);
      } // Extras - NOTE


      if(data.extras === "issue"){
      //Create the Note element
      var sideExtras =  document.createElement("div");
      sideExtras.setAttribute('id', 'sb_issue_'+id);
      sideExtras.setAttribute('class', 'smartBoxNotificationBox');
      smartBx.appendChild(sideExtras);

      var iconExtras = document.createElement("img");
        iconExtras.setAttribute('class', 'NotificationImage');
        iconExtras.setAttribute('src', 'img/errorIcon.png');
        sideExtras.appendChild(iconExtras);
      } // Extras - NOTE
}

}//createBoxHTML

function toggleMusicButton(id, entId, icon){
    console.log("Toggle music");
  if(document.getElementById('icon_'+id).state === "playing"){

    document.getElementById('icon_'+id).state = "off";
    document.getElementById('icon_'+id).src='img/'+icon+'.png';
    document.getElementById('header_icon_'+id).src='img/'+icon+'.png';
    HAWS.callService(Con, 'media_player', 'media_pause', {
        entity_id: "media_player.spotify_bembis16"
        });
  }else{

    document.getElementById('icon_'+id).state = "playing";
    document.getElementById('icon_'+id).src='img/'+icon+'_off.png';
    document.getElementById('header_icon_'+id).src='img/'+icon+'_off.png';
    HAWS.callService(Con, 'media_player', 'media_play', {
        entity_id: "media_player.spotify_bembis16"
        });
  }

}


function toggleButton(id, entId, icon){
  if(document.getElementById('icon_'+id).state === "on"){
    document.getElementById('icon_'+id).state = "off";
    document.getElementById('icon_'+id).src='img/'+icon+'_off.png'
  }else{
    document.getElementById('icon_'+id).state = "on";
    document.getElementById('icon_'+id).src='img/'+icon+'.png'
  }
 HAWS.callService(Con, 'homeassistant',  'toggle', {entity_id: entId});
}

function turnOnButton(id, entId, icon){
    document.getElementById('icon_'+id).state = "on";
    document.getElementById('icon_'+id).src='img/'+icon+'.png'
}




function getDataFromDatabase(gotId){

  for(let i = 0; i < pseudoDatabase.length; i++){
    if(gotId === pseudoDatabase[i].id){
      return pseudoDatabase[i];
    }
  }
  return "";
}


function showDevicePopUp(id){

  var data = getDataFromDatabase(id);
  console.log(data);

  var smartBx = document.createElement("div");
  smartBx.setAttribute('id', 'popup_'+id);
  document.getElementById("popUpLayer").appendChild(smartBx);

  var popUpBx = document.createElement("div");
  popUpBx.setAttribute('class', 'popUpBox');
   smartBx.appendChild(popUpBx);


// HEADER --------------------
   var popUpBxHeader = document.createElement("div");
   popUpBxHeader.setAttribute('class', 'popUpHeader');
   popUpBx.appendChild(popUpBxHeader);


   if(data.type =="Temp"){
     var tempType =  document.createElement("p");
     tempType.setAttribute('id', 'sb_temperature_header_'+id);
     tempType.setAttribute('class', 'temperatureTextHeader');
     tempType.innerHTML =    data.currentValue;
     popUpBxHeader.appendChild(tempType);

     var icon = document.createElement("img");
     icon.setAttribute('src', 'img/'+data.icon+".png");
     icon.setAttribute('id', 'icon_'+id);
     icon.setAttribute('class', 'popUpIcon');
     popUpBxHeader.appendChild(icon);
   }else if(data.type =="Music"){

     var statusIcon = document.createElement("img");
     console.log("MUUSSSSIIIIICCCC STATE ==== ", data.state);
      if(data.state === "playing") statusIcon.setAttribute('src', 'img/'+data.icon+'_off.png');
      else if(data.state === "pause") statusIcon.setAttribute('src', 'img/'+data.icon+'.png');
      else{
        statusIcon.setAttribute('src', 'img/'+data.icon+'.png');
      }
      statusIcon.setAttribute('state', data.state);
      statusIcon.setAttribute('id', 'header_icon_'+id);
      statusIcon.setAttribute('class', 'popUpIcon');
      statusIcon.setAttribute('onclick', "toggleMusicButton(\'"+id+"\', \'"+data.entity_id+"\', \'"+data.icon+"\')");

      popUpBxHeader.appendChild(statusIcon);

   }else{
     var icon = document.createElement("img");
     icon.setAttribute('id', 'icon_'+id);
     if(data.state === "on") icon.setAttribute('src', 'img/'+data.icon+'.png');
     else if(data.state === "off") icon.setAttribute('src', 'img/'+data.icon+'_off.png');
     icon.setAttribute('class', 'popUpIcon');
     popUpBxHeader.appendChild(icon);
   }

   var popUpBxHeaderTextBox = document.createElement("div");
   popUpBxHeaderTextBox.setAttribute('class', 'smartBoxTextBox');
   popUpBxHeader.appendChild(popUpBxHeaderTextBox);

   var textType =  document.createElement("p");
   textType.setAttribute('id', 'sb_textType_'+id);
   textType.setAttribute('class', 'smartBoxTextBoxType');
   textType.innerHTML = data.type;
   popUpBxHeaderTextBox.appendChild(textType);

   var textName =  document.createElement("p");
   textName.setAttribute('id', 'sb_textName_'+id);
   textName.setAttribute('class', 'smartBoxTextBoxName');
   textName.innerHTML =    data.name;
   popUpBxHeaderTextBox.appendChild(textName);

   var close = document.createElement("img");
   close.setAttribute('src', 'img/close.png');
   close.setAttribute('class', 'close');
   close.setAttribute('onclick','removePopUp( "'+id+'" )');
   popUpBxHeader.appendChild(close);


//CONTROLS ------------------
   var popUpBxControls = document.createElement("div");
   popUpBxControls.setAttribute('class', 'popUpControls');
   popUpBx.appendChild(popUpBxControls);

if(data.type =="Light" || data.type =="Hue"){
  var ctrlName =  document.createElement("p");
  ctrlName.setAttribute('class', 'controlName');
  ctrlName.innerHTML = "Brightness";
  popUpBxControls.appendChild(ctrlName);

  var input = document.createElement("input");
  input.setAttribute('id', 'range_slider_'+id);
  input.setAttribute('class', 'range brightness');
  input.setAttribute('min', '-20');
  input.setAttribute('max', '255');
  input.setAttribute('type', 'range');
  input.addEventListener('change', function () {
    var v = input.value;
    if(v < 0) v = 0;
    HAWS.callService(Con, 'homeassistant', 'turn_on', { entity_id: data.entity_id, brightness:v });
    console.log("INPUT VALUE = ", input.value, v, data.entity_id);

    turnOnButton(id, data.entId, data.icon);

    }, false);

  popUpBxControls.appendChild(input);
}
else if(data.type =="Temp"){
  var ctrlName =  document.createElement("p");
  ctrlName.setAttribute('class', 'controlName');
  ctrlName.innerHTML = "Temperature";
  popUpBxControls.appendChild(ctrlName);

  var input = document.createElement("input");
  input.setAttribute('id', 'range_slider_'+id);
  input.setAttribute('class', 'range temperature');
  input.setAttribute('min', '16');
  input.setAttribute('max', '26');
  input.setAttribute('type', 'range');
  input.addEventListener('input', function () {
    var v = input.value;
    if(v < 0) v = 0;
    console.log("INPUT VALUE = ", input.value, v);
    document.getElementById('sb_temperature_'+id).innerHTML= input.value;
    document.getElementById('sb_temperature_header_'+id).innerHTML= input.value;
    }, false);

  popUpBxControls.appendChild(input);
}
else if(data.type =="Music"){
  var ctrlName =  document.createElement("p");
  ctrlName.setAttribute('class', 'controlName');
  ctrlName.innerHTML = "Volume";
  popUpBxControls.appendChild(ctrlName);

  var input = document.createElement("input");
  input.setAttribute('id', 'range_slider_'+id);
  input.setAttribute('class', 'range volume');
  input.setAttribute('min', '-20');
  input.setAttribute('max', '100');
  input.setAttribute('type', 'range');
  input.addEventListener('change', (event) => {
    var v = event.target.value/100;
    console.log("volume set to - ", v);
   HAWS.callService(Con, 'media_player', 'volume_set', {
       entity_id: "media_player.spotify_bembis16",
       volume_level: v
       });
   });

  popUpBxControls.appendChild(input);


  var musicPlayerBox = document.createElement("div");
  musicPlayerBox.setAttribute('class', 'musicPlayerBox');
  popUpBxControls.appendChild(musicPlayerBox);

  var musicImage = document.createElement("img");
  musicImage.setAttribute('src', 'img/musicPlaceholder.png');
  musicImage.setAttribute('class', 'musicPlaceholder');
  musicPlayerBox.appendChild(musicImage);

  var musicPlayerInfo = document.createElement("div");
  musicPlayerInfo.setAttribute('class', 'musicPlayerInfo');
  musicPlayerBox.appendChild(musicPlayerInfo);

  var musicPlayerArtist =  document.createElement("p");
  musicPlayerArtist.setAttribute('id', 'mp_artist_'+id);
  musicPlayerArtist.setAttribute('class', 'musicPlayerArtist');
  musicPlayerArtist.innerHTML = "Artist";
  musicPlayerInfo.appendChild(musicPlayerArtist);

  var musicPlayerSong =  document.createElement("p");
  musicPlayerSong.setAttribute('id', 'mp_song_'+id);
  musicPlayerSong.setAttribute('class', 'musicPlayerSong');
  musicPlayerSong.innerHTML = "Song name";
  musicPlayerInfo.appendChild(musicPlayerSong);

  var musicPlayerbuttons = document.createElement("div");
  musicPlayerbuttons.setAttribute('class', 'musicPlayerbuttons');
  musicPlayerInfo.appendChild(musicPlayerbuttons);

  var spotifyIcon = document.createElement("img");
  spotifyIcon.setAttribute('src', 'img/spotify.png');
  musicPlayerbuttons.appendChild(spotifyIcon);

  var playIcon = document.createElement("img");
  playIcon.setAttribute('src', 'img/playControl.png');
  musicPlayerbuttons.appendChild(playIcon);

  var forwardIcon = document.createElement("img");
  forwardIcon.setAttribute('src', 'img/nextControlIcon.png');
  forwardIcon.addEventListener('click', (event) => {
    HAWS.callService(Con, 'media_player', 'media_next_track', {
        entity_id: "media_player.spotify_bembis16"
        });
   });
  musicPlayerbuttons.appendChild(forwardIcon);
}

if(data.type =="Hue"){
  var ctrlName =  document.createElement("p");
  ctrlName.setAttribute('class', 'controlName');
  ctrlName.innerHTML = "Hue";
  popUpBxControls.appendChild(ctrlName);

  var smartHueBx = document.createElement("div");
  smartHueBx.setAttribute('id', 'sb_colorpicker_'+id);
  smartHueBx.setAttribute('class', 'smartBoxColorPicker');
  popUpBxControls.appendChild(smartHueBx);

  var colorPicker = new iro.ColorPicker('#sb_colorpicker_'+id,{
    // Set the size of the color picker
    width: 150,
    // Set the initial color to pure red
    color: "#f00",
    layout: [
      {
        component: iro.ui.Wheel,
      }
    ]
  });

  colorPicker.on('input:end', function(color) {
 // log the current color as a HEX string d
  console.log(id + " " + color.rgb.r);
  HAWS.callService(Con, 'homeassistant', 'turn_on', { entity_id: data.entity_id, rgb_color:[color.rgb.r,color.rgb.g,color.rgb.b] });
 });


}


//EXTRAS ------------------
if(data.extras != null && data.extras != undefined){


  if(data.extras === "note"){

  //Create the Note element
  var noteBoxExtras =  document.createElement("div");
  noteBoxExtras.setAttribute('class', 'popUpBox extra Note');
  smartBx.appendChild(noteBoxExtras);

  var noteBoxExtrasHeader =  document.createElement("div");
  noteBoxExtrasHeader.setAttribute('class', 'popUpHeader');
  noteBoxExtras.appendChild(noteBoxExtrasHeader);

  var iconExtras = document.createElement("img");
    iconExtras.setAttribute('class', 'extraIcon');
    iconExtras.setAttribute('src', 'img/noteIcon.png');
    noteBoxExtrasHeader.appendChild(iconExtras);

    var extraName =  document.createElement("p");
    extraName.setAttribute('class', 'smartBoxTextBoxType');
    extraName.innerHTML = "Note";
    noteBoxExtrasHeader.appendChild(extraName);

    var noteText =  document.createElement("p");
    noteText.innerHTML = data.noteText;
    noteBoxExtras.appendChild(noteText);

  } // Extras - NOTE
  if(data.extras === "issue"){

    var popUpHorizontalContainer =  document.createElement("div");
    popUpHorizontalContainer.setAttribute('class', 'popUpHorizontalContainer');
    smartBx.appendChild(popUpHorizontalContainer);

    var issueBoxExtras =  document.createElement("div");
    issueBoxExtras.setAttribute('class', 'popUpBox extra Issue');
    popUpHorizontalContainer.appendChild(issueBoxExtras);

    var boxExtrasHeader =  document.createElement("div");
    boxExtrasHeader.setAttribute('class', 'popUpHeader');
    issueBoxExtras.appendChild(boxExtrasHeader);

    var iconExtras = document.createElement("img");
      iconExtras.setAttribute('class', 'extraIcon');
      iconExtras.setAttribute('src', 'img/errorIcon.png');
      boxExtrasHeader.appendChild(iconExtras);

      var extraName =  document.createElement("p");
      extraName.setAttribute('class', 'smartBoxTextBoxType');
      extraName.innerHTML = "Issue";
      boxExtrasHeader.appendChild(extraName);

      var noteText =  document.createElement("p");
      noteText.innerHTML = data.issueText;
      issueBoxExtras.appendChild(noteText);

      var button =  document.createElement("button");
      button.setAttribute('id', 'sb_button_'+this.id);
      // button.setAttribute('class', 'smartButton');
      button.innerHTML = "How to do it?";
      button.onclick = function() {
        alert("Sorry, now it's not available ;) ");
      };
     popUpHorizontalContainer.appendChild(button);
    } // Extras - NOTE
}

document.getElementById("popUpLayer").style.display="flex";
blurTheBackground();
}


function removePopUp(id){

var pop = document.getElementById("popup_"+id);
anime({
  targets: pop,
  easing: 'easeOutQuad',
  opacity: 0,
  duration:600,
      complete: function(anim) {
        pop.remove();
        document.getElementById("popUpLayer").style.display="none";
      }
});
blurTheBackground();
}
