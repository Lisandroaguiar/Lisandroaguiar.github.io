#!/usr/bin/env node
const dgram = require('node:dgram');
const { URL } = require('node:url');
const [role, roomId, key, ...args] = process.argv.slice(2);
function usage() {
  console.log('Uso:\n  node bridge.js sender <SALA> <CLAVE> [puerto-entrada=9000] [URL-servidor=ws://localhost:3000]\n  node bridge.js receiver <SALA> <CLAVE> [host-destino=127.0.0.1] [puerto-destino=9001] [URL-servidor=ws://localhost:3000]');
  process.exit(1);
}
if (!['sender', 'receiver'].includes(role) || !roomId || !key) usage();
const sender = role === 'sender';
const udpPort = Number(sender ? (args[0] || 9000) : (args[1] || 9001));
const udpHost = sender ? '127.0.0.1' : (args[0] || '127.0.0.1');
const relayRaw = sender ? (args[1] || 'ws://localhost:3000') : (args[2] || 'ws://localhost:3000');
const relay = new URL(relayRaw);
relay.protocol = relay.protocol === 'https:' ? 'wss:' : relay.protocol === 'http:' ? 'ws:' : relay.protocol;
relay.pathname = `/bridge/${roomId}/${role}`;
relay.searchParams.set('key', key);
const udp = dgram.createSocket('udp4');
let ws = null, reconnectDelay = 1000, received = 0;
udp.on('message', packet => {
  if (!sender || !ws || ws.readyState !== WebSocket.OPEN || packet.length > 65507) return;
  ws.send(packet);
});
udp.on('error', err => console.error(`UDP: ${err.message}`));
if (sender) udp.bind(udpPort, udpHost, () => console.log(`Escuchando OSC/UDP en ${udpHost}:${udpPort}`));
else console.log(`Destino OSC/UDP: ${udpHost}:${udpPort}`);

function connect() {
  console.log(`Conectando al relay (${role})...`);
  ws = new WebSocket(relay);
  ws.binaryType = 'arraybuffer';
  ws.onopen = () => { reconnectDelay = 1000; console.log('Conectado.'); };
  ws.onmessage = ev => {
    if (!sender) {
      const packet = Buffer.from(ev.data);
      udp.send(packet, udpPort, udpHost, err => { if (!err && ++received % 100 === 1) console.log(`${received} paquetes OSC enviados al destino local`); });
    }
  };
  ws.onerror = () => {};
  ws.onclose = ev => {
    console.log(ev.code === 409 ? 'Este rol ya está conectado a la sala.' : 'Conexión perdida; se intentará reconectar.');
    setTimeout(connect, reconnectDelay);
    reconnectDelay = Math.min(reconnectDelay * 2, 30000);
  };
}
connect();
process.on('SIGINT', () => { console.log('\nCerrando puente...'); ws?.close(); udp.close(); process.exit(0); });
