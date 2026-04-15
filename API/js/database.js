import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, addDoc, collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBMczrx-ToUmmPCp6om9mBVAOGobDlD2Gg",
  authDomain: "proyecto1-dbe10.firebaseapp.com",
  projectId: "proyecto1-dbe10",
  storageBucket: "proyecto1-dbe10.firebasestorage.app",
  messagingSenderId: "1095030007068",
  appId: "1:1095030007068:web:4566da5421c3ed5345c6d9",
  measurementId: "G-S6CN0MVZZT"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.guardar = async function() {
  let nombre = document.getElementById("nombre").value;
  await addDoc(collection(db, "usuarios"), {
    nombre: nombre
  });
  alert("Guardado en Firebase 🔥");
}

let fbDocs = [];

function dbLog(msg, color = '#4ade80') { 
  const el = document.getElementById('db-terminal'); 
  if (el) {
    el.innerHTML += `<br><span style="color:${color}">&gt; ${msg}</span>`; 
    el.scrollTop = el.scrollHeight;
    if (el.children.length > 20) {
      while (el.children.length > 20) el.removeChild(el.firstChild);
    }
  }
}

async function dbLoadAll() {
  try {
    const snapshot = await getDocs(collection(db, "usuarios"));
    fbDocs = [];
    snapshot.forEach(doc => {
      fbDocs.push({ id: doc.id, ...doc.data() });
    });
    
    const tb = document.getElementById('db-tbody');
    const countEl = document.getElementById('db-count');
    const fbStatus = document.getElementById('fb-status');
    
    if (countEl) countEl.textContent = fbDocs.length;
    if (fbStatus) {
      fbStatus.textContent = 'Conectado ✓';
      fbStatus.style.color = '#10b981';
    }
    
    if (tb) {
      if (fbDocs.length === 0) {
        tb.innerHTML = '<tr><td colspan="5" class="text-center py-6 text-slate-400 text-xs">Sin registros. Usa GUARDAR.</td></tr>';
      } else {
        tb.innerHTML = fbDocs.map((d, i) => `
          <tr>
            <td class="text-slate-600">${i + 1}</td>
            <td class="font-medium text-amber-700">${d.nombre || '—'}</td>
            <td>${d.valor || '—'}</td>
            <td class="font-mono text-slate-400 text-xs">${d.id.substring(0, 8)}…</td>
            <td><button onclick="dbDelete('${d.id}')" class="text-red-400 hover:text-red-600 text-sm">✕</button></td>
          </tr>
        `).join('');
      }
    }
    
    dbLog(`Cargados ${fbDocs.length} documentos de Firebase`);
  } catch (e) {
    console.error("Error cargando datos:", e);
    const fbStatus = document.getElementById('fb-status');
    if (fbStatus) {
      fbStatus.textContent = 'Error';
      fbStatus.style.color = '#ef4444';
    }
    dbLog('ERROR: ' + e.message, '#f87171');
  }
}

async function dbInsert() {
  const nombre = document.getElementById('db-nombre')?.value.trim();
  const valor = document.getElementById('db-valor')?.value.trim();
  
  if (!nombre) {
    toast('⚠️ Ingresa un nombre', '#ef4444');
    return;
  }
  
  try {
    const docRef = await addDoc(collection(db, "usuarios"), {
      nombre: nombre,
      valor: valor || '',
      timestamp: new Date().toISOString(),
      ciudad: 'Saltillo'
    });
    
    dbLog(`INSERT → ID: ${docRef.id.substring(0, 12)}...`, '#fbbf24');
    
    if (document.getElementById('db-nombre')) document.getElementById('db-nombre').value = '';
    if (document.getElementById('db-valor')) document.getElementById('db-valor').value = '';
    
    toast('Guardado en Firebase ✅', '#10b981');
    await dbLoadAll();
  } catch (e) {
    dbLog('ERROR INSERT: ' + e.message, '#f87171');
    toast('Error: ' + e.message, '#ef4444');
  }
}

async function dbDelete(docId) {
  try {
    await deleteDoc(doc(db, "usuarios", docId));
    dbLog(`DELETE ${docId.substring(0, 8)}...`, '#f87171');
    toast('Eliminado de Firebase', '#ef4444');
    await dbLoadAll();
  } catch (e) {
    dbLog('ERROR DELETE: ' + e.message, '#f87171');
    toast('Error al eliminar', '#ef4444');
  }
}

async function dbDropSelected() {
  if (!confirm('⚠️ ¿Borrar TODOS los registros de Firebase?')) return;
  try {
    await Promise.all(fbDocs.map(d => deleteDoc(doc(db, "usuarios", d.id))));
    dbLog('DROP ALL → colección vaciada', '#f87171');
    toast('Base de datos vaciada', '#ef4444');
    await dbLoadAll();
  } catch (e) {
    dbLog('ERROR DROP: ' + e.message, '#f87171');
    toast('Error al vaciar base de datos', '#ef4444');
  }
}

async function dbSelect() {
  const nombre = document.getElementById('db-key')?.value.trim();
  if (!nombre) {
    const d = await getDocs(collection(db, "usuarios"));
    const count = d.size;
    dbLog(`SELECT * FROM usuarios → ${count} registro(s)`, '#00d4ff');
    return;
  }
  
  const snapshot = await getDocs(collection(db, "usuarios"));
  let encontrado = null;
  snapshot.forEach(doc => {
    if (doc.data().nombre === nombre) {
      encontrado = { id: doc.id, ...doc.data() };
    }
  });
  
  if (encontrado) {
    if (document.getElementById('db-val')) {
      document.getElementById('db-val').value = encontrado.valor || '';
    }
    dbLog(`SELECT WHERE nombre="${nombre}" → "${encontrado.valor || 'sin dato'}"`, '#00d4ff');
    toast(`Usuario encontrado: ${nombre}`, '#fbbf24');
  } else {
    dbLog(`SELECT WHERE nombre="${nombre}" → 0 resultados`, '#ff0080');
    toast('Usuario no encontrado', '#ef4444');
  }
}

function dbScrollTerminal() {
  const el = document.getElementById('db-terminal');
  if (el) el.scrollTop = el.scrollHeight;
}

function dbInit() {
  dbLoadAll();
}

window.dbLoadAll = dbLoadAll;
window.dbInsert = dbInsert;
window.dbDelete = dbDelete;
window.dbDropSelected = dbDropSelected;
window.dbSelect = dbSelect;
window.dbInit = dbInit;
window.dbLog = dbLog;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', dbInit);
} else {
  dbInit();
}

if (typeof window.toast !== 'function') {
  window.toast = function(msg, color) {
    console.log(`[TOAST] ${msg}`);
    const t = document.getElementById('toast');
    if (t) {
      t.textContent = msg;
      t.style.background = color || '#1e293b';
      t.classList.add('show');
      setTimeout(() => t.classList.remove('show'), 3000);
    } else {
      alert(msg);
    }
  };
}