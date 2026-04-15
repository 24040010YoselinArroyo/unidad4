function toast(msg, bg = '#1e293b') {
  const t = document.getElementById('toast');
  t.textContent = msg; t.style.background = bg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function clock() { 
  document.getElementById('header-clock').textContent = new Date().toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit',second:'2-digit'}); 
}
setInterval(clock, 1000); 
clock();

function numFmt(n) { 
  if (n >= 1e6) return (n/1e6).toFixed(1)+'M'; 
  if (n >= 1e3) return (n/1e3).toFixed(1)+'k'; 
  return n; 
}

function timeAgo(ts) { 
  const s = Math.floor((Date.now() - ts*1000)/1000); 
  if (s<60) return `hace ${s}s`; 
  if (s<3600) return `hace ${Math.floor(s/60)}min`; 
  if (s<86400) return `hace ${Math.floor(s/3600)}h`; 
  return `hace ${Math.floor(s/86400)}d`; 
}

function msToMin(ms) { 
  const s = Math.floor(ms/1000); 
  return Math.floor(s/60)+':'+String(s%60).padStart(2,'0'); 
}