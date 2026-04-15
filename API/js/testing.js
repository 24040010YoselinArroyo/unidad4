// // ============================================================
// //  TESTING.JS — Panel de Pruebas integrado en el Dashboard
// //  Pruebas Unitarias, Integración, UI, Caja Blanca/Negra
// // ============================================================

// const TEST_SUITE = {
//   unitarias: [
//     // ── FIREBASE ────────────────────────────────────────────
//     {
//       id: 'U-DB-01', ms: 'Firebase', tipo: 'Unitaria',
//       titulo: 'Insertar doc con nombre válido',
//       quien: 'Tester Backend', cuando: 'Sprint 1', donde: 'Navegador + Firestore',
//       servicio: 'database.js → dbInsert()',
//       ejecutar: async () => {
//         if (typeof dbInsert !== 'function') throw new Error('dbInsert no está definida');
//         const campo = document.getElementById('db-nombre');
//         const campov = document.getElementById('db-valor');
//         if (!campo || !campov) throw new Error('Campos db-nombre / db-valor no existen en DOM');
//         campo.value = '__TEST_AUTO__';
//         campov.value = '42';
//         await dbInsert();
//         return 'dbInsert() ejecutado sin excepciones. Verifica en la tabla que apareció __TEST_AUTO__.';
//       }
//     },
//     {
//       id: 'U-DB-02', ms: 'Firebase', tipo: 'Unitaria',
//       titulo: 'Insertar sin nombre → toast error, sin write a Firestore',
//       quien: 'Tester Backend', cuando: 'Sprint 1', donde: 'Navegador',
//       servicio: 'database.js → dbInsert() validación',
//       ejecutar: async () => {
//         const campo = document.getElementById('db-nombre');
//         if (!campo) throw new Error('Campo db-nombre no existe');
//         campo.value = '';
//         const before = document.getElementById('db-tbody')?.innerHTML || '';
//         await dbInsert();
//         const after = document.getElementById('db-tbody')?.innerHTML || '';
//         if (before !== after) throw new Error('La tabla cambió aunque el nombre estaba vacío — BUG');
//         return 'Validación correcta: sin nombre vacío no se escribe en Firestore.';
//       }
//     },
//     {
//       id: 'U-DB-03', ms: 'Firebase', tipo: 'Unitaria',
//       titulo: 'dbLoadAll() actualiza contador de docs',
//       quien: 'Tester Backend', cuando: 'Sprint 1', donde: 'Navegador',
//       servicio: 'database.js → dbLoadAll()',
//       ejecutar: async () => {
//         if (typeof dbLoadAll !== 'function') throw new Error('dbLoadAll no está definida');
//         await dbLoadAll();
//         const count = document.getElementById('db-count')?.textContent;
//         const status = document.getElementById('fb-status')?.textContent;
//         if (!status || status === 'Error') throw new Error('Firebase reportó error: ' + status);
//         return `Cargados ${count} documentos. Status: ${status}`;
//       }
//     },
//     // ── APPLE MUSIC ─────────────────────────────────────────
//     {
//       id: 'U-AM-01', ms: 'Apple Music', tipo: 'Unitaria',
//       titulo: 'Búsqueda "Bad Bunny" retorna resultados',
//       quien: 'Tester Frontend', cuando: 'Sprint 1', donde: 'Navegador',
//       servicio: 'ecommerce.js → amSearch()',
//       ejecutar: async () => {
//         const input = document.getElementById('am-search');
//         if (!input) throw new Error('am-search no existe en DOM');
//         input.value = 'Bad Bunny';
//         await amSearch();
//         await new Promise(r => setTimeout(r, 1500));
//         const count = document.getElementById('am-count')?.textContent || '';
//         if (count.includes('0')) throw new Error('Búsqueda retornó 0 resultados');
//         return 'Resultados obtenidos: ' + count;
//       }
//     },
//     {
//       id: 'U-AM-02', ms: 'Apple Music', tipo: 'Unitaria',
//       titulo: 'Búsqueda vacía dispara amLoadTop()',
//       quien: 'Tester QA', cuando: 'Sprint 1', donde: 'Navegador',
//       servicio: 'ecommerce.js → amSearch() con input vacío',
//       ejecutar: async () => {
//         const input = document.getElementById('am-search');
//         if (!input) throw new Error('am-search no existe');
//         input.value = '';
//         await amSearch();
//         await new Promise(r => setTimeout(r, 1500));
//         const count = document.getElementById('am-count')?.textContent || '';
//         return 'amLoadTop() ejecutado. Resultados: ' + count;
//       }
//     },
//     {
//       id: 'U-AM-03', ms: 'Apple Music', tipo: 'Unitaria',
//       titulo: 'amSetType cambia tab activo visualmente',
//       quien: 'Tester Frontend', cuando: 'Sprint 1', donde: 'Navegador',
//       servicio: 'ecommerce.js → amSetType()',
//       ejecutar: async () => {
//         amSetType('album', 'music');
//         await new Promise(r => setTimeout(r, 200));
//         const tab = document.getElementById('am-tab-album');
//         if (!tab) throw new Error('am-tab-album no existe en DOM');
//         const isActive = tab.classList.contains('active');
//         amSetType('song', 'music');
//         if (!isActive) throw new Error('Tab album no recibió clase active — BUG visual');
//         return 'Tab album recibió clase active. Restaurado a song.';
//       }
//     },
//     // ── ITUNES STORE ────────────────────────────────────────
//     {
//       id: 'U-ST-01', ms: 'iTunes Store', tipo: 'Unitaria',
//       titulo: 'storeSearch() retorna resultados',
//       quien: 'Tester Frontend', cuando: 'Sprint 2', donde: 'Navegador',
//       servicio: 'streaming.js → storeSearch()',
//       ejecutar: async () => {
//         const input = document.getElementById('store-search');
//         if (!input) throw new Error('store-search no existe en DOM');
//         input.value = 'Coldplay';
//         await storeSearch();
//         await new Promise(r => setTimeout(r, 1500));
//         const count = document.getElementById('store-count')?.textContent;
//         if (count === '0' || count === '...') throw new Error('Sin resultados en iTunes Store');
//         return 'iTunes Store retornó ' + count + ' resultados.';
//       }
//     },
//     {
//       id: 'U-ST-02', ms: 'iTunes Store', tipo: 'Unitaria',
//       titulo: 'Búsqueda sin texto no hace fetch',
//       quien: 'Tester QA', cuando: 'Sprint 2', donde: 'Navegador',
//       servicio: 'streaming.js → storeSearch() guard clause',
//       ejecutar: async () => {
//         const input = document.getElementById('store-search');
//         if (!input) throw new Error('store-search no existe');
//         input.value = '';
//         const before = document.getElementById('store-list')?.innerHTML || '';
//         await storeSearch();
//         const after = document.getElementById('store-list')?.innerHTML || '';
//         if (before !== after) throw new Error('Lista cambió con término vacío — posible fetch innecesario');
//         return 'Guard clause funciona: sin término vacío, no hay fetch.';
//       }
//     },
//     // ── GEOLOCALIZACIÓN ─────────────────────────────────────
//     {
//       id: 'U-GEO-01', ms: 'Geolocalización', tipo: 'Unitaria',
//       titulo: 'Mapa inicializa centrado en Saltillo',
//       quien: 'Tester Frontend', cuando: 'Sprint 1', donde: 'Navegador',
//       servicio: 'geolocation.js → initMap()',
//       ejecutar: async () => {
//         const lat = document.getElementById('disp-lat')?.textContent;
//         const lon = document.getElementById('disp-lon')?.textContent;
//         const mapEl = document.getElementById('leaflet-map');
//         if (!mapEl) throw new Error('leaflet-map no existe en DOM');
//         if (!lat || !lon) throw new Error('Coordenadas no visibles en DOM');
//         if (!lat.startsWith('25')) throw new Error(`LAT esperada ~25.55, obtenida: ${lat}`);
//         return `Mapa activo. Coordenadas: ${lat}, ${lon}`;
//       }
//     },
//     {
//       id: 'U-GEO-02', ms: 'Geolocalización', tipo: 'Unitaria',
//       titulo: 'Búsqueda por texto llama a Nominatim',
//       quien: 'Tester QA', cuando: 'Sprint 2', donde: 'Navegador',
//       servicio: 'geolocation.js → geoFilter(q)',
//       ejecutar: async () => {
//         if (typeof geoFilter !== 'function') throw new Error('geoFilter no está definida');
//         await geoFilter('plaza');
//         await new Promise(r => setTimeout(r, 2000));
//         return 'geoFilter("plaza") ejecutado. Verifica marcadores en el mapa.';
//       }
//     },
//     // ── SMS ─────────────────────────────────────────────────
//     {
//       id: 'U-SMS-01', ms: 'SMS', tipo: 'Unitaria',
//       titulo: 'Envío con teléfono y mensaje válidos',
//       quien: 'Tester QA', cuando: 'Sprint 2', donde: 'Navegador',
//       servicio: 'sms.js → smsSend()',
//       ejecutar: async () => {
//         document.getElementById('sms-phone').value = '+528441234567';
//         document.getElementById('sms-msg').value = 'Prueba automatizada U-SMS-01';
//         smsSend();
//         await new Promise(r => setTimeout(r, 1500));
//         const count = parseInt(document.getElementById('sms-count')?.textContent || '0');
//         if (count < 1) throw new Error('Contador sms-count no incrementó');
//         return `SMS enviado. Contador actual: ${count}`;
//       }
//     },
//     {
//       id: 'U-SMS-02', ms: 'SMS', tipo: 'Unitaria',
//       titulo: 'Sin teléfono → toast de error, no crea burbuja',
//       quien: 'Tester QA', cuando: 'Sprint 1', donde: 'Navegador',
//       servicio: 'sms.js → smsSend() validación',
//       ejecutar: async () => {
//         document.getElementById('sms-phone').value = '';
//         document.getElementById('sms-msg').value = 'Mensaje de prueba';
//         const before = document.getElementById('sms-count')?.textContent;
//         smsSend();
//         await new Promise(r => setTimeout(r, 500));
//         const after = document.getElementById('sms-count')?.textContent;
//         if (before !== after) throw new Error('Contador cambió sin teléfono — BUG');
//         return 'Validación correcta: sin teléfono no se envía SMS.';
//       }
//     },
//     {
//       id: 'U-SMS-03', ms: 'SMS', tipo: 'Unitaria',
//       titulo: 'Contador de caracteres funciona (>140 → naranja)',
//       quien: 'Tester Frontend', cuando: 'Sprint 1', donde: 'Navegador',
//       ejecutar: async () => {
//         const ta = document.getElementById('sms-msg');
//         const chars = document.getElementById('sms-chars');
//         if (!ta || !chars) throw new Error('Elementos sms-msg/sms-chars no existen');
//         ta.value = 'A'.repeat(145);
//         ta.dispatchEvent(new Event('input'));
//         await new Promise(r => setTimeout(r, 200));
//         const color = chars.style.color;
//         if (color !== 'rgb(249, 115, 22)' && color !== '#f97316') throw new Error('Color no cambió a naranja con >140 chars. Color actual: ' + color);
//         ta.value = '';
//         ta.dispatchEvent(new Event('input'));
//         return 'Contador correcto. Color naranja activado a los 140 caracteres.';
//       }
//     },
//     // ── REDDIT ──────────────────────────────────────────────
//     {
//       id: 'U-RD-01', ms: 'Reddit', tipo: 'Unitaria',
//       titulo: 'r/mexico carga posts correctamente',
//       quien: 'Tester QA', cuando: 'Sprint 2', donde: 'Navegador',
//       servicio: 'social.js → rdLoad()',
//       ejecutar: async () => {
//         if (typeof rdLoad !== 'function') throw new Error('rdLoad no está definida');
//         await rdLoad('mexico', 'hot');
//         await new Promise(r => setTimeout(r, 2500));
//         const count = document.getElementById('rd-count')?.textContent;
//         const badge = document.getElementById('rd-status-badge')?.textContent || '';
//         if (badge.includes('Error')) throw new Error('Badge muestra Error — posible fallo de corsproxy');
//         return `Feed cargado. Posts: ${count}. Estado: ${badge}`;
//       }
//     },
//     {
//       id: 'U-RD-02', ms: 'Reddit', tipo: 'Unitaria',
//       titulo: 'Subreddit inválido muestra badge Error',
//       quien: 'Tester QA', cuando: 'Sprint 2', donde: 'Navegador',
//       servicio: 'social.js → rdLoad() manejo de errores',
//       ejecutar: async () => {
//         await rdLoad('xkzqwertysubreddit999abc', 'hot');
//         await new Promise(r => setTimeout(r, 3000));
//         const badge = document.getElementById('rd-status-badge')?.textContent || '';
//         if (!badge.includes('Error') && !badge.includes('Live')) {
//           return 'Estado ambiguo: ' + badge + ' (el proxy pudo redirigir)';
//         }
//         return 'Respuesta al subreddit inválido: ' + badge;
//       }
//     },
//   ],

