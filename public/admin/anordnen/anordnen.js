// @ts-nocheck
/*
  Anordnen — schlanke Drag-and-Drop-Oberfläche fürs Sortieren der Bilder.
  Ergänzt Sveltia CMS (/admin), ersetzt es nicht: Texte, Metadaten und Uploads
  bleiben in Sveltia; hier wird nur angeordnet, was Sveltia nicht kann —
  Reihenfolge innerhalb einer Serie, Verschieben zwischen Serien, Reihenfolge der
  Serien, Titel/Jahr inline.

  Bewusste Entscheidungen (siehe CLAUDE.md):
  - Reine Vanilla-Datei, keine Dependency (Regel 1). Liegt unter public/admin und
    wird wie Sveltia unverändert durchgereicht; die öffentliche Seite bleibt ohne
    JavaScript (Regel 2 gilt der ausgelieferten Seite, nicht dem Admin-Werkzeug).
  - Zeigen (Lesen) geht ohne Login — das Repo ist öffentlich. Nur Speichern
    braucht einen GitHub-Token (Personal Access Token, einmal einfügen).
  - Flaches Bild-Modell: ein Bild = eine kleine Markdown-Datei mit bild/serie/
    reihenfolge. Anordnen ändert nur serie + reihenfolge (und benennt die Datei
    entsprechend um). Die Bild-Assets selbst werden nie angefasst.
  - Speichern ist EIN atomarer Commit (Git-Data-API: ein neuer Baum, ein Commit,
    ein Ref-Update) — kein Zwischenzustand mit halb umbenannten Dateien.
*/

const REPO = 'huwy7/huwy';
const API = 'https://api.github.com';

// Die zwei Bereiche und ihre Sammlungen (Serien-Metadaten + Bild-Einträge).
const BEREICHE = [
  { id: 'sw', label: 'Schwarzweiss', serieColl: 'serien', bildColl: 'serienbilder' },
  { id: 'farbe', label: 'Farbe', serieColl: 'farbserien', bildColl: 'farbbilder' },
];

const LS_TOKEN = 'huwy-admin-token';
const LS_BRANCH = 'huwy-admin-branch';

const state = {
  // Standard: main = live. Bildänderungen (Reihenfolge/Serien) sollen direkt
  // live gehen — ein falsch sortiertes Bild ist schnell wieder korrigiert.
  branch: localStorage.getItem(LS_BRANCH) || 'main',
  token: localStorage.getItem(LS_TOKEN) || '',
  serien: {}, // bereichId -> [{ slug, titel, jahr, reihenfolge, body, pfad }]
  bilder: {}, // id -> { id, bereichId, bildColl, bild, serie, reihenfolge, pfad, thumb }
  snapshot: '', // Signatur des geladenen Zustands (für „geändert?")
};

// ---------------------------------------------------------------------------
// Hilfen
// ---------------------------------------------------------------------------
const $ = (sel, wurzel = document) => wurzel.querySelector(sel);
const el = (tag, attrs = {}, kinder = []) => {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k.startsWith('data-')) node.setAttribute(k, v);
    else node[k] = v;
  }
  for (const kind of [].concat(kinder)) if (kind) node.append(kind);
  return node;
};

const setzeStatus = (text, art = '') => {
  const s = $('#status');
  s.textContent = text;
  s.className = art;
};

// Pfad relativ zu einem Verzeichnis auflösen (nur ../ und ./), ohne URL-API.
const aufloesen = (verzeichnis, rel) => {
  const teile = (verzeichnis + '/' + rel).split('/');
  const stapel = [];
  for (const t of teile) {
    if (t === '' || t === '.') continue;
    if (t === '..') stapel.pop();
    else stapel.push(t);
  }
  return stapel.join('/');
};

const rawUrl = (pfad) => `https://raw.githubusercontent.com/${REPO}/${state.branch}/${pfad}`;

