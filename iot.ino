#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <Wire.h>
#include <BH1750.h>
#include <ArduinoJson.h>  // Thêm thư viện ArduinoJson
// Cấu hình WiFi
const char* ssid = "HA";  // Thay bằng tên WiFi của bạn
const char* password = "haianh210";  // Thay bằng mật khẩu WiFi của bạn
// Cấu hình MQTT
const char* mqtt_server = "172.20.10.11";  // Địa chỉ IP của máy tính chạy Mosquitto
const int mqtt_port = 6888;  // Cổng mặc định cho MQTT
const char* mqtt_user = "HA";  // Nếu cần xác thực MQTT, nhập user vào đây
const char* mqtt_pass = "12345678";  // Nếu cần xác thực MQTT, nhập password vào đây
unsigned long currentMillis = 0;
// unsigned long previousTempMillis = 0;
// unsigned long previousHumidMillis = 0;
unsigned long previousLightMillis = 0;
unsigned long previousSendMillis = 0;
const long interval = 100;
bool lightAlertActive = false;  // Biến lưu trạng thái cảnh báo ánh sáng
// bool tempAlertActice = false;
// bool humAlertActive = false;
// Cấu hình chân DHT22 và BH1750
#define DHTPIN D2
#define DHTTYPE DHT22
// Cấu hình chân LED
#define LED1_PIN D5 // Quạt
#define LED2_PIN D6 // Điều hòa
#define LED3_PIN D7 // Đèn
// #define LED_TEMP_PIN D3   // LED cảnh báo Nhiệt độ
// #define LED_HUMID_PIN D4
#define LED_LIGHT_PIN D8  // LED cảnh báo Ánh sáng
DHT dht(DHTPIN, DHTTYPE);
BH1750 lightMeter;

