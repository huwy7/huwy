// Zugangs-Tor für die Admin-Seiten (/admin und /admin/anordnen).
//
// Gleiche Sperre wie auf der öffentlichen Seite: derselbe Code (SHA-256-Hash) und
// derselbe sessionStorage-Schlüssel — wer die Seite schon entsperrt hat, kommt im
// selben Besuch ohne erneute Eingabe ins Admin und umgekehrt.
//
// WICHTIG (wie bei der Seite): Das ist KEIN echter Schutz, sondern ein Vorhang.
// Die Dateien liegen öffentlich, das Repo ist öffentlich. Der wirkliche Schutz der
// Admin-Funktionen ist der GitHub-Token (Schreiben im Anordnen-Werkzeug) bzw. der
// GitHub-Login (Sveltia) — ohne die kann niemand etwas ändern. Siehe docs/zugang.md.
//
// Das eigentliche Admin-Skript wird erst NACH dem Entsperren geladen (data-laden),
// damit hinter dem Tor nichts läuft und nichts nachlädt.
(() => {
  const TOR_HASH = 'db6b24692506611e2549894ab528b028af27e114f74fabf2fcb2b0e740fe5a04';
  const eigenes = document.currentScript;
  const ziel = eigenes?.dataset.laden;
  const alsModul = eigenes?.dataset.modul === '1';

  const ladeZiel = () => {
    if (!ziel) return;
    const s = document.createElement('script');
    if (alsModul) s.type = 'module';
    s.src = ziel;
    document.body.appendChild(s);
  };

  const sha256 = async (text) => {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
  };

  let frei = false;
  try {
    frei = sessionStorage.getItem('tor') === 'auf';
  } catch (e) {}

  if (frei) {
    // Schon in dieser Sitzung entsperrt: direkt laden.
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', ladeZiel, { once: true });
    } else {
      ladeZiel();
    }
    return;
  }

  const bauen = () => {
    const stil = document.createElement('style');
    stil.textContent = `
      #admin-tor {
        position: fixed;
        inset: 0;
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #0d0d0d;
      }
      #admin-tor form { display: flex; flex-direction: column; align-items: center; gap: 12px; }
      #admin-tor input {
        width: 14ch;
        padding: 8px 16px;
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
        font-size: 16px;
        color: #0d0d0d;
        text-align: center;
        background: #ededed;
        border: none;
        border-radius: 0;
        outline: none;
        caret-color: #0d0d0d;
      }
      #admin-tor .hinweis {
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
        font-size: 12px;
        color: #8a8a8a;
      }
      #admin-tor.falsch input { animation: admin-tor-wackeln 0.4s ease; }
      @keyframes admin-tor-wackeln {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-6px); }
        75% { transform: translateX(6px); }
      }
    `;
    document.head.appendChild(stil);

    const tor = document.createElement('div');
    tor.id = 'admin-tor';
    tor.innerHTML =
      '<form autocomplete="off">' +
      '<input type="password" aria-label="Zugangscode" autocomplete="off" />' +
      '<span class="hinweis">Admin</span>' +
      '</form>';
    document.body.appendChild(tor);

    const feld = tor.querySelector('input');
    if (window.matchMedia('(pointer: fine)').matches) feld.focus();

    tor.querySelector('form').addEventListener('submit', async (e) => {
      e.preventDefault();
      if ((await sha256(feld.value)) === TOR_HASH) {
        try {
          sessionStorage.setItem('tor', 'auf');
        } catch (err) {}
        tor.remove();
        stil.remove();
        ladeZiel();
      } else {
        feld.value = '';
        tor.classList.add('falsch');
        setTimeout(() => tor.classList.remove('falsch'), 400);
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bauen, { once: true });
  } else {
    bauen();
  }
})();