// Frontmatter der kleinen Dateien parsen (nur einfache key: value-Paare).
const parseFrontmatter = (text) => {
  const treffer = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  const daten = {};
  let body = '';
  if (treffer) {
    for (const zeile of treffer[1].split(/\r?\n/)) {
      const m = zeile.match(/^([\w-]+):\s*(.*)$/);
      if (!m) continue;
      let v = m[2].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      daten[m[1]] = v;
    }
    body = treffer[2].trim();
  }
  return { daten, body };
};

// YAML-Wert sicher schreiben: Zahlen roh, harmlose Strings roh, sonst JSON-Quote.
const yamlWert = (v) => {
  if (typeof v === 'number') return String(v);
  const s = String(v);
  return /^[\w./-]+$/.test(s) ? s : JSON.stringify(s);
};
const frontmatter = (obj, body = '') => {
  const zeilen = Object.entries(obj).map(([k, v]) => `${k}: ${yamlWert(v)}`);
  return `---\n${zeilen.join('\n')}\n---\n${body ? body + '\n' : ''}`;
};

const ghHeaders = (mitToken = false) => {
  const h = { Accept: 'application/vnd.github+json' };
  if (mitToken && state.token) h.Authorization = `Bearer ${state.token}`;
  return h;
};

// ---------------------------------------------------------------------------
// Laden (öffentlich, ohne Token)
// ---------------------------------------------------------------------------
const ladeVerzeichnis = async (coll) => {
  const url = `${API}/repos/${REPO}/contents/src/content/${coll}?ref=${encodeURIComponent(state.branch)}`;
  const res = await fetch(url, { headers: ghHeaders(!!state.token) });
  if (res.status === 404) return []; // Sammlung existiert (noch) nicht
  if (!res.ok) throw new Error(`Verzeichnis ${coll}: HTTP ${res.status}`);
  const liste = await res.json();
  const dateien = liste.filter((e) => e.type === 'file' && e.name.endsWith('.md'));
  return Promise.all(
    dateien.map(async (e) => {
      const t = await (await fetch(e.download_url)).text();
      return { name: e.name, pfad: e.path, ...parseFrontmatter(t) };
    }),
  );
};

const laden = async () => {
  setzeStatus('Lädt …');
  state.serien = {};
  state.bilder = {};
  let lauf = 0;
  for (const b of BEREICHE) {
    const [serienDateien, bildDateien] = await Promise.all([
      ladeVerzeichnis(b.serieColl),
      ladeVerzeichnis(b.bildColl),
    ]);
    state.serien[b.id] = serienDateien
      .map((d) => ({
        slug: d.name.replace(/\.md$/, ''),
        titel: d.daten.titel || '',
        jahr: Number(d.daten.jahr) || new Date().getFullYear(),
        reihenfolge: Number(d.daten.reihenfolge) || 999,
        body: d.body || '',
        pfad: d.pfad,
      }))
      .sort((a, z) => a.reihenfolge - z.reihenfolge);

    for (const d of bildDateien) {
      const dir = `src/content/${b.bildColl}`;
      const id = `img-${lauf++}`;
      state.bilder[id] = {
        id,
        bereichId: b.id,
        bildColl: b.bildColl,
        bild: d.daten.bild,
        serie: d.daten.serie,
        reihenfolge: Number(d.daten.reihenfolge) || 999,
        pfad: d.pfad,
        thumb: rawUrl(aufloesen(dir, d.daten.bild)),
      };
    }
  }
  rendern();
  state.snapshot = signatur();
  setzeStatus('Geladen.', 'ok');
};

// ---------------------------------------------------------------------------
// Rendern
// ---------------------------------------------------------------------------
const bilderDerSerie = (bereichId, slug) =>
  Object.values(state.bilder)
    .filter((x) => x.bereichId === bereichId && x.serie === slug)
    .sort((a, z) => a.reihenfolge - z.reihenfolge);

const rendern = () => {
  const wurzel = $('#board');
  wurzel.textContent = '';
  for (const b of BEREICHE) {
    const serien = state.serien[b.id] || [];
    const bereichSerien = el('div', { class: 'bereich-serien', 'data-bereich': b.id });
    for (const serie of serien) {
      bereichSerien.append(serieSpalte(b, serie));
    }
    wurzel.append(
      el('section', { class: 'bereich' }, [
        el('h2', { class: 'bereich-titel', text: b.label }),
        bereichSerien,
      ]),
    );
  }
  markiereGeaendert();
};

