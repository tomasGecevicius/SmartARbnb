//WiFi setup function
void setup_wifi() {

  delay(10);
  // We start by connecting to a WiFi network

  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi");
  long starttime = millis();
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(300);
    long time = millis();

    if (time - 5000 > starttime) {
      WiFi.begin(ssid, password);
      starttime = millis();
      Serial.println("Resetinam");
    }
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}


//Callback function that is triggered when MQTT message is received
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");

  if (strcmp(topic, "homeassistant/iot") == 0) {

    payload[length] = '\0'; // Add a NULL to the end of the char* to make it a string.
    int result = atoi((char *)payload); //Get the integer from the string

    if (result >= 0 && result < 100) { //Getting specific command (Notification, feedforward, error)
      MODE = result;
      Serial.print("MODE = ");
      Serial.println(MODE);
      triggerMillis = millis();
      executed = false;
    } else if (result == ID) { //IoT communicator is scanned
      MODE = ID;
    } else if (result == (-1 * ID)) { //IoT communicator is stopped being scanned, start blinking ID
      MODE = 0;
    }
    else {
      lastMsg = millis(); //If the value is negative, it means it is Ping from the Web application
    }
  }

  Serial.println();

}


//Reconnecting to the MQTT
void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(clientId.c_str(), mqttUser, mqttPassword)) {
      Serial.println("connected");
      // Once connected, publish an announcement...
      client.publish("homeassistant/iot", "First Reconnected");
      // ... and resubscribe
      client.subscribe("homeassistant/iot");


    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}


//Sending the command to the Home Assistant to turn on the Table Lamp
void executeLight() {
  Serial.println("Executed Lights");
  executed = true;
  sendTheMessage(100);
  LedSet(0, 0, 0);
}


//Sending the command to the Home Assistant
void sendTheMessage(float en) {
  snprintf(msg, 50, "%.3f", en);

  Serial.print("1_Publish message: ");
  Serial.println(msg);
  client.publish("homeassistant/iot", msg);
}
