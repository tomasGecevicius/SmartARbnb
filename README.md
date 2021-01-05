# SmartARbnb - Augmented reality smart home interface
SmartArbnb is a local mobile web application that combines augmented reality and visual light communication to control smart home devices. The tool uses a mobile camera to scan IoT communicators, let users change connected devices' settings, visualizes the current set automation and gives a list of atmopshere presets.

## What I can find here?
### Web application
Web application that is made in native Javascript language. It consists of:
 1. LED with saturated color blob detection.
 2. LED blinking pattern communication algorithm
 3. Connection with the Hass.io Javascript API
 4. Nicely looking smart home interface
 
 ### IoT communicator
In simple terms this IoT communicator is a (NodeMCU) ESP-32S coded in Arduino IDE with a W2812B LED strip, that blinks in specific sequences to communicate assigned ID number, and shows different LED patterns based on the value got from HomeAssistant throught MQTT communication.
