const mqtt = require('mqtt');
const {db} = require('../db/db.js');
const PetFeeder = db.petfeeders;

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

  let message_parsed = JSON.parse(message);
  if (message_parsed.action == "status") {
    console.log(message_parsed.action);

    PetFeeder.update({
      reservatory_level: message_parsed.reservatory_level,
      open: message_parsed.open
    }, {
      where: {
        token: message_parsed.token
      }
    })
  }
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
  client
}