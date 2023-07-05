const mqtt = require('mqtt');

const host = 'broker.emqx.io';
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `mqtt://${host}:${port}`;

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'emqx',
  password: 'public',
  reconnectPeriod: 1000,
});

client.on('connect', () => {
  console.log('Connected')
});

client.on('message', (topic, message) => {
  console.log(`Received message on topic '${topic}': ${message}`);
});

const publishMessage = async (topic, message) => {
  client.subscribe([topic], () => {

    console.log(`Subscribe to topic '${topic}'`);
    client.publish(topic, JSON.stringify(message), { qos: 0, retain: false }, (error) => {
      if (error) {
        console.error(error)
      }
    })
  });
}

module.exports = {
  publishMessage,
}