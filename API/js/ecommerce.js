let amEntity = 'song', amMedia = 'music', amItems = [];
function amSetType(entity, media) {
  amEntity = entity; amMedia = media;
  document.querySelectorAll('.am-tab').forEach(b => { b.classList.remove('active'); b.style.background='transparent'; b.style.color='#64748b'; });
  const el = document.getElementById('am-tab-'+entity);
  if (el) { el.classList.add('active'); }
  const q = document.getElementById('am-search').value.trim();
  if (q) amSearch(); else amLoadTop();
}
async function amSearch() {
  const q = document.getElementById('am-search').value.trim();
  if (!q) { amLoadTop(); return; }
  amShowList();
  document.getElementById('am-list').innerHTML = '<div class="flex justify-center py-6"><div class="spinner" style="border-top-color:#fc3c44"></div></div>';
  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=${amEntity}&media=${amMedia}&limit=10&country=MX`;
    const r = await fetch(url);
    const d = await r.json();
    amItems = d.results || [];
    document.getElementById('am-count').textContent = amItems.length + ' resultado(s)';
    document.getElementById('am-list').innerHTML = amItems.map((item, i) => {
      const name = item.trackName || item.collectionName || item.artistName || '—';
      const artist = item.artistName || '';
      const art = (item.artworkUrl100 || '').replace('100x100bb','60x60bb');
      const hasPreview = !!item.previewUrl;
      const price = item.trackPrice || item.collectionPrice;
      return `<div class="am-item fade-up" onclick="amDetail(${i})"><img src="${art}"><div style="flex:1"><div class="am-item-name">${name}</div><div class="am-item-sub">${artist}</div></div>${hasPreview ? '<span class="am-preview-badge">▶ 30s</span>' : ''}<svg width="6" height="6" viewBox="0 0 10 10" fill="#94a3b8"><polygon points="2,1 9,5 2,9"/></svg></div>`;
    }).join('');
    toast(amItems.length + ' resultados · Apple Music', '#fc3c44');
  } catch(e) { document.getElementById('am-list').innerHTML = `<p class="text-center text-sm text-red-400 py-4">Error: ${e.message}</p>`; }
}
async function amLoadTop() { document.getElementById('am-search').value = 'Bad Bunny'; await amSearch(); }
function amDetail(i) {
  const item = amItems[i]; if (!item) return;
  const name = item.trackName || item.collectionName || item.artistName;
  const artist = item.artistName || '';
  const price = item.trackPrice || item.collectionPrice;
  const priceStr = price > 0 ? `$${price.toFixed(2)} MXN` : 'GRATIS';
  const art = (item.artworkUrl100||'').replace('100x100bb','400x400bb');
  const preview = item.previewUrl || '';
  document.getElementById('am-d-img').src = art;
  document.getElementById('am-d-name').textContent = name;
  document.getElementById('am-d-artist').textContent = artist;
  document.getElementById('am-d-price').textContent = priceStr;
  document.getElementById('am-d-link').href = item.trackViewUrl || item.collectionViewUrl || '#';
  const wrap = document.getElementById('am-player-wrap');
  const audio = document.getElementById('am-audio');
  if (preview) { audio.src = preview; wrap.classList.remove('hidden'); audio.play().catch(()=>{}); }
  else { wrap.classList.add('hidden'); }
  amShowDetail();
  toast(name.substring(0,28), '#fc3c44');
}
function amShowList() { document.getElementById('am-list').style.display = 'flex'; document.getElementById('am-detail').classList.add('hidden'); const audio = document.getElementById('am-audio'); if (audio) { audio.pause(); audio.src = ''; } }
function amShowDetail() { document.getElementById('am-list').style.display = 'none'; document.getElementById('am-detail').classList.remove('hidden'); }
function amBackToList() { amShowList(); }
setTimeout(() => amLoadTop(), 300);