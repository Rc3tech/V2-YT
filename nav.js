// ─── Global Sidebar Navigation ───────────────────────────────
// Drop <script src="nav.js" defer></script> on any page.
// Injects the ≡ hamburger + slide-in drawer with all sections.
(function () {
  'use strict';

  const LINKS = [
    { href: 'index.html',     icon: '⚡', label: 'Entrada Rápida', key: 'index'    },
    { href: 'main.html',      icon: '🏠', label: 'Metas',          key: 'main'     },
    { href: 'gym.html',       icon: '💪', label: 'Fitness',        key: 'gym'      },
    { href: 'health.html',    icon: '💊', label: 'Saúde',          key: 'health'   },
    { href: 'po-water.html',  icon: '💧', label: 'Água',           key: 'water'    },
    { href: 'finance.html',   icon: '📊', label: 'Finanças',       key: 'finance'  },
    { href: 'caffeine.html',  icon: '☕', label: 'Cafeína',        key: 'caffeine' },
    { href: 'nova-lite.html', icon: '🧠', label: 'Nova IA',        key: 'nova'     },
  ];

  function pageKey() {
    const p = (window.location.pathname || '').toLowerCase();
    if (p.endsWith('main.html'))      return 'main';
    if (p.endsWith('gym.html'))       return 'gym';
    if (p.endsWith('health.html'))    return 'health';
    if (p.endsWith('po-water.html'))  return 'water';
    if (p.endsWith('finance.html'))   return 'finance';
    if (p.endsWith('caffeine.html'))  return 'caffeine';
    if (p.endsWith('nova-lite.html')) return 'nova';
    return 'index';
  }

  const CSS = `
.gnav-btn {
  position: fixed;
  top: max(12px, env(safe-area-inset-top));
  left: 14px;
  z-index: 500;
  width: 40px; height: 40px;
  background: rgba(8,8,10,0.82);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 12px;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 5px; cursor: pointer;
  backdrop-filter: blur(12px);
  transition: background .15s, border-color .15s, transform .1s;
  -webkit-tap-highlight-color: transparent;
}
.gnav-btn:hover  { background: rgba(255,255,255,0.09); border-color: rgba(255,255,255,0.16); }
.gnav-btn:active { transform: scale(0.93); }
.gnav-btn i {
  display: block; width: 17px; height: 1.8px;
  background: rgba(255,255,255,0.80); border-radius: 2px;
  transform-origin: center;
  transition: transform .22s cubic-bezier(.4,0,.2,1), opacity .18s, width .18s;
}
.gnav-btn.open i:nth-child(1) { transform: translateY(6.8px) rotate(45deg); }
.gnav-btn.open i:nth-child(2) { opacity: 0; width: 0; }
.gnav-btn.open i:nth-child(3) { transform: translateY(-6.8px) rotate(-45deg); }

.gnav-veil {
  position: fixed; inset: 0; z-index: 490;
  background: rgba(0,0,0,0.60);
  backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
  opacity: 0; pointer-events: none;
  transition: opacity .28s;
}
.gnav-veil.show { opacity: 1; pointer-events: auto; }

.gnav-panel {
  position: fixed; inset: 0 auto 0 0;
  width: min(300px, 85vw);
  z-index: 495;
  background: linear-gradient(160deg, #0d0d10 0%, #080809 100%);
  border-right: 1px solid rgba(255,255,255,0.07);
  transform: translateX(-100%);
  transition: transform .30s cubic-bezier(.32,.72,0,1);
  display: flex; flex-direction: column;
  padding: max(24px, env(safe-area-inset-top)) 0 max(24px, env(safe-area-inset-bottom));
  box-shadow: 4px 0 40px rgba(0,0,0,0.55);
  overflow-y: auto;
}
.gnav-panel.open { transform: translateX(0); }

.gnav-brand {
  padding: 0 22px 22px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  margin-bottom: 10px;
}
.gnav-brand-orb {
  width: 38px; height: 38px; border-radius: 50%;
  background: radial-gradient(circle at 32% 28%, #e8fff4, #6BE3A4 44%, #1a7f5a 100%);
  box-shadow: 0 0 18px -3px #6BE3A4;
  margin-bottom: 12px;
}
.gnav-brand-name {
  font-size: 17px; font-weight: 800; letter-spacing: -0.025em;
  background: linear-gradient(135deg, #fff 0%, #6BE3A4 120%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent; margin: 0 0 3px;
  font-family: -apple-system, BlinkMacSystemFont, "Inter", sans-serif;
}
.gnav-brand-sub {
  font-size: 10px; letter-spacing: .14em; text-transform: uppercase;
  color: rgba(255,255,255,0.28);
  font-family: ui-monospace, "SF Mono", Menlo, monospace;
  margin: 0;
}

.gnav-section-label {
  font-size: 9.5px; font-weight: 700; letter-spacing: .16em;
  text-transform: uppercase; color: rgba(255,255,255,0.22);
  font-family: ui-monospace, monospace;
  padding: 6px 22px 6px;
  margin-top: 4px;
}

.gnav-list {
  padding: 4px 12px;
  display: flex; flex-direction: column; gap: 2px;
}
.gnav-item {
  display: flex; align-items: center; gap: 12px;
  padding: 11px 12px;
  border-radius: 10px;
  text-decoration: none;
  color: rgba(255,255,255,0.52);
  font-size: 14px; font-weight: 500;
  font-family: -apple-system, BlinkMacSystemFont, "Inter", sans-serif;
  transition: background .14s, color .14s;
  -webkit-tap-highlight-color: transparent;
  position: relative;
}
.gnav-item:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.85); }
.gnav-item.cur {
  background: rgba(107,227,164,0.10);
  color: #6BE3A4;
  border: 1px solid rgba(107,227,164,0.15);
}
.gnav-item.cur::before {
  content: '';
  position: absolute; left: -12px; top: 50%;
  transform: translateY(-50%);
  width: 3px; height: 20px;
  background: #6BE3A4; border-radius: 0 2px 2px 0;
  opacity: 0.8;
}
.gnav-icon { font-size: 19px; width: 26px; text-align: center; flex-shrink: 0; line-height: 1; }
.gnav-lbl  { flex: 1; }

.gnav-footer {
  margin-top: auto;
  padding: 16px 22px 0;
  border-top: 1px solid rgba(255,255,255,0.05);
  font-size: 10px; color: rgba(255,255,255,0.18);
  font-family: ui-monospace, monospace; letter-spacing: .06em;
  text-align: center;
}
`;

  function boot() {
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    const active = pageKey();

    // Veil
    const veil = document.createElement('div');
    veil.className = 'gnav-veil';

    // Panel
    const panel = document.createElement('div');
    panel.className = 'gnav-panel';
    panel.setAttribute('role', 'navigation');
    panel.setAttribute('aria-label', 'Menu principal');
    panel.innerHTML = `
      <div class="gnav-brand">
        <div class="gnav-brand-orb"></div>
        <p class="gnav-brand-name">MINHA VIDA</p>
        <p class="gnav-brand-sub">Painel pessoal</p>
      </div>
      <p class="gnav-section-label">Seções</p>
      <div class="gnav-list">
        ${LINKS.map(l => `
          <a href="${l.href}" class="gnav-item${l.key === active ? ' cur' : ''}">
            <span class="gnav-icon">${l.icon}</span>
            <span class="gnav-lbl">${l.label}</span>
          </a>
        `).join('')}
      </div>
      <div class="gnav-footer">MINHA VIDA · v2</div>
    `;

    // Hamburger button
    const btn = document.createElement('button');
    btn.className = 'gnav-btn';
    btn.setAttribute('aria-label', 'Abrir menu');
    btn.setAttribute('type', 'button');
    btn.innerHTML = '<i></i><i></i><i></i>';

    function openNav()  { btn.classList.add('open'); panel.classList.add('open'); veil.classList.add('show'); document.body.style.overflow = 'hidden'; }
    function closeNav() { btn.classList.remove('open'); panel.classList.remove('open'); veil.classList.remove('show'); document.body.style.overflow = ''; }

    btn.addEventListener('click', () => btn.classList.contains('open') ? closeNav() : openNav());
    veil.addEventListener('click', closeNav);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });

    document.body.appendChild(veil);
    document.body.appendChild(panel);
    document.body.appendChild(btn);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
