let smsCount = 0;

document.getElementById('sms-msg').addEventListener('input', function() { 
  const n = this.value.length; 
  document.getElementById('sms-chars').textContent = n + '/160'; 
  if (n > 160) this.value = this.value.substring(0,160); 
  if (n > 140) {
    document.getElementById('sms-chars').style.color = '#f97316';
  } else {
    document.getElementById('sms-chars').style.color = '#94a3b8';
  }
});

function smsSend() {
  const phone = document.getElementById('sms-phone').value.trim();
  const msg = document.getElementById('sms-msg').value.trim();
  
  if (!phone) { toast('⚠️ Ingresa un número de teléfono', '#ef4444'); return; }
  if (!msg) { toast('⚠️ Escribe un mensaje', '#ef4444'); return; }
  
  const reqEl = document.getElementById('sms-req-display');
  const toEl = document.getElementById('sms-req-to');
  const bodyEl = document.getElementById('sms-req-body');
  const respEl = document.getElementById('sms-req-resp');
  
  if (toEl) toEl.textContent = phone;
  if (bodyEl) bodyEl.textContent = '"' + msg.substring(0, 30) + (msg.length > 30 ? '...' : '') + '"';
  if (respEl) respEl.innerHTML = '';
  if (reqEl) reqEl.style.display = 'block';
  
  setTimeout(() => {
    if (respEl) {
      respEl.innerHTML = '<span style="color:#fbbf24">HTTP/1.1 201 Created</span> <span style="color:#4ade80">{"sid":"SM' + Math.floor(Math.random() * 10000) + '","status":"queued"}</span>';
    }
    
    smsCount++;
    document.getElementById('sms-count').textContent = smsCount;
    
    const now = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const inbox = document.getElementById('sms-inbox');
    
    if (inbox && inbox.querySelector('.text-slate-400')) {
      inbox.innerHTML = '';
    }
    
    const bubble = document.createElement('div');
    bubble.className = 'fade-up';
    bubble.style.marginBottom = '8px';
    bubble.innerHTML = `
      <div style="background:linear-gradient(135deg,#f0f9ff 0%,#e6f7ff 100%);border:1px solid #bae6fd;border-radius:16px;padding:12px;box-shadow:0 2px 4px rgba(0,0,0,0.02)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-weight:700;font-size:0.8rem;color:#0891b2">📱 ${phone}</span>
          <span style="font-size:0.6rem;background:#dcfce7;color:#16a34a;padding:2px 8px;border-radius:20px;font-weight:600">✓ ENVIADO</span>
        </div>
        <p style="font-size:0.85rem;color:#1e293b;margin-bottom:6px;line-height:1.4">${msg}</p>
        <div style="text-align:right;font-size:0.6rem;color:#94a3b8;border-top:1px solid #cbd5e1;padding-top:4px;margin-top:4px">
          ${now} · ID: SMS-${Math.floor(Math.random() * 10000)}
        </div>
      </div>
    `;
    
    if (inbox) {
      inbox.prepend(bubble);
      while (inbox.children.length > 15) {
        inbox.removeChild(inbox.lastChild);
      }
    }
    
    document.getElementById('sms-msg').value = '';
    document.getElementById('sms-chars').textContent = '0/160';
    
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Dashboard SMS", { body: `Mensaje enviado a ${phone}: "${msg.substring(0, 40)}${msg.length > 40 ? '...' : ''}"` });
    } else if (Notification.permission !== "denied" && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
    
    toast(`📨 SMS enviado a ${phone}`, '#10b981');
    
  }, 1200);
}

if ("Notification" in window && Notification.permission === "default") {
  Notification.requestPermission();
}

document.addEventListener('DOMContentLoaded', function() {
  const charsSpan = document.getElementById('sms-chars');
  if (charsSpan) charsSpan.textContent = '0/160';
});