const serieSpalte = (bereich, serie) => {
  const kopf = el('div', { class: 'serie-kopf' }, [
    el('span', { class: 'griff', text: '⠿', title: 'Serie verschieben' }),
    el('input', {
      class: 'titel-feld',
      value: serie.titel,
      'aria-label': 'Titel',
      placeholder: 'Titel',
      oninput: markiereGeaendert,
    }),
    el('input', {
      class: 'jahr-feld',
      value: String(serie.jahr),
      inputMode: 'numeric',
      'aria-label': 'Jahr',
      oninput: markiereGeaendert,
    }),
  ]);
  const liste = el('div', {
    class: 'kachel-liste',
    'data-serie': serie.slug,
    'data-bereich': bereich.id,
  });
  for (const bild of bilderDerSerie(bereich.id, serie.slug)) {
    liste.append(kachel(bild));
  }
  return el('div', { class: 'serie-spalte', 'data-serie': serie.slug }, [kopf, liste]);
};

const kachel = (bild) => {
  const img = el('img', { src: bild.thumb, alt: '', loading: 'lazy', draggable: false });
  img.addEventListener('error', () => card.classList.add('kachel--fehlt'));
  const card = el('div', { class: 'kachel', 'data-id': bild.id, title: bild.bild }, [img]);
  return card;
};

// ---------------------------------------------------------------------------
// Zustand aus dem DOM ableiten (Reihenfolge = Anzeige-Reihenfolge)
// ---------------------------------------------------------------------------
const domZustand = () => {
  const eintraege = { bilder: [], serien: [] };
  for (const b of BEREICHE) {
    const spalten = $(`.bereich-serien[data-bereich="${b.id}"]`)?.querySelectorAll('.serie-spalte') || [];
    spalten.forEach((spalte, si) => {
      const slug = spalte.dataset.serie;
      const titel = $('.titel-feld', spalte).value.trim();
      const jahr = Number($('.jahr-feld', spalte).value) || new Date().getFullYear();
      eintraege.serien.push({ bereichId: b.id, slug, titel, jahr, reihenfolge: si + 1 });
      spalte.querySelectorAll('.kachel').forEach((k, ki) => {
        eintraege.bilder.push({ id: k.dataset.id, slug, reihenfolge: ki + 1 });
      });
    });
  }
  return eintraege;
};

const signatur = () => {
  const z = domZustand();
  return JSON.stringify([
    z.serien.map((s) => [s.bereichId, s.slug, s.titel, s.jahr, s.reihenfolge]),
    z.bilder.map((x) => [x.id, x.slug, x.reihenfolge]),
  ]);
};

const istGeaendert = () => state.snapshot && signatur() !== state.snapshot;
const markiereGeaendert = () => {
  const dirty = istGeaendert();
  $('#speichern').disabled = !dirty || !state.token;
  $('#geaendert').textContent = dirty ? '● ungespeicherte Änderungen' : '';
};

