  void initializeLeds(){
   Serial.print("Initializing LEDS");
   FastLED.addLeds<LED_TYPE,DATA_PIN,COLOR_ORDER>(leds, 0, NUM_LEDS).setCorrection(TypicalLEDStrip);

    // set master brightness control
    FastLED.setBrightness(BRIGHTNESS);
    FastLED.show();
    Serial.print("LEDS DONE");
   
 }

//Function setting all LED to the needed color
void LedSet(byte r, byte g, byte b) {

  for (int i = 0; i < NUM_LEDS; i++ ) {
    leds[i] = CRGB( r, g, b);
  }
  FastLED.show();
}


//Simple blinking pattern that after 6 seconds sends command to Home Assistant
void blinking(){
  if(millis() - triggerMillis <= 6000){
   
  if(millis() % 1000 >500){
    LedSet(red,green,blue);
 }else{
   LedSet(0,0,0); 
 }
}else{
   if(!executed) executeLight();  // Sends a command to Home Assistant
}

}


// Feedforward light pattern
void blinkTimer(){
    if(millis() - triggerMillis <= 10000){
   
        if(millis() - triggerMillis < 3000){
          
          if(millis() % 2000 >1000){
          LedSet(0,0,0);
           }else{
         LedSet(red,green,blue); 
       }
 
    }else if(millis() - triggerMillis < 6000){
          
          if(millis() % 1000 >500){
          LedSet(0,0,0);
           }else{
         LedSet(red,green,blue); 
       }
 
    }else if(millis() - triggerMillis < 7500){
          
          if(millis() % 500 >250){
          LedSet(0,0,0);
           }else{
         LedSet(red,green,blue); 
       }
 
    }else if(millis() - triggerMillis < 10000){
          
          if(millis() % 250 >125){
          LedSet(0,0,0);
           }else{
         LedSet(red,green,blue); 
       }
 
    }

  
}else{
   if(!executed) executeLight(); 
}
}


// Notification light pattern
void pulseSlow(){
  if(millis() - triggerMillis <= 6000){
   
  if(millis() % 3000 <= 1500){
    int value = (int) map(millis() % 3000, 0 , 1500, 0,255);
    LedSet(red/255*value,green/255*value,blue/255*value); 
 }else{
    int value = (int) map(millis() % 3000, 1500 , 3000, 255,0);
    LedSet(red/255*value,green/255*value,blue/255*value); 
  
 }
  
}else{
   if(!executed) executeLight(); 
}

}


// Error light pattern
void ErrorSOS(){
   long Time = (millis() - triggerMillis) % 6000;
   
        if(Time < 1000){
          
          if(Time % 333 >166){
          LedSet(0,0,0);
           }else{
         LedSet(255,0,0);
       }
 
    }else if(Time < 4000){
          
          if(Time % 1000 >800){
         LedSet(0,0,0);
           }else{
         LedSet(255,0,0);
       }
 
    }else if(Time < 5000){
          
          if(Time % 333 >166){
          LedSet(0,0,0);
           }else{
         LedSet(255,0,0);
       }
 
    }else if(Time < 6000){
          LedSet(0,0,0);
    }
}
