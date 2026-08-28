(function () {
  if (!requireAuthOrRedirect()) return;

  const STATUS_ORDER = ['new', 'contacted', 'converted'];

  const tableBody = document.getElementById('leadTableBody');
  const emptyState = document.getElementById('emptyState');
  const searchInput = document.getElementById('searchInput');
  const statusFilter = document.getElementById('statusFilter');
  const userBox = document.getElementById('userBox');

  const drawer = document.getElementById('drawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');

  let currentLeadId = null;
  let searchTimer = null;

  userBox.textContent = localStorage.getItem('crm_username') || '';

  document.getElementById('logoutBtn').addEventListener('click', () => {
    clearSession();
    window.location.href = 'login.html';
  });

  document.getElementById('closeDrawer').addEventListener('click', closeDrawer);
  drawerBackdrop.addEventListener('click', closeDrawer);

  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(loadLeads, 250);
  });
  statusFilter.addEventListener('change', loadLeads);

  document.getElementById('statusActions').addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-status]');
    if (!btn || !currentLeadId) return;
    await updateStatus(currentLeadId, btn.dataset.status);
  });

  document.getElementById('noteForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const textEl = document.getElementById('noteText');
    const text = textEl.value.trim();
    if (!text || !currentLeadId) return;
    try {
      await apiRequest(`/leads/${currentLeadId}/notes`, { method: 'POST', auth: true, body: { text } });
      textEl.value = '';
      const lead = await apiRequest(`/leads/${currentLeadId}`, { auth: true });
      renderNotes(lead.lead.notes);
    } catch (err) {
      alert(err.message);
    }
  });

  document.getElementById('deleteLeadBtn').addEventListener('click', async () => {
    if (!currentLeadId) return;
    if (!confirm('Delete this lead permanently?')) return;
    try {
      await apiRequest(`/leads/${currentLeadId}`, { method: 'DELETE', auth: true });
      closeDrawer();
      loadLeads();
      loadStats();
    } catch (err) {
      alert(err.message);
    }
  });

  async function loadStats() {
    try {
      const data = await apiRequest('/leads/analytics/summary', { auth: true });
      document.getElementById('statTotal').textContent = data.total;
      document.getElementById('statNew').textContent = data.counts.new;
      document.getElementById('statContacted').textContent = data.counts.contacted;
      document.getElementById('statConverted').textContent = data.counts.converted;
    } catch (err) {
      handleAuthError(err);
    }
  }

  async function loadLeads() {
    const params = new URLSearchParams();
    if (statusFilter.value) params.set('status', statusFilter.value);
    if (searchInput.value.trim()) params.set('search', searchInput.value.trim());

    try {
      const data = await apiRequest(`/leads?${params.toString()}`, { auth: true });
      renderTable(data.leads);
    } catch (err) {
      handleAuthError(err);
    }
  }

  function renderTable(leads) {
    tableBody.innerHTML = '';
    emptyState.style.display = leads.length ? 'none' : 'block';

    leads.forEach((lead) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="lead-name">${escapeHtml(lead.name)}</div>
          <div class="lead-email">${escapeHtml(lead.email)}</div>
        </td>
        <td class="lead-source">${escapeHtml(lead.source)}</td>
        <td>${pipelineDots(lead.status)}</td>
        <td><span class="status-badge ${lead.status}">${lead.status}</span></td>
        <td class="lead-date">${formatDate(lead.createdAt)}</td>
      `;
      tr.addEventListener('click', () => openDrawer(lead.id));
      tableBody.appendChild(tr);
    });
  }

  function pipelineDots(status) {
    const idx = STATUS_ORDER.indexOf(status);
    const colorVar = status === 'new' ? '--stage-new' : status === 'contacted' ? '--stage-contacted' : '--stage-converted';
    let html = `<span class="stage-pipeline" style="--stage-dot: var(${colorVar});">`;
    STATUS_ORDER.forEach((s, i) => {
      html += `<span class="dot ${i <= idx ? 'filled' : ''}"></span>`;
      if (i < STATUS_ORDER.length - 1) html += `<span class="bar ${i < idx ? 'filled' : ''}"></span>`;
    });
    html += `</span>`;
    return html;
  }

  async function openDrawer(id) {
    try {
      const data = await apiRequest(`/leads/${id}`, { auth: true });
      const lead = data.lead;
      currentLeadId = lead.id;

      document.getElementById('drawerName').textContent = lead.name;
      const badge = document.getElementById('drawerStatusBadge');
      badge.textContent = lead.status;
      badge.className = `status-badge ${lead.status}`;

      document.getElementById('drawerEmail').textContent = lead.email;
      document.getElementById('drawerPhone').textContent = lead.phone || '—';
      document.getElementById('drawerSource').textContent = lead.source;
      document.getElementById('drawerCreated').textContent = formatDate(lead.createdAt);

      const msgSection = document.getElementById('drawerMessageSection');
      if (lead.message) {
        msgSection.style.display = 'block';
        document.getElementById('drawerMessage').textContent = lead.message;
      } else {
        msgSection.style.display = 'none';
      }

      document.querySelectorAll('#statusActions button').forEach((btn) => {
        btn.className = btn.dataset.status === lead.status ? `active ${lead.status}` : '';
      });

      renderNotes(lead.notes);

      drawer.classList.add('open');
      drawerBackdrop.classList.add('open');
    } catch (err) {
      handleAuthError(err);
    }
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    drawerBackdrop.classList.remove('open');
    currentLeadId = null;
  }

  function renderNotes(notes) {
    const list = document.getElementById('notesList');
    if (!notes || !notes.length) {
      list.innerHTML = '<p style="font-size:13px; color:var(--muted); margin:0 0 10px;">No follow-ups logged yet.</p>';
      return;
    }
    const sorted = [...notes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    list.innerHTML = sorted
      .map(
        (n) => `
        <div class="note-item">
          <div class="note-meta">${escapeHtml(n.author)} · ${formatDate(n.createdAt)}</div>
          <div class="note-text">${escapeHtml(n.text)}</div>
        </div>`
      )
      .join('');
  }

  async function updateStatus(id, status) {
    try {
      await apiRequest(`/leads/${id}/status`, { method: 'PATCH', auth: true, body: { status } });
      const badge = document.getElementById('drawerStatusBadge');
      badge.textContent = status;
      badge.className = `status-badge ${status}`;
      document.querySelectorAll('#statusActions button').forEach((btn) => {
        btn.className = btn.dataset.status === status ? `active ${status}` : '';
      });
      loadLeads();
      loadStats();
    } catch (err) {
      alert(err.message);
    }
  }

  function handleAuthError(err) {
    if (err.status === 401) {
      clearSession();
      window.location.href = 'login.html';
    } else {
      console.error(err);
    }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  loadStats();
  loadLeads();
})();