//   integracion: [
//     {
//       id: 'I-01', ms: ['Firebase', 'UI'],
//       titulo: 'INSERT → tabla se actualiza sin recargar',
//       quien: 'Tester QA', cuando: 'Sprint 2', donde: 'Navegador + Firestore console',
//       servicio: 'database.js ↔ DOM tabla',
//       ejecutar: async () => {
//         const before = document.getElementById('db-count')?.textContent;
//         document.getElementById('db-nombre').value = '__INTEG_TEST__';
//         document.getElementById('db-valor').value = 'integracion';
//         await dbInsert();
//         await new Promise(r => setTimeout(r, 1500));
//         const after = document.getElementById('db-count')?.textContent;
//         const tbody = document.getElementById('db-tbody')?.innerHTML || '';
//         if (!tbody.includes('__INTEG_TEST__')) throw new Error('Dato insertado no apareció en la tabla DOM');
//         return `Docs antes: ${before} → después: ${after}. Dato visible en tabla.`;
//       }
//     },
//     {
//       id: 'I-02', ms: ['Apple Music', 'Audio'],
//       titulo: 'Detail activa reproductor, volver lo detiene',
//       quien: 'Tester Frontend', cuando: 'Sprint 2', donde: 'Navegador con audio',
//       servicio: 'ecommerce.js ↔ am-audio',
//       ejecutar: async () => {
//         const input = document.getElementById('am-search');
//         input.value = 'Bad Bunny';
//         await amSearch();
//         await new Promise(r => setTimeout(r, 2000));
//         const items = document.querySelectorAll('.am-item');
//         if (items.length === 0) throw new Error('No hay items en la lista para probar');
//         items[0].click();
//         await new Promise(r => setTimeout(r, 500));
//         const detailHidden = document.getElementById('am-detail')?.classList.contains('hidden');
//         if (detailHidden) throw new Error('Vista detalle no apareció al hacer click');
//         amBackToList();
//         await new Promise(r => setTimeout(r, 300));
//         const audio = document.getElementById('am-audio');
//         if (audio && !audio.paused) throw new Error('Audio sigue reproduciendo después de volver — BUG');
//         return 'Detalle apareció al click. Audio detenido al volver a lista.';
//       }
//     },
//     {
//       id: 'I-03', ms: ['iTunes Store', 'Audio'],
//       titulo: 'storeBackToList() detiene audio',
//       quien: 'Tester QA', cuando: 'Sprint 2', donde: 'Navegador',
//       servicio: 'streaming.js ↔ store-audio',
//       ejecutar: async () => {
//         storeBackToList();
//         await new Promise(r => setTimeout(r, 300));
//         const audio = document.getElementById('store-audio');
//         if (!audio) throw new Error('store-audio no existe en DOM');
//         if (!audio.paused) throw new Error('store-audio sigue activo después de storeBackToList() — BUG');
//         const listDisplay = document.getElementById('store-list')?.style.display;
//         if (listDisplay === 'none') throw new Error('store-list sigue oculto');
//         return 'Audio detenido. store-list visible. Integración correcta.';
//       }
//     },
//     {
//       id: 'I-04', ms: ['Toast', 'Todos los MS'],
//       titulo: 'Toast global funciona en todos los microservicios',
//       quien: 'Tester QA', cuando: 'Sprint 1', donde: 'Navegador',
//       servicio: 'app.js → toast()',
//       ejecutar: async () => {
//         if (typeof toast !== 'function') throw new Error('toast() no está definida globalmente');
//         const toastEl = document.getElementById('toast');
//         if (!toastEl) throw new Error('#toast no existe en DOM');
//         toast('Prueba de integración toast ✅', '#10b981');
//         await new Promise(r => setTimeout(r, 300));
//         if (!toastEl.classList.contains('show')) throw new Error('Toast no recibió clase .show');
//         return 'toast() funciona globalmente. Clase .show aplicada correctamente.';
//       }
//     },
//     {
//       id: 'I-05', ms: ['Reddit', 'Tabs Sort'],
//       titulo: 'Cambio de sort limpia feed y recarga',
//       quien: 'Tester Frontend', cuando: 'Sprint 2', donde: 'Navegador',
//       servicio: 'social.js → rdSetSort()',
//       ejecutar: async () => {
//         await rdLoad('mexico', 'hot');
//         await new Promise(r => setTimeout(r, 2500));
//         const hotPosts = document.querySelectorAll('.rd-post').length;
//         rdSetSort('new');
//         await new Promise(r => setTimeout(r, 2500));
//         const newPosts = document.querySelectorAll('.rd-post').length;
//         const tab = document.getElementById('rd-sort-new');
//         if (!tab?.classList.contains('active')) throw new Error('Tab new no quedó activo');
//         return `HOT: ${hotPosts} posts → NEW: ${newPosts} posts. Tab activo correcto.`;
//       }
//     },
//   ],

