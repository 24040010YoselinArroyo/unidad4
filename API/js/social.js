let rdSub='mexico', rdSort='hot', rdPosts=[];

async function rdFetch(sub, sort) {
  const url = `https://corsproxy.io/?${encodeURIComponent(`https://www.reddit.com/r/${sub}/${sort}.json?limit=15&raw_json=1`)}`;
  const r = await fetch(url, { headers:{ Accept:'application/json' } });
  if (!r.ok) throw new Error('HTTP '+r.status);
  const d = await r.json();
  return d.data.children.map(c => c.data);
}

async function rdLoad(sub, sort) {
  rdSub = sub||rdSub; rdSort = sort||rdSort;
  document.getElementById('rd-current-sub').textContent = 'r/'+rdSub;
  document.getElementById('rd-status-badge').textContent = 'Cargando...';
  document.getElementById('rd-status-badge').style.background = '#fef3c7';
  document.getElementById('rd-status-badge').style.color = '#b45309';
  document.getElementById('rd-feed').innerHTML = '<div class="flex justify-center py-6"><div class="spinner" style="border-top-color:#f97316"></div></div>';
  try {
    const posts = await rdFetch(rdSub, rdSort);
    rdPosts = posts;
    document.getElementById('rd-count').textContent = posts.length;
    document.getElementById('rd-update-time').textContent = new Date().toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit'});
    document.getElementById('rd-status-badge').textContent = 'Live ✅';
    document.getElementById('rd-status-badge').style.background = '#dcfce7';
    document.getElementById('rd-status-badge').style.color = '#15803d';
    document.getElementById('rd-feed').innerHTML = posts.map((p, i) => {
      const score = p.score || 0;
      const color = score>1000?'#ea580c':score>100?'#f97316':'#94a3b8';
      const ago = p.created_utc ? timeAgo(p.created_utc) : '';
      return `<div class="rd-post fade-up" onclick="rdExpand(${i})">
        <div><div style="display:flex;align-items:center;gap:4px;margin-bottom:4px"><span style="font-size:.65rem;color:#94a3b8">${ago} · u/${(p.author||'').substring(0,15)}</span></div>
        <p style="font-size:.82rem;font-weight:600;color:#1e293b;margin-bottom:5px">${p.title||''}</p>
        <div style="display:flex;align-items:center;gap:10px"><span style="font-size:.7rem;font-weight:700;color:${color}">⬆ ${numFmt(score)}</span><span style="font-size:.7rem;color:#94a3b8">💬 ${numFmt(p.num_comments||0)}</span></div></div>
      </div>`;
    }).join('');
    toast(`r/${rdSub} · ${posts.length} posts`, '#f97316');
  } catch(e) {
    document.getElementById('rd-feed').innerHTML = `<div class="text-center py-4 text-sm text-red-500">Error: ${e.message}</div>`;
    document.getElementById('rd-status-badge').textContent = 'Error ❌';
    document.getElementById('rd-status-badge').style.background = '#fee2e2';
    document.getElementById('rd-status-badge').style.color = '#b91c1c';
  }
}

function rdExpand(i) {
  const p = rdPosts[i]; if (!p) return;
  document.getElementById('rd-exp-sub').textContent = `r/${p.subreddit||rdSub}`;
  document.getElementById('rd-exp-title').textContent = p.title||'';
  document.getElementById('rd-exp-body').textContent = p.selftext ? p.selftext.substring(0,400) : 'Sin contenido';
  document.getElementById('rd-exp-ups').textContent = `⬆ ${numFmt(p.ups||0)} votos`;
  document.getElementById('rd-exp-coms').textContent = `💬 ${numFmt(p.num_comments||0)} comentarios`;
  document.getElementById('rd-exp-link').href = 'https://reddit.com'+(p.permalink||'');
  document.getElementById('rd-expanded').classList.remove('hidden');
}

function rdLoadSub() { const v=document.getElementById('rd-sub-input').value.trim(); if(v) rdLoad(v,rdSort); }
function rdQuick(sub) { document.getElementById('rd-sub-input').value=sub; rdLoad(sub,rdSort); }
function rdRefresh() { rdLoad(rdSub,rdSort); }

function rdSetSort(sort) {
  rdSort = sort;
  document.querySelectorAll('.rd-tab').forEach(b => { b.classList.remove('active'); b.style.background='#f1f5f9'; b.style.color='#334155'; });
  const btn = document.getElementById('rd-sort-'+sort);
  if (btn) { btn.classList.add('active'); btn.style.background='#f97316'; btn.style.color='white'; }
  rdLoad(rdSub, sort);
}

rdLoad('mexico','hot');