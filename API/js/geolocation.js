let map, marker, lat=25.5535, lon=-100.9320;

function initMap() {
  map = L.map('leaflet-map',{zoomControl:true,attributionControl:false}).setView([lat,lon],13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(map);
  const ico = L.divIcon({html:'<div style="width:13px;height:13px;border-radius:50%;background:#3b82f6;border:2px solid white;box-shadow:0 2px 6px rgba(59,130,246,.5)"></div>',className:'',iconAnchor:[7,7]});
  marker = L.marker([lat,lon],{icon:ico}).addTo(map).bindPopup('📍 <b>Saltillo, Coahuila</b>');
  document.getElementById('disp-lat').textContent = lat.toFixed(4);
  document.getElementById('disp-lon').textContent = lon.toFixed(4);
}

function getMyLocation() {
  if (!navigator.geolocation) { toast('GPS no disponible','#ef4444'); return; }
  navigator.geolocation.getCurrentPosition(pos => {
    lat = pos.coords.latitude; lon = pos.coords.longitude;
    map.setView([lat,lon],15); marker.setLatLng([lat,lon]);
    document.getElementById('disp-lat').textContent = lat.toFixed(4);
    document.getElementById('disp-lon').textContent = lon.toFixed(4);
    document.getElementById('disp-acc').textContent = Math.round(pos.coords.accuracy)+'m';
    toast('Ubicación actualizada','#10b981');
  }, () => toast('GPS denegado','#ef4444'));
}

function geoSearch() { const q = document.getElementById('geo-input').value.trim(); if (q) geoFilter(q); }

async function geoFilter(q) {
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q+' Saltillo Mexico')}&format=json&limit=5`);
    const d = await r.json();
    if (!d.length) { toast('Sin resultados','#ef4444'); return; }
    map.eachLayer(l => { if (l instanceof L.Marker && l !== marker) map.removeLayer(l); });
    d.forEach(r => { L.marker([parseFloat(r.lat),parseFloat(r.lon)]).addTo(map).bindPopup(`📍 <b>${r.display_name.split(',')[0]}</b>`); });
    map.setView([parseFloat(d[0].lat),parseFloat(d[0].lon)],15);
    toast(`${d.length} resultados encontrados`,'#10b981');
  } catch(e) { toast('Error de red','#ef4444'); }
}

initMap();