//   ui: [
//     {
//       id: 'UI-01', ms: 'Apple Music',
//       titulo: 'Tabs AM cambian clase active correctamente',
//       pantalla: 'Panel Apple Music',
//       quien: 'Tester UI', cuando: 'Sprint 1',
//       ejecutar: async () => {
//         amSetType('album', 'music');
//         await new Promise(r => setTimeout(r, 200));
//         const albumTab = document.getElementById('am-tab-album');
//         if (!albumTab?.classList.contains('active')) throw new Error('Tab album sin clase active');
//         const songTab = document.getElementById('am-tab-song');
//         if (songTab?.classList.contains('active')) throw new Error('Tab song no perdió active');
//         amSetType('song', 'music');
//         return 'Tabs AM: clase active se mueve correctamente entre botones.';
//       }
//     },
//     {
//       id: 'UI-02', ms: 'Reddit',
//       titulo: 'Tabs sort cambian estado visual',
//       pantalla: 'Panel Reddit',
//       quien: 'Tester UI', cuando: 'Sprint 2',
//       ejecutar: async () => {
//         rdSetSort('top');
//         await new Promise(r => setTimeout(r, 300));
//         const topTab = document.getElementById('rd-sort-top');
//         if (!topTab?.classList.contains('active')) throw new Error('rd-sort-top no recibió clase active');
//         rdSetSort('hot');
//         return 'Tab sort se activa y desactiva correctamente.';
//       }
//     },
//     {
//       id: 'UI-03', ms: 'Firebase',
//       titulo: 'Tabla muestra botón ✕ por cada fila',
//       pantalla: 'Panel Firebase',
//       quien: 'Tester UI', cuando: 'Sprint 1',
//       ejecutar: async () => {
//         await dbLoadAll();
//         await new Promise(r => setTimeout(r, 1000));
//         const rows = document.querySelectorAll('#db-tbody tr');
//         const btns = document.querySelectorAll('#db-tbody button');
//         if (rows.length > 1 && btns.length === 0) throw new Error('Hay filas pero ningún botón ✕ de eliminar');
//         return `Tabla con ${rows.length} fila(s) y ${btns.length} botón(es) de eliminar.`;
//       }
//     },
//     {
//       id: 'UI-04', ms: 'SMS',
//       titulo: 'Campo SMS limita a 160 chars y muestra contador',
//       pantalla: 'Panel SMS',
//       quien: 'Tester UI', cuando: 'Sprint 1',
//       ejecutar: async () => {
//         const ta = document.getElementById('sms-msg');
//         const chars = document.getElementById('sms-chars');
//         if (!ta || !chars) throw new Error('sms-msg o sms-chars no existen');
//         ta.value = 'X'.repeat(200);
//         ta.dispatchEvent(new Event('input'));
//         await new Promise(r => setTimeout(r, 100));
//         if (ta.value.length > 160) throw new Error(`Texto no truncado. Longitud: ${ta.value.length}`);
//         if (!chars.textContent.startsWith('160')) throw new Error('Contador no muestra 160: ' + chars.textContent);
//         ta.value = '';
//         ta.dispatchEvent(new Event('input'));
//         return 'Truncado correcto a 160 chars. Contador actualizado.';
//       }
//     },
//     {
//       id: 'UI-05', ms: 'Geolocalización',
//       titulo: 'Elementos de mapa existen en DOM',
//       pantalla: 'Panel Geolocalización',
//       quien: 'Tester UI', cuando: 'Sprint 1',
//       ejecutar: async () => {
//         const map = document.getElementById('leaflet-map');
//         const lat = document.getElementById('disp-lat');
//         const lon = document.getElementById('disp-lon');
//         const acc = document.getElementById('disp-acc');
//         const missing = [];
//         if (!map) missing.push('leaflet-map');
//         if (!lat) missing.push('disp-lat');
//         if (!lon) missing.push('disp-lon');
//         if (!acc) missing.push('disp-acc');
//         if (missing.length) throw new Error('Elementos faltantes en DOM: ' + missing.join(', '));
//         const leafletContainer = map.querySelector('.leaflet-container');
//         if (!leafletContainer) throw new Error('Leaflet no inicializó dentro de #leaflet-map');
//         return 'Todos los elementos del mapa existen. Leaflet inicializado.';
//       }
//     },
//   ],
// };

