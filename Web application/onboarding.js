
var currentScreen = 0;
var onboardingData ={
  "Heading":[ "Experience the simplest smart home interface", "Tool requires to access your camera", "How to use it? <br> 1. Point the camera", "2. Control the device", "Change the atmosphere"],
  "Text":[ "Website allows to find and control all smart devices in this house", "But first, please allow to use the camera on the pop up. ", "Find the blinking IoT indicators through your mobile phone camera", "Toggle the device by tapping the icon, center the icon on screen to expand it and go to the device menu to access additional settings", "Select the scene which would make the perfect atmosphere for your stay"],
  "Image":[ "onboarding1.png", "onboarding2.png", "Gif 1_small.gif", "Gif 2_small.gif","Gif 3_small.gif"],
  "ButtonText":[ "Continue", "Continue", "Continue", "Continue", "Start" ]
}

function NextScreen(){
if(currentScreen < 4){
currentScreen++;

anime({
  targets: '#onboardingContent',
  easing: 'easeInQuad',
  duration:1000,
  opacity:0,
  complete:function(anim){
          document.getElementById('onboardingHeader').innerHTML = onboardingData.Heading[currentScreen];
          document.getElementById('onboardingText').innerHTML = onboardingData.Text[currentScreen];
          var imageElement = document.getElementById('onboardingImage');
          imageElement.src = 'img/' + onboardingData.Image[currentScreen];

          document.getElementById('onboardingButton').innerHTML = onboardingData.ButtonText[currentScreen];

          if(currentScreen==1){ //Ask to access the camera
              RequestCamera();
              document.getElementById('onboardingButton').classList.add("inactive");
              console.log("inactive added");
          }


          imageElement.onload = function(){
            anime({
              targets: '#onboardingContent',
              easing: 'easeInQuad',
              duration:1000,
              opacity:1
            });

          };


  }
});
} // if(currentScreen < 3)
else{ //LAST CLICK
  anime({
    targets: '#mainOnboarding',
    easing: 'easeInQuad',
    duration:1000,
    opacity:0,
    complete:function(anim){
            startBlinkies();
            document.getElementById('mainOnboarding').remove();
    }
  });
}

}// END OF NextScreen()





function RequestCamera(){
  // Get access to the camera!
  if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) == true) {
      navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: {
            exact: "environment"
          },
           noiseSuppression:false,
           autoGainControl: false

        }
       }).then(function(stream) {
          videoCamera.srcObject = stream;
          videoCamera.play();

          console.log("Video is loaded stream");

      }).then(() =>{
        console.log("Video is loaded");
        document.getElementById('onboardingButton').classList.remove("inactive");
        setTimeout(setVideoInMiddle, 100);

      } );
  }else{
    navigator.mediaDevices.getUserMedia({
      video: {
        width:720,
      }
     }).then(function(stream) {
        videoCamera.srcObject = stream;
        videoCamera.play();
        console.log("Video is loaded3");
       setVideoInMiddle();
    });
  }
}


function startBlinkies(){
    SendPing();
    setInterval( SendPing, 3000);
}