// ---------------------------------------------------------------------------
// Drag & Drop (Pointer-basiert → funktioniert mit Maus UND Touch)
// ---------------------------------------------------------------------------
const ziehbar = ({ zoneSel, itemSel, griffSel, achse }) => {
  let ctx = null;

  const start = (e) => {
    const griff = griffSel ? e.target.closest(griffSel) : null;
    if (griffSel && !griff) return;
    if (!griffSel && e.target.closest('input, button, .griff')) return;
    const item = e.target.closest(itemSel);
    if (!item) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const zone = item.closest(zoneSel);
    // Bereich (sw/farbe) merken: Verschieben ist nur innerhalb desselben Bereichs
    // erlaubt — ein Schwarzweiss-Bild darf nie in eine Farbserie wandern.
    const bereich = item.closest('.bereich-serien')?.dataset.bereich;
    ctx = { item, zone, bereich, startX, startY, aktiv: false, klon: null, platz: null, pointerId: e.pointerId };
    item.setPointerCapture(e.pointerId);
  };

  const bewegen = (e) => {
    if (!ctx || ctx.pointerId !== e.pointerId) return;
    if (!ctx.aktiv) {
      if (Math.hypot(e.clientX - ctx.startX, e.clientY - ctx.startY) < 6) return;
      ctx.aktiv = true;
      const r = ctx.item.getBoundingClientRect();
      ctx.versatzX = ctx.startX - r.left;
      ctx.versatzY = ctx.startY - r.top;
      ctx.klon = ctx.item.cloneNode(true);
      ctx.klon.classList.add('klon');
      ctx.klon.style.width = r.width + 'px';
      ctx.klon.style.height = r.height + 'px';
      document.body.append(ctx.klon);
      ctx.platz = el('div', { class: 'platz' });
      ctx.platz.style.width = r.width + 'px';
      ctx.platz.style.height = r.height + 'px';
      ctx.item.after(ctx.platz);
      ctx.item.classList.add('versteckt');
      document.body.classList.add('zieht');
    }
    ctx.klon.style.left = e.clientX - ctx.versatzX + 'px';
    ctx.klon.style.top = e.clientY - ctx.versatzY + 'px';

    ctx.klon.style.pointerEvents = 'none';
    const unten = document.elementFromPoint(e.clientX, e.clientY);
    const zone = unten?.closest(zoneSel);
    if (!zone) return;
    // Nur Ablagen im selben Bereich zulassen (kein sw ↔ farbe).
    if (zone.dataset.bereich !== ctx.bereich) return;
    const geschwister = [...zone.querySelectorAll(itemSel)].filter(
      (x) => x !== ctx.item && x !== ctx.klon,
    );
    let vor = null;
    for (const g of geschwister) {
      const r = g.getBoundingClientRect();
      if (achse === 'y') {
        if (e.clientY < r.top + r.height / 2) { vor = g; break; }
      } else {
        // Wrap-Raster: gleiche Zeile → nach X, sonst Zeile darunter → davor
        if (e.clientY < r.bottom && e.clientX < r.left + r.width / 2) { vor = g; break; }
      }
    }
    if (vor) zone.insertBefore(ctx.platz, vor);
    else zone.append(ctx.platz);
  };

  const ende = (e) => {
    if (!ctx || ctx.pointerId !== e.pointerId) return;
    const c = ctx;
    ctx = null;
    if (!c.aktiv) return;
    c.platz.replaceWith(c.item);
    c.item.classList.remove('versteckt');
    c.klon.remove();
    document.body.classList.remove('zieht');
    markiereGeaendert();
  };

  const board = $('#board');
  board.addEventListener('pointerdown', start);
  board.addEventListener('pointermove', bewegen);
  board.addEventListener('pointerup', ende);
  board.addEventListener('pointercancel', ende);
};

// ---------------------------------------------------------------------------
// Speichern (ein atomarer Commit via Git-Data-API)
// ---------------------------------------------------------------------------
const gh = async (pfad, opt = {}) => {
  const res = await fetch(`${API}/repos/${REPO}${pfad}`, {
    ...opt,
    headers: { ...ghHeaders(true), 'Content-Type': 'application/json', ...(opt.headers || {}) },
  });
  if (!res.ok) throw new Error(`GitHub ${opt.method || 'GET'} ${pfad}: HTTP ${res.status} ${await res.text()}`);
  return res.json();
};