// // ── Caja Blanca / Negra (análisis estático + tests de borde) ──
// const CAJA_TESTS = {
//   blanca: [
//     {
//       id: 'CB-DB-01', ms: 'Firebase', caso: 'Guard clause nombre vacío en dbInsert',
//       ruta: 'dbInsert → if(!nombre) → toast + return',
//       ejecutar: async () => {
//         // Inyectamos nombre vacío y verificamos que addDoc no es llamado
//         const campo = document.getElementById('db-nombre');
//         campo.value = '';
//         const countBefore = parseInt(document.getElementById('db-count')?.textContent || '0');
//         await dbInsert();
//         await new Promise(r => setTimeout(r, 800));
//         const countAfter = parseInt(document.getElementById('db-count')?.textContent || '0');
//         if (countAfter > countBefore) throw new Error('addDoc fue llamado con nombre vacío — guard clause no funciona');
//         return `Guard clause OK. Docs antes: ${countBefore}, después: ${countAfter}`;
//       }
//     },
//     {
//       id: 'CB-AM-01', ms: 'Apple Music', caso: 'amSetType actualiza variables globales amEntity y amMedia',
//       ruta: 'amSetType(entity,media) → amEntity=entity; amMedia=media',
//       ejecutar: async () => {
//         amSetType('album', 'music');
//         await new Promise(r => setTimeout(r, 100));
//         // No podemos leer las vars directamente, pero verificamos el tab
//         const tab = document.getElementById('am-tab-album');
//         if (!tab?.classList.contains('active')) throw new Error('amEntity no cambió visualmente');
//         amSetType('song', 'music');
//         return 'Variables globales amEntity/amMedia se reflejan en el tab activo.';
//       }
//     },
//     {
//       id: 'CB-SMS-01', ms: 'SMS', caso: 'Historial SMS se limita a 15 burbujas (while loop)',
//       ruta: 'smsSend → inbox.prepend(bubble) → while(children.length > 15) removeChild',
//       ejecutar: async () => {
//         document.getElementById('sms-phone').value = '+521234567890';
//         for (let i = 0; i < 17; i++) {
//           document.getElementById('sms-msg').value = `Mensaje de prueba #${i + 1}`;
//           smsSend();
//           await new Promise(r => setTimeout(r, 100));
//         }
//         await new Promise(r => setTimeout(r, 1600));
//         const inbox = document.getElementById('sms-inbox');
//         if (!inbox) throw new Error('sms-inbox no existe');
//         const count = inbox.children.length;
//         if (count > 15) throw new Error(`Historial tiene ${count} elementos — límite de 15 no funciona`);
//         return `Historial limitado a ${count} burbujas (máx 15). While loop funciona.`;
//       }
//     },
//     {
//       id: 'CB-ST-01', ms: 'iTunes Store', caso: 'BUG: price-range con array vacío da Infinity',
//       ruta: 'storeSearch → precios.filter(p=>p>0) → si vacío → Math.min([]) = Infinity',
//       ejecutar: async () => {
//         // Buscamos algo que sea tipicamente gratis
//         const input = document.getElementById('store-search');
//         if (!input) throw new Error('store-search no existe');
//         input.value = 'free podcast';
//         storeSetType('podcast');
//         await new Promise(r => setTimeout(r, 2500));
//         const priceRange = document.getElementById('store-price-range')?.textContent || '';
//         if (priceRange.includes('Infinity')) throw new Error('BUG CONFIRMADO: price-range muestra "Infinity" cuando todos los ítems son gratis');
//         return `price-range muestra: "${priceRange}". ${priceRange === 'Gratis' ? 'Guard clause funciona.' : 'Revisar si hay precios válidos.'}`;
//       }
//     },
//   ],
//   negra: [
//     {
//       id: 'CN-DB-01', ms: 'Firebase',
//       entrada: 'nombre="Ana", valor="100"',
//       esperado: 'Nuevo registro en tabla, status Verde',
//       ejecutar: async () => {
//         document.getElementById('db-nombre').value = 'Ana_CN_Test';
//         document.getElementById('db-valor').value = '100';
//         await dbInsert();
//         await new Promise(r => setTimeout(r, 1500));
//         const tbody = document.getElementById('db-tbody')?.innerHTML || '';
//         if (!tbody.includes('Ana_CN_Test')) throw new Error('Dato no apareció en tabla');
//         return 'Entrada válida → registro visible en tabla UI.';
//       }
//     },
//     {
//       id: 'CN-AM-01', ms: 'Apple Music',
//       entrada: '"xkzqwerty999" — sin resultados esperados',
//       esperado: 'Lista vacía, contador en 0 resultado(s)',
//       ejecutar: async () => {
//         document.getElementById('am-search').value = 'xkzqwerty999noexiste';
//         await amSearch();
//         await new Promise(r => setTimeout(r, 2000));
//         const count = document.getElementById('am-count')?.textContent || '';
//         if (!count.includes('0')) throw new Error(`Esperaba 0 resultados, obtuvo: ${count}`);
//         return 'Sin resultados → contador en 0. Comportamiento correcto.';
//       }
//     },
//     {
//       id: 'CN-GEO-01', ms: 'Geolocalización',
//       entrada: 'Búsqueda vacía en geoSearch()',
//       esperado: 'Sin fetch a Nominatim, sin cambios en el mapa',
//       ejecutar: async () => {
//         const input = document.getElementById('geo-input');
//         if (!input) throw new Error('geo-input no existe');
//         input.value = '';
//         const latBefore = document.getElementById('disp-lat')?.textContent;
//         geoSearch();
//         await new Promise(r => setTimeout(r, 1000));
//         const latAfter = document.getElementById('disp-lat')?.textContent;
//         if (latBefore !== latAfter) throw new Error('Coordenadas cambiaron con búsqueda vacía — posible BUG');
//         return 'Búsqueda vacía ignorada. Coordenadas sin cambios. Guard clause activo.';
//       }
//     },
//     {
//       id: 'CN-RD-01', ms: 'Reddit',
//       entrada: 'rdExpand(-1) — índice fuera de rango',
//       esperado: 'Función termina sin error (guard if(!p))',
//       ejecutar: async () => {
//         try {
//           rdExpand(-1);
//           rdExpand(9999);
//           return 'rdExpand(-1) y rdExpand(9999) manejados. Guard if(!p) activo.';
//         } catch (e) {
//           throw new Error('rdExpand sin índice válido lanzó excepción no controlada: ' + e.message);
//         }
//       }
//     },
//   ],
// };

