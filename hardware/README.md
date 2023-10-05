# Hardware

Information related to the hardware components used in the ITESO Parking Project.

## Contents

- **component_list.md** - List of components purchased for the project.
- **schematics/** - Schematic diagrams for the sensor setups.
- **images/** - Visual representations of components and their setup.

## Codes used to establish connection with sensor and ESP32

### Connect with WiFi
```
#include "WiFi.h"
//#include "ESP8266WiFi.h"
// WiFi parameters to be configured
const char* ssid = "MEGACABLE-ACA2";
const char* password = "----";
void setup(void)
{
  Serial.begin(115200);
  // Connect to WiFi
  WiFi.begin(ssid, password);
  // while wifi not connected yet, print '.'
  // then after it connected, get out of the loop
  while (WiFi.status() != WL_CONNECTED) {
     delay(500);
     Serial.print(".");
  }
  //print a new line, then print WiFi connected and the IP address
  Serial.println("");
  Serial.println("Conectado a internet, mi IP es:");
  // Print the IP address
  Serial.println(WiFi.localIP());
}
void loop() {
  // Nothing
}
```
### Ultrasonic sensor showing if there is a car 
```
#include <NewPing.h>

#define TRIGGER_PIN 5
#define ECHO_PIN 21
#define MAX_DISTANCE 200

NewPing sonar(TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE);
int umbral_distancia = 30; // Ajusta este valor según tus necesidades

void setup() {
  Serial.begin(115200);
}

void loop() {
  delay(1000);
   
  unsigned int distancia = sonar.ping_cm();
  
  if (distancia <= umbral_distancia && distancia != 0) {
    Serial.println("Hay un auto estacionado.");
  } else {
    Serial.println("No hay auto estacionado.");
  }
}
```

### Infrared sensor showing if there is a car
```
const int irPin = 5;  // Pin donde está conectado el sensor infrarrojo

void setup() {
  pinMode(irPin, INPUT);
  Serial.begin(115200);
}

void loop() {
  int irValue = digitalRead(irPin);

  if (irValue == LOW) {
    // Si el sensor infrarrojo detecta algo (carro estacionado), el valor será LOW.
    Serial.println("Carro estacionado.");
  } else {
    // Si el sensor infrarrojo no detecta nada, el valor será HIGH.
    Serial.println("No hay carro estacionado.");
  }

  delay(1000);  // Espera 1 segundo entre lecturas
}
```
### Ultrasonic sensor showing distance and if there is a car
```
#include <NewPing.h>

#define TRIGGER_PIN 5
#define ECHO_PIN 21
#define MAX_DISTANCE 200

NewPing sonar(TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE);
int umbral_distancia = 30; // Ajusta este valor según tus necesidades

void setup() {
  Serial.begin(115200);
}

void loop() {
  delay(1000);
   
  unsigned int distancia = sonar.ping_cm();
  Serial.print("Distancia: ");
  Serial.print(distancia);
  Serial.println(" cm");
  
  if (distancia <= umbral_distancia && distancia != 0) {
    Serial.println("Hay un auto estacionado.");
  } else {
    Serial.println("No hay auto estacionado.");
  }
}
```
