const byId = id => document.getElementById(id);
let room = null;
const relayUrl = new URL(window.TRAMA_CONFIG?.relayUrl || location.origin);
const relayHttp = `${relayUrl.protocol === 'https:' || relayUrl.protocol === 'wss:' ? 'https:' : 'http:'}//${relayUrl.host}`;
let installPrompt = null;
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault(); installPrompt = event; byId('installButton').classList.remove('hidden');
});
byId('installButton').addEventListener('click', async () => {
  if (!installPrompt) return;
  await installPrompt.prompt(); installPrompt = null; byId('installButton').classList.add('hidden');
});
window.addEventListener('appinstalled', () => byId('installButton').classList.add('hidden'));
byId('createButton').addEventListener('click', async () => {
  const button = byId('createButton'); button.disabled = true; button.textContent = 'Creando…';
  try {
    const response = await fetch(`${relayHttp}/api/rooms`, { method: 'POST' });
    if (!response.ok) throw new Error('No se pudo crear la sala. Intenta de nuevo.');
    room = await response.json();
    byId('roomId').textContent = room.id; byId('roomKey').textContent = room.key;
    byId('create').classList.add('hidden'); byId('room').classList.remove('hidden'); poll();
  } catch (err) { byId('error').textContent = err.message; byId('error').classList.remove('hidden'); button.disabled = false; button.innerHTML = 'Crear sala <span>↗</span>'; }
});
byId('copy').addEventListener('click', async () => { await navigator.clipboard.writeText(room.key); byId('copy').textContent = 'Copiada ✓'; setTimeout(() => byId('copy').textContent = 'Copiar clave', 1600); });
function poll() {
  if (!room) return;
  fetch(`${relayHttp}/api/rooms/${room.id}?admin=${encodeURIComponent(room.adminToken)}`).then(r => r.ok ? r.json() : null).then(s => {
    if (!s) return;
    for (const role of ['sender', 'receiver']) { const el = byId(`${role}State`); el.classList.toggle('online', s[role]); el.innerHTML = `<i></i> ${s[role] ? 'Conectado' : 'Esperando'}`; }
    byId('packets').textContent = s.packets.toLocaleString('es-AR');
    byId('lastMessage').textContent = s.lastMessageAt ? new Date(s.lastMessageAt).toLocaleTimeString('es-AR') : '—';
  }).catch(() => {});
  setTimeout(poll, 1500);
}
