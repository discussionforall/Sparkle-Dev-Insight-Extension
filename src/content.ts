// content.ts — ISOLATED world bridge
// Receives structured signals from inject.ts (MAIN world) and forwards to background.

let lastSendTime = 0;
const THROTTLE_MS = 1500;

function safeSend(message: any) {
  if (!chrome.runtime?.id) return;
  chrome.runtime.sendMessage(message).catch(() => {});
}

window.addEventListener('message', function (event) {
  if (event.source !== window) return;
  if (!event.data?.source || event.data.source !== 'DEV_INSIGHT_EXT') return;

  const { type, data } = event.data;
  if (!chrome.runtime?.id) return;

  if (type === 'NETWORK_REQUEST') {
    safeSend({ action: 'NETWORK_REQUEST', payload: { ...data, href: window.location.href } });
    return;
  }

  if (type === 'SIGNALS_COLLECTED') {
    const now = Date.now();
    if (now - lastSendTime < THROTTLE_MS) return;
    lastSendTime = now;
    safeSend({ action: 'SIGNALS_COLLECTED', payload: { ...data, href: window.location.href } });
  }
});