// // ── Runner ───────────────────────────────────────────────────

// const testResults = {};

// async function runTest(test, resultContainer) {
//   const startTime = Date.now();
//   resultContainer.className = 'tp-result tp-running';
//   resultContainer.textContent = '⏳ Ejecutando...';

//   try {
//     const msg = await test.ejecutar();
//     const elapsed = Date.now() - startTime;
//     resultContainer.className = 'tp-result tp-pass';
//     resultContainer.textContent = `✓ PASÓ (${elapsed}ms) — ${msg}`;
//     testResults[test.id] = { status: 'pass', msg, elapsed };
//   } catch (e) {
//     const elapsed = Date.now() - startTime;
//     resultContainer.className = 'tp-result tp-fail';
//     resultContainer.textContent = `✗ FALLÓ (${elapsed}ms) — ${e.message}`;
//     testResults[test.id] = { status: 'fail', msg: e.message, elapsed };
//   }
//   updateSummary();
// }

// async function runAllOfType(type) {
//   let tests = [];
//   if (type === 'unit') tests = TEST_SUITE.unitarias;
//   else if (type === 'integ') tests = TEST_SUITE.integracion;
//   else if (type === 'ui') tests = TEST_SUITE.ui;
//   else if (type === 'blanca') tests = CAJA_TESTS.blanca;
//   else if (type === 'negra') tests = CAJA_TESTS.negra;
//   for (const t of tests) {
//     const rc = document.getElementById('res-' + t.id);
//     if (rc) await runTest(t, rc);
//     await new Promise(r => setTimeout(r, 400));
//   }
// }

