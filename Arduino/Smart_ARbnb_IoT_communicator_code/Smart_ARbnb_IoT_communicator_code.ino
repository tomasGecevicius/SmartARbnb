// Smart ARbnb IoT communicator code.
// Made by Tomas Gecevičiuc  https://gecevicius.lt

//Some nice parts of information how to connect to MQTT is found from here:
//https://techtutorialsx.com/2017/04/09/esp8266-connecting-to-mqtt-broker/


#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>

WiFiClient espClient;
PubSubClient client(espClient);

//Libraries
#include "FastLED.h"


//LED configuration
FASTLED_USING_NAMESPACE
#define DATA_PIN    27
#define LED_TYPE    WS2812B
#define COLOR_ORDER GRB
#define NUM_LEDS    1
CRGB leds[NUM_LEDS+1];
#define BRIGHTNESS          150
#define FRAMES_PER_SECOND  120
int maxBrightness = BRIGHTNESS;

//WiFi credentials
// Replace the next variables with your SSID/Password combination
const char* ssid = "*****";
const char* password = "******";

//MQTT credentials
// Replace the next variables with your Mqtt Username/Password combination
const char* mqttUser = "TomasMqtt";
const char* mqttPassword = "mqtt12345";

boolean WIFI_ON = true;

// Add your MQTT Broker IP address, example:
const char* mqtt_server = "192.168.100.127";

// Variables of getting the MQTT messages
char msg[50];
int value = 0;

int red = 25;
int green = 25;
int blue = 255;
boolean executed = false;
boolean showingLeds = false;
long triggerMillis = 0;

long lastMsg = 10000; // Millisecond of the last got message time
int Duration = 6000; // Duration of blinking



int ID = 212; // The number of communicated ID
int MODE = 0; // 0 - ID blinking, 1 - Feedforward, 2 - Error/issue, 3 - Notification 

void setup() {
  Serial.begin(115200);
  Serial.println("Starting the IoT communicator");
  
  initializeLeds();

// Connect to Wifi and MQTT
  if(WIFI_ON){
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
  }

}

void loop() {

//Check if the WiFi is still active 
if(WIFI_ON){
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
}

if(millis()-lastMsg <= Duration){
  
   //Fading up the LEDs, when the first ping from web application is received 
  if(!showingLeds && (millis()-lastMsg) <=  1000){
  int b = map((millis()-lastMsg),0,1000,0,200);
  LedSet(0,0,b);
  }else{
   
  //Show corresponding LED pattern based on the current MODE 
    showingLeds = true;
    if(MODE == 0) showID();
    else if(MODE == ID) LedSet(0,0,200);  //Stop blinkink when the IoT communicator is scanned.
    else if(MODE == 1) blinkTimer(); //Feedforward
    else if(MODE == 2) ErrorSOS();  //Error
    else if(MODE == 3) pulseSlow(); //Notification
  }

}else{
//If the IoT communicator do not get ping message from the Web application, turn off the LEDs
LedSet(0,0,0);
showingLeds = false;
}

}



//Blink the ID pattern
// !IMPORTANT - currently the ID communication is made manually, I will create the function that will show it based on ID number later.
void showID(){
  
int a = 100; //1
int b = 100; //2
int c = 200; //3
int d = 200; //4
int ending = 400;

int codeDuration = b + a + b + ending; //212
int msgLenght = 4;

   if((millis()-triggerMillis) % (codeDuration) < b){
   LedSet(0,220,50); //cyan     2 4
  }else  if((millis()-triggerMillis) % (codeDuration) < b+a){
   LedSet(0,0,200); //blue     1 3 
  }else  if((millis()-triggerMillis) % (codeDuration) < b+a+b){
    LedSet(0,220,50); //cyan     2 4
  }else{
   LedSet(0,0,200); //blue     1 3 
  }
}
