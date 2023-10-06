# MQTT Configuration and Implementation

This directory covers details and documentation related to MQTT for the ITESO Parking Project.

## Configuration

Details about how MQTT is set up, any special configuration, or environmental variables.

## Usage

Brief on how MQTT is used in the project, its purpose, and what data is sent/received.

## Codes used

### Establishing connection between ESP32 and AWS EC2 instance and sending a message
```
#include <NewPing.h>
#include <PubSubClient.h>
#include <WiFi.h>

#define TRIGGER_PIN 5
#define ECHO_PIN 21
#define MAX_DISTANCE 200

NewPing sonar(TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE);
int umbral_distancia = 30; // Ajusta este valor según tus necesidades

// Configura la dirección IP y el puerto del broker MQTT en tu instancia de EC2
const char* mqtt_server = "3.128.139.227";
const int mqtt_port = 1883;
const char* ssid = "MEGACABLE-ACA2";
const char* password = "HbRA46s9";

// Crea un cliente MQTT
WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
}

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Conectando a ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("Conectado a la red WiFi");
}

void reconnect() {
  while (!client.connected()) {
    Serial.println("Conectando al servidor MQTT...");
    if (client.connect("ESP32Client")) {
      Serial.println("Conectado al servidor MQTT");
    } else {
      Serial.print("Error de conexión, rc=");
      Serial.print(client.state());
      Serial.println(" Intentando de nuevo en 5 segundos");
      delay(5000);
    }
  }
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // Medir la distancia con el sensor ultrasónico
  unsigned int distancia = sonar.ping_cm();

  if (distancia <= umbral_distancia && distancia != 0) {
    Serial.println("Hay un auto estacionado.");
    // Envía un mensaje MQTT cuando detecta un automóvil estacionado
    String mensaje = "1";
    client.publish("topico_mqtt", mensaje.c_str());
  } else {
    Serial.println("No hay auto estacionado.");
    // Envía un mensaje MQTT cuando no detecta un automóvil estacionado
    String mensaje = "0";
    client.publish("topico_mqtt", mensaje.c_str());
  }
  
  delay(5000); // Espera 5 segundos antes de la siguiente medición y envío MQTT
}
```