const speichern = async () => {
  if (!state.token) return;
  if (!confirm(`Änderungen als Commit auf Branch „${state.branch}" speichern?`)) return;
  $('#speichern').disabled = true;
  try {
    setzeStatus('Speichert …');
    const z = domZustand();

    // Zielzustand → Dateiinhalte.
    const final = {}; // pfad -> inhalt
    const serieMeta = {}; // "bereich/slug" -> {serieColl, body}
    for (const b of BEREICHE) {
      for (const s of (state.serien[b.id] || [])) serieMeta[`${b.id}/${s.slug}`] = { serieColl: b.serieColl, body: s.body };
    }
    for (const s of z.serien) {
      const meta = serieMeta[`${s.bereichId}/${s.slug}`];
      const pfad = `src/content/${meta.serieColl}/${s.slug}.md`;
      final[pfad] = frontmatter({ titel: s.titel, jahr: s.jahr, reihenfolge: s.reihenfolge }, meta.body);
    }
    for (const x of z.bilder) {
      const bild = state.bilder[x.id];
      const pfad = `src/content/${bild.bildColl}/${x.slug}-${x.reihenfolge}.md`;
      final[pfad] = frontmatter({ bild: bild.bild, serie: x.slug, reihenfolge: x.reihenfolge });
    }

    // Zu löschende Dateien = ursprünglich geladen, im Ziel nicht mehr vorhanden.
    const altePfade = new Set();
    for (const b of BEREICHE) for (const s of (state.serien[b.id] || [])) altePfade.add(s.pfad);
    for (const id in state.bilder) altePfade.add(state.bilder[id].pfad);
    const geloescht = [...altePfade].filter((p) => !(p in final));

    // Git-Data-API: Baum auf Basis des aktuellen Commits, dann Commit + Ref.
    const ref = await gh(`/git/ref/heads/${state.branch}`);
    const commitSha = ref.object.sha;
    const commit = await gh(`/git/commits/${commitSha}`);
    const baumEintraege = [
      ...Object.entries(final).map(([path, content]) => ({ path, mode: '100644', type: 'blob', content })),
      ...geloescht.map((path) => ({ path, mode: '100644', type: 'blob', sha: null })),
    ];
    const baum = await gh('/git/trees', {
      method: 'POST',
      body: JSON.stringify({ base_tree: commit.tree.sha, tree: baumEintraege }),
    });
    const neu = await gh('/git/commits', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Bilder anordnen (Reihenfolge/Serien via Admin)',
        tree: baum.sha,
        parents: [commitSha],
      }),
    });
    await gh(`/git/refs/heads/${state.branch}`, {
      method: 'PATCH',
      body: JSON.stringify({ sha: neu.sha }),
    });

    setzeStatus(`Gespeichert auf ${state.branch} (${neu.sha.slice(0, 7)}). Neu laden …`, 'ok');
    await laden();
  } catch (err) {
    console.error(err);
    setzeStatus('Fehler beim Speichern: ' + err.message, 'fehler');
    markiereGeaendert();
  }
};

// ---------------------------------------------------------------------------
// Einstellungen (Token + Branch)
// ---------------------------------------------------------------------------
const initEinstellungen = () => {
  const tokenFeld = $('#token');
  const branchFeld = $('#branch');
  tokenFeld.value = state.token;
  branchFeld.value = state.branch;
  $('#token-speichern').addEventListener('click', () => {
    state.token = tokenFeld.value.trim();
    state.branch = branchFeld.value.trim() || 'main';
    localStorage.setItem(LS_TOKEN, state.token);
    localStorage.setItem(LS_BRANCH, state.branch);
    setzeStatus('Einstellungen gespeichert.', 'ok');
    laden().catch((e) => setzeStatus('Fehler: ' + e.message, 'fehler'));
  });
};

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
window.addEventListener('beforeunload', (e) => {
  if (istGeaendert()) {
    e.preventDefault();
    e.returnValue = '';
  }
});

initEinstellungen();
$('#neuladen').addEventListener('click', () => laden().catch((e) => setzeStatus('Fehler: ' + e.message, 'fehler')));
$('#speichern').addEventListener('click', speichern);
ziehbar({ zoneSel: '.kachel-liste', itemSel: '.kachel', griffSel: null, achse: 'x' });
ziehbar({ zoneSel: '.bereich-serien', itemSel: '.serie-spalte', griffSel: '.griff', achse: 'y' });
laden().catch((e) => setzeStatus('Fehler beim Laden: ' + e.message, 'fehler'));
