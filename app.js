/* ── CONSTANTS ──────────────────────────────────────────────────────────────── */
const STATUS_COLOR = {
  active:       '#0D5C4A',
  discontinued: '#5d6d7e',
  exploring:    '#C8D62A',
  none:         '#B5B2AB'
};

const STATUS_LABEL = {
  active:       'Active AI tools',
  discontinued: 'Discontinued',
  exploring:    'Exploring / pilot',
  unconfirmed:  'Unconfirmed',
  none:         'No tools identified'
};

const TOOL_STATUS_LABEL = {
  active:       'Active',
  discontinued: 'Discontinued',
  exploring:    'Exploring',
  unconfirmed:  'Unconfirmed'
};

/* ── STATE ──────────────────────────────────────────────────────────────────── */
let stateData = {};
let selectedState = null;

/* ── HELPERS ────────────────────────────────────────────────────────────────── */
function getStateColor(name) {
  const d = stateData[name];
  if (!d) return STATUS_COLOR.none;
  return STATUS_COLOR[d.status] || STATUS_COLOR.none;
}

function badgeClass(status) {
  return `status-badge badge-${status || 'none'}`;
}

function toolBadgeClass(status) {
  return `tool-status-badge ts-${status || 'active'}`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ── PANEL RENDERING ────────────────────────────────────────────────────────── */
function renderPanel(name) {
  const d = stateData[name];
  const status  = d ? d.status : 'none';
  const tools   = d ? (d.tools || []) : [];
  const sig     = d ? d.significance : null;
  const acf     = d ? d.acf_home_for_every_child : false;

  // Badges
  const statusBadge = `<span class="${badgeClass(status)}">${STATUS_LABEL[status] || 'No tools identified'}</span>`;
  const acfBadge = acf ? `<span class="acf-badge">🏠 A Home for Every Child</span>` : '';

  // Significance block
  const sigBlock = sig
    ? `<div class="significance-block">${escapeHtml(sig)}</div>`
    : '';

  // Tool cards
  let toolsHTML = '';
  if (!tools || tools.length === 0) {
    toolsHTML = `<p class="no-tool-msg">No AI tools have been identified in public records for <strong>${escapeHtml(name)}</strong>. This may reflect an absence of tools or a gap in available documentation.</p>`;
  } else {
    toolsHTML = tools.map(t => {
      const tStatus = t.status || 'active';
      return `
        <div class="tool-card">
          <div class="tool-header">
            <div class="tool-name">${escapeHtml(t.name)}</div>
            <span class="${toolBadgeClass(tStatus)}">${TOOL_STATUS_LABEL[tStatus] || tStatus}</span>
          </div>
          <div class="tool-meta">
            <div class="meta-item">
              <span class="meta-label">Use type</span>
              <span class="meta-value">${escapeHtml(t.use_type || '—')}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Vendor / built by</span>
              <span class="meta-value">${escapeHtml(t.vendor || '—')}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Year</span>
              <span class="meta-value">${escapeHtml(String(t.year || '—'))}</span>
            </div>
          </div>
          <p class="tool-notes">${escapeHtml(t.notes || '')}</p>
          ${t.source_url ? `<a class="tool-source" href="${escapeHtml(t.source_url)}" target="_blank" rel="noopener">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            ${escapeHtml(t.source_label || 'Source')}
          </a>` : ''}
        </div>`;
    }).join('');
  }

  // Vendor summary strip — collect unique vendors from active tools
  const activeVendors = [...new Set(
    tools
      .filter(t => t.status === 'active' && t.vendor && t.vendor !== 'Unknown' && !t.vendor.toLowerCase().includes('unknown'))
      .map(t => t.vendor.split(' + ')[0].split(' /')[0].split(' (')[0].trim())
  )];

  const vendorStrip = activeVendors.length > 0 ? `
    <div class="vendor-strip">
      <span class="vendor-strip-label">Vendors</span>
      ${activeVendors.map(v => `<span class="vendor-chip">${escapeHtml(v)}</span>`).join('')}
    </div>` : '';

  return `
    <div class="panel-header">
      <div class="panel-state-name">${escapeHtml(name)}</div>
      <div class="panel-badges">
        ${statusBadge}
        ${acfBadge}
      </div>
    </div>
    ${sigBlock}
    <div class="panel-body">${toolsHTML}</div>
    ${vendorStrip}
    <div style="padding:0 1.5rem .9rem">
      <p class="data-note">Data sourced from public records, agency websites, and journalism. Research estimates — not official state determinations. Verify with state agency before use in formal contexts.</p>
    </div>
  `;
}

/* ── SELECT STATE ───────────────────────────────────────────────────────────── */
function selectState(name) {
  selectedState = name;

  d3.selectAll('.state-path')
    .classed('selected', f => f.properties.name === name);

  const defaultEl  = document.getElementById('panel-default');
  const contentEl  = document.getElementById('panel-content');

  defaultEl.style.display = 'none';
  contentEl.style.display = 'block';
  contentEl.innerHTML = renderPanel(name);

  document.getElementById('detail-panel')
    .scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ── MAP INIT ───────────────────────────────────────────────────────────────── */
function initMap(us) {
  const svg        = d3.select('#map-svg');
  const projection = d3.geoAlbersUsa().scale(1100).translate([480, 300]);
  const path       = d3.geoPath(projection);
  const features   = topojson.feature(us, us.objects.states).features;

  svg.selectAll('path')
    .data(features)
    .join('path')
    .attr('class', 'state-path')
    .attr('d', path)
    .attr('fill', d => getStateColor(d.properties.name))
    .attr('aria-label', d => d.properties.name)
    .on('click', (event, d) => {
      const name = d.properties.name;
      if (selectedState === name) return;
      selectState(name);
    });
    svg.selectAll('.stripe-overlay')
    .data(features)
    .join('path')
    .attr('class', 'stripe-overlay')
    .attr('d', path)
    .attr('fill', d => {
      const info = stateData[d.properties.name];
      return info && info.acf_home_for_every_child ? 'url(#stripe-pattern)' : 'none';
    })
    .attr('pointer-events', 'none');
}

/* ── BOOTSTRAP ──────────────────────────────────────────────────────────────── */
Promise.all([
  d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json'),
  fetch('data/states.json').then(r => r.json())
]).then(([us, data]) => {
  stateData = data;
  initMap(us);
}).catch(err => {
  console.error('Failed to load map data:', err);
  document.querySelector('.map-card').insertAdjacentHTML('beforeend',
    '<p style="text-align:center;color:#922B21;padding:1.5rem;font-size:13px;">Map failed to load. Run from a local server or GitHub Pages — not directly from the file system.</p>'
  );
});
