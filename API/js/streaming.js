let storeType = 'music', storeItems = [];

async function storeSearch() {
  const q = document.getElementById('store-search').value.trim();
  if (!q) return;

  document.getElementById('store-list').innerHTML = '<div class="flex justify-center py-6"><div class="spinner" style="border-top-color:#16a34a"></div></div>';
  document.getElementById('store-count').textContent = '...';
  document.getElementById('store-status').textContent = 'Buscando en iTunes Store...';

  try {
    const mediaMap = { music: 'music', movie: 'movie', ebook: 'ebook', podcast: 'podcast' };
    const media = mediaMap[storeType] || 'music';
    const entity = storeType === 'music' ? 'song' : storeType;
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=${media}&entity=${entity}&limit=12&country=MX`;
    const r = await fetch(url);
    const d = await r.json();
    storeItems = d.results || [];
    
    document.getElementById('store-count').textContent = storeItems.length;
    document.getElementById('store-cat').textContent = storeType === 'music' ? 'Música' : storeType === 'movie' ? 'Películas' : storeType === 'ebook' ? 'Libros' : 'Podcasts';
    
    if (storeItems.length) {
      const precios = storeItems.map(i => i.trackPrice || i.collectionPrice).filter(p => p > 0);
      if (precios.length) {
        const min = Math.min(...precios);
        const max = Math.max(...precios);
        document.getElementById('store-price-range').textContent = min === max ? `$${min.toFixed(2)}` : `$${min.toFixed(2)} – $${max.toFixed(2)}`;
      } else {
        document.getElementById('store-price-range').textContent = 'Gratis';
      }
    }

    document.getElementById('store-list').innerHTML = storeItems.map((item, i) => {
      const name = item.trackName || item.collectionName || item.artistName || '—';
      const artist = item.artistName || '';
      const art = (item.artworkUrl100 || '').replace('100x100bb', '60x60bb');
      const price = item.trackPrice || item.collectionPrice;
      return `<div class="store-item fade-up" onclick="storeDetail(${i})">
        <img src="${art}" onerror="this.style.display='none'">
        <div style="flex:1;min-width:0">
          <div class="store-name">${name}</div>
          <div class="store-artist">${artist}</div>
        </div>
        ${price ? `<span class="store-price">$${price.toFixed(2)}</span>` : '<span class="store-price">GRATIS</span>'}
      </div>`;
    }).join('');
    
    toast(`${storeItems.length} resultados en iTunes Store`, '#16a34a');
    document.getElementById('store-status').textContent = `${storeItems.length} resultados encontrados`;
  } catch(e) {
    document.getElementById('store-list').innerHTML = `<div class="text-center py-6"><p class="text-sm text-red-400">Error al conectar con iTunes Store</p><p class="text-xs text-slate-400 mt-1">${e.message}</p></div>`;
    document.getElementById('store-status').textContent = 'Error de conexión';
    toast('Error al cargar productos', '#ef4444');
  }
}

function storeDetail(i) {
  const item = storeItems[i]; if (!item) return;
  const name = item.trackName || item.collectionName || item.artistName;
  const artist = item.artistName || '';
  const price = item.trackPrice || item.collectionPrice;
  const priceStr = price > 0 ? `$${price.toFixed(2)} MXN` : 'GRATIS';
  const art = (item.artworkUrl100 || '').replace('100x100bb', '400x400bb');
  const preview = item.previewUrl || '';
  const desc = item.longDescription || item.description || 'Sin descripción disponible.';
  
  document.getElementById('store-d-img').src = art;
  document.getElementById('store-d-name').textContent = name;
  document.getElementById('store-d-artist').textContent = artist;
  document.getElementById('store-d-price').textContent = priceStr;
  document.getElementById('store-d-link').href = item.trackViewUrl || item.collectionViewUrl || '#';
  document.getElementById('store-d-desc').textContent = desc;
  
  const previewDiv = document.getElementById('store-d-preview');
  const audio = document.getElementById('store-audio');
  if (preview) { audio.src = preview; previewDiv.classList.remove('hidden'); audio.play().catch(()=>{}); }
  else { previewDiv.classList.add('hidden'); }
  
  document.getElementById('store-list').style.display = 'none';
  document.getElementById('store-detail').classList.remove('hidden');
  toast(name.substring(0, 30) + '…', '#16a34a');
}

function storeSetType(type) {
  storeType = type;
  document.querySelectorAll('.store-tab').forEach(btn => {
    btn.classList.remove('active');
    btn.style.background = 'transparent';
    btn.style.color = '#64748b';
  });
  const active = document.getElementById('store-tab-' + type);
  if (active) {
    active.classList.add('active');
    active.style.background = '#16a34a';
    active.style.color = 'white';
  }
  storeSearch();
}

function storeBackToList() {
  document.getElementById('store-list').style.display = 'flex';
  document.getElementById('store-detail').classList.add('hidden');
  const audio = document.getElementById('store-audio');
  if (audio) { audio.pause(); audio.src = ''; }
}

setTimeout(() => storeSearch(), 500);