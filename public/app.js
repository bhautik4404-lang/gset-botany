const statusEl = document.getElementById('status');
const appEl = document.getElementById('app');

function setStatus(text) { statusEl.textContent = text; }

async function loadAndRender() {
  setStatus('Fetching data…');
  try {
    const res = await fetch('/api/data', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch data.json');
    const json = await res.json();
    render(json);
    setStatus('Data loaded — listening for updates');
  } catch (err) {
    setStatus('Error loading data: ' + err.message);
    appEl.innerHTML = '<pre style="color:red;">Failed to load data.json. Put a valid file named data.json in the project root.</pre>';
  }
}

function render(data) {
  if (!data || !Array.isArray(data.topics)) {
    appEl.innerHTML = '<p>No topics found in data (expected "topics" array).</p>';
    return;
  }
  const parts = [];
  data.topics.forEach(topic => {
    parts.push(`<section class="topic"><h2>${escapeHtml(topic.name||topic.id||'Unnamed topic')}</h2>`);
    if (Array.isArray(topic.subtopics)) {
      topic.subtopics.forEach(sub => {
        parts.push(`<div class="subtopic"><h3>${escapeHtml(sub.name||sub.id)}</h3>`);
        if (Array.isArray(sub.mcqs)) {
          sub.mcqs.forEach((mcq, idx) => {
            parts.push(`<div class="mcq"><strong>Q${idx+1}.</strong> ${escapeHtml(mcq.q||'')}<ul>`);
            if (Array.isArray(mcq.options)) {
              mcq.options.forEach((opt, i) => {
                parts.push(`<li>${escapeHtml(opt||'')} ${i===mcq.answer ? '<em style="color:green">✔</em>' : ''}</li>`);
              });
            }
            parts.push(`</ul></div>`);
          });
        } else {
          parts.push('<div>No MCQs in this subtopic</div>');
        }
        parts.push('</div>');
      });
    }
    parts.push('</section>');
  });
  appEl.innerHTML = parts.join('');
}

function escapeHtml(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// WebSocket setup
function connectWS() {
  const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  const ws = new WebSocket(`${protocol}://${location.host}`);
  ws.addEventListener('open', () => setStatus('Connected — waiting for data changes'));
  ws.addEventListener('message', ev => {
    try {
      const msg = JSON.parse(ev.data);
      if (msg.type === 'data_updated') {
        setStatus('Change detected — reloading data');
        loadAndRender();
      }
    } catch (e) {
      console.log('ws msg', e);
    }
  });
  ws.addEventListener('close', () => {
    setStatus('Disconnected. Reconnecting in 2s...');
    setTimeout(connectWS, 2000);
  });
  ws.addEventListener('error', () => {
    setStatus('WebSocket error');
    ws.close();
  });
}

window.addEventListener('load', () => {
  loadAndRender();
  connectWS();
});