// async function runAllTests() {
//   for (const type of ['unit', 'integ', 'ui', 'blanca', 'negra']) {
//     await runAllOfType(type);
//     await new Promise(r => setTimeout(r, 300));
//   }
// }

// function updateSummary() {
//   const all = Object.values(testResults);
//   const pass = all.filter(r => r.status === 'pass').length;
//   const fail = all.filter(r => r.status === 'fail').length;
//   const total = all.length;
//   const el = document.getElementById('tp-summary');
//   if (!el) return;
//   const pct = total ? Math.round(pass / total * 100) : 0;
//   el.innerHTML = `
//     <span style="color:#10b981;font-weight:700">${pass} ✓</span>
//     <span style="color:#ef4444;font-weight:700">${fail} ✗</span>
//     <span style="color:#64748b">${total} total</span>
//     <span style="background:${pct >= 80 ? '#dcfce7' : pct >= 50 ? '#fef3c7' : '#fee2e2'};color:${pct >= 80 ? '#15803d' : pct >= 50 ? '#b45309' : '#b91c1c'};padding:1px 8px;border-radius:20px;font-size:.7rem;font-weight:700">${pct}%</span>
//   `;
// }

// function generateReport() {
//   const all = Object.values(testResults);
//   if (!all.length) { toast('Ejecuta pruebas primero', '#ef4444'); return; }
//   const pass = all.filter(r => r.status === 'pass').length;
//   const fail = all.filter(r => r.status === 'fail').length;
//   const lines = [
//     `REPORTE DE PRUEBAS — API Mashup Dashboard`,
//     `Fecha: ${new Date().toLocaleString('es-MX')}`,
//     `Tester: Estudiante (Dashboard integrado)`,
//     `─────────────────────────────────────`,
//     `RESUMEN: ${pass} pasaron / ${fail} fallaron / ${all.length} total`,
//     `─────────────────────────────────────`,
//     ...Object.entries(testResults).map(([id, r]) =>
//       `[${r.status.toUpperCase().padEnd(4)}] ${id.padEnd(12)} ${r.elapsed}ms — ${r.msg}`
//     ),
//     `─────────────────────────────────────`,
//     `Criterio de aceptación: ≥80% para aprobar el sprint`,
//     `Estado: ${Math.round(pass / all.length * 100) >= 80 ? '✓ APROBADO' : '✗ REQUIERE CORRECCIONES'}`,
//   ];
//   const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
//   const a = document.createElement('a');
//   a.href = URL.createObjectURL(blob);
//   a.download = `reporte_pruebas_${Date.now()}.txt`;
//   a.click();
//   toast('Reporte descargado ✅', '#10b981');
// }

// window.runTest = runTest;
// window.runAllOfType = runAllOfType;
// window.runAllTests = runAllTests;
// window.generateReport = generateReport;
// window.TEST_SUITE = TEST_SUITE;
// window.CAJA_TESTS = CAJA_TESTS;