WiFiClient espClient;
PubSubClient client(espClient);
// Biến để theo dõi trạng thái thiết bị
bool fanStatus = LOW;
bool airConditionerStatus = LOW;
bool lightStatus = LOW;
// Hàm kết nối WiFi
void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Đang kết nối đến ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi đã kết nối.");
  Serial.println(WiFi.localIP());
}
// Hàm gửi phản hồi đến các topic riêng cho từng thiết bị theo định dạng JSON
void sendDeviceResponse(const char* device, bool status) {
  DynamicJsonDocument doc(256);
  doc["device"] = device;
  doc["status"] = status ? "On" : "Off";

  char buffer[256];
  serializeJson(doc, buffer);

  String topic = String("response/") + device;
  client.publish(topic.c_str(), buffer);
  Serial.println(buffer);  // In phản hồi ra Serial Monitor
}
// Hàm xử lý tin nhắn MQTT
void callback(char* topic, byte* payload, unsigned int length) {
  String message = "";
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  // Kiểm tra topic điều khiển thiết bị
  if (String(topic) == "control/Fan") {
    if (message == "On" && fanStatus == LOW) {
      fanStatus = HIGH;
      digitalWrite(LED1_PIN, fanStatus);
    } else if (message == "Off" && fanStatus == HIGH) {
      fanStatus = LOW;
      digitalWrite(LED1_PIN, fanStatus);
    }
    // Gửi phản hồi sau khi điều khiển
    sendDeviceResponse("Fan", fanStatus);
  } else if (String(topic) == "control/Air-conditioner") {
    if (message == "On" && airConditionerStatus == LOW) {
      airConditionerStatus = HIGH;
      digitalWrite(LED2_PIN, airConditionerStatus);
    } else if (message == "Off" && airConditionerStatus == HIGH) {
      airConditionerStatus = LOW;
      digitalWrite(LED2_PIN, airConditionerStatus);
    }
    // Gửi phản hồi sau khi điều khiển
    sendDeviceResponse("Air-conditioner", airConditionerStatus);
  } else if (String(topic) == "control/Light") {
    if (message == "On" && lightStatus == LOW) {
      lightStatus = HIGH;
      digitalWrite(LED3_PIN, lightStatus);
    } else if (message == "Off" && lightStatus == HIGH) {
      lightStatus = LOW;
      digitalWrite(LED3_PIN, lightStatus);
    }
    // Gửi phản hồi sau khi điều khiển
    sendDeviceResponse("Light", lightStatus);
  } else if (String(topic) == "control/All") {
    // Điều khiển cả 3 thiết bị cùng một lúc
    if (message == "On") {
      fanStatus = HIGH;
      airConditionerStatus = HIGH;
      lightStatus = HIGH;
      digitalWrite(LED1_PIN, fanStatus);
      digitalWrite(LED2_PIN, airConditionerStatus);
      digitalWrite(LED3_PIN, lightStatus);
    } else if (message == "Off") {
      fanStatus = LOW;
      airConditionerStatus = LOW;
      lightStatus = LOW;
      digitalWrite(LED1_PIN, fanStatus);
      digitalWrite(LED2_PIN, airConditionerStatus);
      digitalWrite(LED3_PIN, lightStatus);
    }
    // Gửi phản hồi sau khi điều khiển
    sendDeviceResponse("Fan", fanStatus);
    sendDeviceResponse("Air-conditioner", airConditionerStatus);
    sendDeviceResponse("Light", lightStatus);
  }
}
void sendAlert(const char* sensor, char* value) {
  DynamicJsonDocument alertDoc(256);
  alertDoc["sensor"] = sensor;
  alertDoc["value"] = value;

  char alertBuffer[256];
  serializeJson(alertDoc, alertBuffer);

  // Gửi cảnh báo tới topic "sensor/alert"
  client.publish("sensor/alert", alertBuffer);
  Serial.println(alertBuffer); 
  delay(100);
}
// Hàm kết nối tới broker MQTT
void reconnect() {
  while (!client.connected()) {
    Serial.print("Đang kết nối tới MQTT...");
    if (client.connect("ESP8266Client", mqtt_user, mqtt_pass)) {
      Serial.println("Đã kết nối");

      // Đăng ký (subscribe) vào các topic điều khiển thiết bị
      client.subscribe("control/Fan");
      client.subscribe("control/Air-conditioner");
      client.subscribe("control/Light");
      client.subscribe("control/All");
    } else {
      Serial.print("Kết nối thất bại, rc=");
      Serial.print(client.state());
      delay(5000);
    }
  }
}
// Hàm setup
void setup() {
  // Khởi tạo LED
  pinMode(LED1_PIN, OUTPUT);
  pinMode(LED2_PIN, OUTPUT);
  pinMode(LED3_PIN, OUTPUT);
  // Khởi tạo LED cảnh báo
  // pinMode(LED_TEMP_PIN, OUTPUT);
  // pinMode(LED_HUMID_PIN, OUTPUT);
  pinMode(LED_LIGHT_PIN, OUTPUT);
  // digitalWrite(LED_TEMP_PIN, HIGH);
  // digitalWrite(LED_HUMID_PIN, HIGH);
  digitalWrite(LED_LIGHT_PIN, LOW);
  // Khởi tạo cảm biến
  dht.begin();
  Wire.begin();
  lightMeter.begin();
  Serial.begin(115200);
  // Kết nối WiFi
  setup_wifi();
  // Cấu hình MQTT server và callback
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void loop() {
  // Kết nối lại nếu bị ngắt kết nối
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  float lux = lightMeter.readLightLevel();

  currentMillis = millis();
  // Kiểm tra lỗi khi đọc cảm biến
  if (currentMillis - previousSendMillis >= 5000) {
    previousSendMillis = currentMillis;
    if (!isnan(humidity) && !isnan(temperature)) {
    // Tạo chuỗi JSON chứa cả 3 giá trị cảm biến
    DynamicJsonDocument doc(256);
    doc["temperature"] = temperature;
    doc["humidity"] = humidity;
    doc["light"] = lux;
    // Chuyển đổi JSON thành chuỗi để gửi đi
    char jsonBuffer[256];
    serializeJson(doc, jsonBuffer);
    // Đăng tin vào topic "datasensor"
    client.publish("datasensor", jsonBuffer);
    // Hiển thị dữ liệu trên Serial Monitor
    Serial.println(jsonBuffer);
    } else {
      Serial.println("Lỗi khi đọc cảm biến.");
    }
  }
    // Điều khiển LED cảnh báo nhiệt độ (nhấp nháy nếu vượt ngưỡng)
    // if (temperature > 40) {
    //   if (currentMillis - previousTempMillis >= interval) {
    //     previousTempMillis = currentMillis;
    //     digitalWrite(LED_TEMP_PIN, !digitalRead(LED_TEMP_PIN));  // Đổi trạng thái đèn (nhấp nháy)
    //   }
    //   sendAlert("temperature", temperature);  // Gửi cảnh báo nếu vượt ngưỡng
    // } else {
    //   digitalWrite(LED_TEMP_PIN, LOW);  // Tắt đèn nếu giá trị dưới ngưỡng
    // }

    // // Điều khiển LED cảnh báo độ ẩm (nhấp nháy nếu vượt ngưỡng)
    // if (humidity > 70) {
    //   if (currentMillis - previousHumidMillis >= interval) {
    //     previousHumidMillis = currentMillis;
    //     digitalWrite(LED_HUMID_PIN, !digitalRead(LED_HUMID_PIN));  // Đổi trạng thái đèn (nhấp nháy)
    //   }
    //   sendAlert("humidity", humidity);  // Gửi cảnh báo nếu vượt ngưỡng
    // } else {
    //   digitalWrite(LED_HUMID_PIN, LOW);  // Tắt đèn nếu giá trị dưới ngưỡng
    // }

    // Điều khiển LED cảnh báo ánh sáng (nhấp nháy nếu vượt ngưỡng)
    char luxStr[10];
    if (lux > 1000) {
    if (!lightAlertActive) {  // Kiểm tra nếu cảnh báo chưa được kích hoạt
      dtostrf(lux, 6, 2, luxStr);
      sendAlert("light", luxStr);  // Gửi cảnh báo khi vượt ngưỡng
      lightAlertActive = true;  // Đặt trạng thái cảnh báo là kích hoạt
    }

    if (currentMillis - previousLightMillis >= 100) {  // Nhấp nháy mỗi 100ms
      previousLightMillis = currentMillis;
      digitalWrite(LED_LIGHT_PIN, !digitalRead(LED_LIGHT_PIN));  // Nhấp nháy
    }
  } else {
    if (lightAlertActive) {  // Kiểm tra nếu cảnh báo đang được kích hoạt
      sendAlert("light", "ok");  // Gửi thông báo khi hết vượt ngưỡng
      lightAlertActive = false;  // Đặt trạng thái cảnh báo là chưa kích hoạt
    }
    digitalWrite(LED_LIGHT_PIN, LOW);  // Tắt đèn khi giá trị dưới ngưỡng
  }
}
