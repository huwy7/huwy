// @ts-nocheck
/*
  Anordnen — Drag-and-Drop-Oberfläche zum Verwalten der Bilder.
  Zwei Spalten: links die Ziele (Serien Schwarzweiss/Farbe + Über-mich-Seiten),
  rechts ein Pool aller im Repo hochgeladenen Fotos. Fotos aus dem Pool in ein
  Ziel ziehen ODER antippen und das Ziel wählen (mobil-freundlich).

  Ergänzt Sveltia CMS (/admin), ersetzt es nicht: Texte und Uploads bleiben in
  Sveltia; hier wird angeordnet und befüllt.

  Bewusste Entscheidungen (siehe CLAUDE.md):
  - Reine Vanilla-Datei, keine Dependency (Regel 1). Liegt unter public/admin und
    wird wie Sveltia unverändert durchgereicht; die öffentliche Seite bleibt ohne
    JavaScript (Regel 2 gilt der ausgelieferten Seite, nicht dem Admin-Werkzeug).
  - Lesen geht ohne Login (Repo ist öffentlich). Nur Speichern braucht einen
    GitHub-Token (Personal Access Token, einmal einfügen).
  - Flaches Bild-Modell: ein Bild = eine kleine Markdown-Datei (bild/serie/
    reihenfolge). Aus dem Pool ziehen KOPIERT (Foto bleibt im Pool, es entsteht ein
    neuer Eintrag). Die Bild-Assets selbst werden nie verändert.
  - Speichern ist EIN atomarer Commit (Git-Data-API: Baum + Commit + Ref-Update).
*/

const REPO = 'huwy7/huwy';
const API = 'https://api.github.com';

// Die zwei Serien-Bereiche und ihre Sammlungen.
const BEREICHE = [
  { id: 'sw', label: 'Schwarzweiss', serieColl: 'serien', bildColl: 'serienbilder' },
  { id: 'farbe', label: 'Farbe', serieColl: 'farbserien', bildColl: 'farbbilder' },
];
// Die zwei Über-mich-Seiten (Text + Bilder-Liste, Sammlung „seiten").
const SEITEN = [
  { key: 'ueber-mich', label: 'Über mich (düster)' },
  { key: 'mehr-ueber-mich', label: 'Mehr über mich (farbig)' },
];
const SEITEN_DIR = 'src/content/seiten';

const LS_TOKEN = 'huwy-admin-token';
// Vorschau-Instanz (/feature/admin) bekommt einen eigenen Branch-Schlüssel und
// zielt standardmässig auf feature — so berührt Testen die Live-Seite nie.
const istVorschau = location.pathname.includes('/feature/');
const LS_BRANCH = istVorschau ? 'huwy-admin-branch-feature' : 'huwy-admin-branch';
const STANDARD_BRANCH = istVorschau ? 'feature' : 'main';

const state = {
  // Standard: main = live (Live-Instanz) bzw. feature (Vorschau-Instanz).
  branch: localStorage.getItem(LS_BRANCH) || STANDARD_BRANCH,
  token: localStorage.getItem(LS_TOKEN) || '',
  serien: {}, // bereichId -> [{ slug, titel, jahr, reihenfolge, body, pfad, neu? }]
  serienBilder: {}, // bereichId -> { slug -> [{ assetPfad, origPfad }] }
  seiten: {}, // key -> { pfad, body, bilder: [assetPfad] }
  origBildPfade: new Set(), // alle geladenen Bild-md-Pfade (für Lösch-Diff)
  neuZaehler: 0,
  snapshot: '',
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
    else if (k.startsWith('data-') || k.startsWith('aria-')) node.setAttribute(k, v);
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

// Pfad relativ zu einem Verzeichnis auflösen (nur ../ und ./).
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

// Relativer Pfad von einem Verzeichnis zu einer Zieldatei (Umkehrung).
const relPfad = (vonDir, ziel) => {
  const a = vonDir.split('/').filter(Boolean);
  const b = ziel.split('/').filter(Boolean);
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return '../'.repeat(a.length - i) + b.slice(i).join('/');
};

const kebab = (s) =>
  s
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const rawUrl = (pfad) => `https://raw.githubusercontent.com/${REPO}/${state.branch}/${pfad}`;

// Frontmatter einfacher key: value-Dateien parsen.
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

// Einen YAML-Skalar entpacken ("..." mit \n-Escapes, '...' oder roh).
const yamlSkalar = (v) => {
  v = v.trim();
  if (v.startsWith('"')) {
    try { return JSON.parse(v); } catch { return v.slice(1, -1); }
  }
  if (v.startsWith("'")) return v.slice(1, -1).replace(/''/g, "'");
  return v;
};

// Über-mich-Datei parsen: Liste aus { bild, text? }. Jeder Eintrag beginnt mit
// „- bild: …", eine optionale „text: …"-Zeile darunter gehört zum selben Eintrag.
const parseSeite = (text) => {
  const treffer = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  const eintraege = [];
  if (treffer) {
    let cur = null;
    for (const zeile of treffer[1].split(/\r?\n/)) {
      const mb = zeile.match(/^\s*-\s*bild:\s*(.+?)\s*$/);
      if (mb) { cur = { bild: yamlSkalar(mb[1]), text: '' }; eintraege.push(cur); continue; }
      const mt = zeile.match(/^\s*text:\s*(.*)$/);
      if (mt && cur) cur.text = yamlSkalar(mt[1]);
    }
  }
  return { eintraege };
};

// YAML-Wert sicher schreiben.
const yamlWert = (v) => {
  if (typeof v === 'number') return String(v);
  const s = String(v);
  return /^[\w./-]+$/.test(s) ? s : JSON.stringify(s);
};
const frontmatter = (obj, body = '') => {
  const zeilen = Object.entries(obj).map(([k, v]) => `${k}: ${yamlWert(v)}`);
  return `---\n${zeilen.join('\n')}\n---\n${body ? body + '\n' : ''}`;
};
// Über-mich-Datei schreiben: Liste aus { bild, text? } (Text nur, wenn gesetzt).
const seiteInhalt = (eintraege) => {
  if (!eintraege.length) return `---\nbilder: []\n---\n`;
  const liste = eintraege
    .map((e) => {
      let s = `  - bild: ${yamlWert(e.bild)}`;
      if (e.text && e.text.trim()) s += `\n    text: ${yamlWert(e.text.trim())}`;
      return s;
    })
    .join('\n');
  return `---\nbilder:\n${liste}\n---\n`;
};

const ghHeaders = (mitToken = false) => {
  const h = { Accept: 'application/vnd.github+json' };
  if (mitToken && state.token) h.Authorization = `Bearer ${state.token}`;
  return h;
};

// ---------------------------------------------------------------------------
// Laden
// ---------------------------------------------------------------------------
const ladeVerzeichnis = async (coll) => {
  const url = `${API}/repos/${REPO}/contents/src/content/${coll}?ref=${encodeURIComponent(state.branch)}`;
  const res = await fetch(url, { headers: ghHeaders(!!state.token) });
  if (res.status === 404) return [];
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

const ladeSeite = async (key) => {
  const url = `${API}/repos/${REPO}/contents/${SEITEN_DIR}/${key}.md?ref=${encodeURIComponent(state.branch)}`;
  const res = await fetch(url, { headers: ghHeaders(!!state.token) });
  if (!res.ok) return { pfad: `${SEITEN_DIR}/${key}.md`, eintraege: [] };
  const meta = await res.json();
  const text = await (await fetch(meta.download_url)).text();
  const { eintraege } = parseSeite(text);
  return {
    pfad: meta.path,
    eintraege: eintraege.map((e) => ({ assetPfad: aufloesen(SEITEN_DIR, e.bild), text: e.text || '' })),
  };
};

// Alle Foto-Assets im Repo (Pool) via rekursivem Git-Baum.
const ladePool = async () => {
  const url = `${API}/repos/${REPO}/git/trees/${encodeURIComponent(state.branch)}?recursive=1`;
  const res = await fetch(url, { headers: ghHeaders(!!state.token) });
  if (!res.ok) throw new Error(`Pool: HTTP ${res.status}`);
  const daten = await res.json();
  const bild = /\.(jpe?g|png|webp|avif)$/i;
  return (daten.tree || [])
    .filter((e) => e.type === 'blob' && e.path.startsWith('src/assets/') && bild.test(e.path))
    .map((e) => e.path)
    .sort();
};

const laden = async () => {
  setzeStatus('Lädt …');
  state.serien = {};
  state.serienBilder = {};
  state.seiten = {};
  state.origBildPfade = new Set();

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

    const proSerie = {};
    for (const d of bildDateien) {
      state.origBildPfade.add(d.pfad);
      const serie = d.daten.serie;
      const assetPfad = aufloesen(`src/content/${b.bildColl}`, d.daten.bild);
      (proSerie[serie] ||= []).push({
        assetPfad,
        origPfad: d.pfad,
        reihenfolge: Number(d.daten.reihenfolge) || 999,
      });
    }
    for (const slug in proSerie) proSerie[slug].sort((a, z) => a.reihenfolge - z.reihenfolge);
    state.serienBilder[b.id] = proSerie;
  }

  const seitenGeladen = await Promise.all(SEITEN.map((s) => ladeSeite(s.key)));
  SEITEN.forEach((s, i) => (state.seiten[s.key] = seitenGeladen[i]));

  const pool = await ladePool();
  rendern(pool);
  state.snapshot = signatur();
  setzeStatus(`Geladen — ${pool.length} Fotos im Pool.`, 'ok');
};

// ---------------------------------------------------------------------------
// Rendern
// ---------------------------------------------------------------------------
const macheKachel = (assetPfad, opt = {}) => {
  const img = el('img', { src: rawUrl(assetPfad), alt: '', loading: 'lazy', draggable: false });
  const attrs = {
    class: 'kachel' + (opt.pool ? ' pool-kachel' : ''),
    'data-bild': assetPfad,
    title: assetPfad.replace('src/assets/', ''),
  };
  if (opt.origPfad) attrs['data-origpfad'] = opt.origPfad;
  const card = el('div', attrs, [img]);
  img.addEventListener('error', () => card.classList.add('kachel--fehlt'));
  return card;
};

const serieSpalte = (bereich, serie) => {
  const kopf = el('div', { class: 'serie-kopf' }, [
    el('div', { class: 'griff', title: 'Serie verschieben', 'aria-label': 'Serie verschieben' }, [
      el('span', { text: '⠿' }),
      el('span', { class: 'griff-text', text: 'Serie' }),
    ]),
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
    'data-gruppe': bereich.id,
  });
  for (const bild of state.serienBilder[bereich.id]?.[serie.slug] || []) {
    liste.append(macheKachel(bild.assetPfad, { origPfad: bild.origPfad }));
  }
  return el('div', { class: 'serie-spalte', 'data-serie': serie.slug }, [kopf, liste]);
};

// Eine Über-mich-Reihe: Foto (zum Ziehen/Antippen) + Textfeld daneben. So sieht
// man im Werkzeug, welcher Text zu welchem Foto gehört. Reihen liegen untereinander.
const macheGalerieItem = (assetPfad, text = '') => {
  const foto = macheKachel(assetPfad);
  const feld = el('textarea', {
    class: 'item-text',
    rows: '3',
    placeholder: 'Text zu diesem Foto (optional) …',
    value: text,
    oninput: markiereGeaendert,
  });
  return el('div', { class: 'galerie-item' }, [foto, feld]);
};

const seiteGalerie = (seite) => {
  const liste = el('div', {
    class: 'galerie-liste',
    'data-seite': seite.key,
    'data-gruppe': 'seiten',
  });
  for (const e of state.seiten[seite.key]?.eintraege || []) {
    liste.append(macheGalerieItem(e.assetPfad, e.text));
  }
  return el('div', { class: 'galerie' }, [
    el('div', { class: 'galerie-kopf', text: `${seite.label} — Foto + Text daneben, wechselt links/rechts` }),
    liste,
  ]);
};

const rendern = (pool) => {
  const board = $('#board');
  board.textContent = '';
  for (const b of BEREICHE) {
    const bereichSerien = el('div', { class: 'bereich-serien', 'data-bereich': b.id });
    for (const serie of state.serien[b.id] || []) bereichSerien.append(serieSpalte(b, serie));
    const knopf = el('button', { class: 'neue-serie', type: 'button', text: `+ neue Serie (${b.label})` });
    knopf.addEventListener('click', () => neueSerie(b));
    board.append(el('section', { class: 'bereich' }, [
      el('div', { class: 'bereich-titel-zeile' }, [el('h2', { text: b.label })]),
      bereichSerien,
      knopf,
    ]));
  }
  // Über-mich-Seiten als Ziele
  const seitenBlock = el('section', {}, [el('h2', { text: 'Über mich' })]);
  for (const s of SEITEN) seitenBlock.append(seiteGalerie(s));
  board.append(seitenBlock);

  // Pool rechts
  if (pool) {
    const poolEl = $('#pool');
    poolEl.textContent = '';
    for (const assetPfad of pool) poolEl.append(macheKachel(assetPfad, { pool: true }));
    $('#pool-anzahl').textContent = `(${pool.length})`;
  }
  markiereGeaendert();
};

// ---------------------------------------------------------------------------
// Zustand aus dem DOM ableiten
// ---------------------------------------------------------------------------
const domZustand = () => {
  const z = { serien: [], bilder: [], seiten: [] };
  const board = $('#board');
  for (const b of BEREICHE) {
    const spalten = board.querySelectorAll(`.bereich-serien[data-bereich="${b.id}"] .serie-spalte`);
    spalten.forEach((spalte, si) => {
      const slug = spalte.dataset.serie;
      z.serien.push({
        bereichId: b.id,
        slug,
        titel: $('.titel-feld', spalte).value.trim(),
        jahr: Number($('.jahr-feld', spalte).value) || new Date().getFullYear(),
        reihenfolge: si + 1,
      });
      spalte.querySelectorAll('.kachel').forEach((k, ki) => {
        z.bilder.push({ bereichId: b.id, slug, assetPfad: k.dataset.bild, reihenfolge: ki + 1, node: k });
      });
    });
  }
  for (const s of SEITEN) {
    const liste = board.querySelector(`.galerie-liste[data-seite="${s.key}"]`);
    z.seiten.push({
      key: s.key,
      eintraege: [...liste.querySelectorAll('.galerie-item')].map((item) => ({
        assetPfad: $('.kachel', item)?.dataset.bild,
        text: $('.item-text', item)?.value || '',
      })),
    });
  }
  return z;
};

const signatur = () => {
  const z = domZustand();
  return JSON.stringify([
    z.serien.map((s) => [s.bereichId, s.slug, s.titel, s.jahr, s.reihenfolge]),
    z.bilder.map((x) => [x.bereichId, x.slug, x.assetPfad, x.reihenfolge]),
    z.seiten.map((s) => [s.key, s.eintraege.map((e) => [e.assetPfad, e.text])]),
  ]);
};

const istGeaendert = () => state.snapshot && signatur() !== state.snapshot;
const markiereGeaendert = () => {
  const dirty = istGeaendert();
  $('#speichern').disabled = !dirty || !state.token;
  $('#geaendert').textContent = dirty ? '● ungespeicherte Änderungen' : '';
};

// ---------------------------------------------------------------------------
// Drag & Drop (Pointer-basiert → Maus UND Touch)
// ---------------------------------------------------------------------------
const HALTE_MS = 280; // Touch: so lange halten, bis Ziehen startet (sonst = Scrollen)
const SCROLL_SCHWELLE = 12; // Bewegung während des Haltens = Scrollen → Drag verwerfen
const ZIEH_SCHWELLE = 6;

const ziehbar = ({ zoneSel, itemSel, griffSel, achse, onTap, zoneOk, langHalten, ausschluss }) => {
  let ctx = null;

  const timerAus = () => { if (ctx && ctx.timer) { clearTimeout(ctx.timer); ctx.timer = null; } };

  // Ziehen sichtbar starten (Klon „hebt ab", Platzhalter erscheint).
  const aktiviere = (x, y) => {
    ctx.aktiv = true;
    const r = ctx.item.getBoundingClientRect();
    ctx.versatzX = x - r.left;
    ctx.versatzY = y - r.top;
    ctx.klon = ctx.item.cloneNode(true);
    ctx.klon.classList.add('klon');
    ctx.klon.classList.remove('versteckt');
    ctx.klon.style.width = r.width + 'px';
    ctx.klon.style.height = r.height + 'px';
    document.body.append(ctx.klon);
    ctx.platz = el('div', { class: 'platz' });
    ctx.platz.style.width = r.width + 'px';
    ctx.platz.style.height = r.height + 'px';
    ctx.item.after(ctx.platz);
    ctx.item.classList.add('versteckt');
    document.body.classList.add('zieht');
    ctx.klon.style.left = x - ctx.versatzX + 'px';
    ctx.klon.style.top = y - ctx.versatzY + 'px';
  };

  const start = (e) => {
    if (griffSel && !e.target.closest(griffSel)) return;
    if (!griffSel && e.target.closest('input, button, textarea, .griff')) return;
    const item = e.target.closest(itemSel);
    if (!item) return;
    if (ausschluss && item.closest(ausschluss)) return; // z. B. Serien-Kacheln in Über-mich-Reihen auslassen
    const startZone = item.closest(zoneSel) || item.closest('.pool-liste');
    ctx = {
      item,
      istPool: !!item.closest('.pool-liste'),
      gruppe: startZone?.dataset.gruppe,
      bereich: item.closest('.bereich-serien')?.dataset.bereich,
      startX: e.clientX,
      startY: e.clientY,
      aktiv: false,
      bereit: false,
      timer: null,
      klon: null,
      platz: null,
      pointerId: e.pointerId,
    };
    // Touch (Bilder): erst nach kurzem Halten ziehbar → dazwischen normales Scrollen.
    // Maus und Griff: sofort ziehbar.
    if (langHalten && e.pointerType !== 'mouse') {
      ctx.timer = setTimeout(() => {
        if (!ctx) return;
        ctx.bereit = true;
        ctx.item.setPointerCapture(ctx.pointerId);
        aktiviere(ctx.startX, ctx.startY);
      }, HALTE_MS);
    } else {
      ctx.bereit = true;
      item.setPointerCapture(e.pointerId);
    }
  };

  const bewegen = (e) => {
    if (!ctx || ctx.pointerId !== e.pointerId) return;
    const dist = Math.hypot(e.clientX - ctx.startX, e.clientY - ctx.startY);
    if (!ctx.bereit) {
      // Halte-Phase: Bewegung = Scroll-Absicht → Ziehen verwerfen, Browser scrollt.
      if (dist > SCROLL_SCHWELLE) { timerAus(); ctx = null; }
      return;
    }
    if (!ctx.aktiv) {
      if (dist < ZIEH_SCHWELLE) return;
      aktiviere(ctx.startX, ctx.startY);
    }
    ctx.klon.style.left = e.clientX - ctx.versatzX + 'px';
    ctx.klon.style.top = e.clientY - ctx.versatzY + 'px';

    const unten = document.elementFromPoint(e.clientX, e.clientY);
    const zone = unten?.closest(zoneSel);
    if (!zone || (zoneOk && !zoneOk(zone, ctx))) return;
    const geschwister = [...zone.querySelectorAll(itemSel)].filter((x) => x !== ctx.item);
    let vor = null;
    for (const g of geschwister) {
      const r = g.getBoundingClientRect();
      if (achse === 'y') {
        if (e.clientY < r.top + r.height / 2) { vor = g; break; }
      } else {
        if (e.clientY < r.bottom && e.clientX < r.left + r.width / 2) { vor = g; break; }
      }
    }
    if (vor) zone.insertBefore(ctx.platz, vor);
    else zone.append(ctx.platz);
  };

  const ende = (e) => {
    if (!ctx || ctx.pointerId !== e.pointerId) return;
    timerAus();
    const c = ctx;
    ctx = null;
    if (!c.aktiv) {
      // Kein Ziehen: kurzes Tippen (kaum bewegt) → Menü.
      if (onTap && Math.hypot(e.clientX - c.startX, e.clientY - c.startY) < ZIEH_SCHWELLE) onTap(c.item);
      return;
    }
    const zielZone = c.platz.closest(zoneSel);
    if (c.istPool) {
      // Pool = Quelle: Kopie ins Ziel, Original bleibt im Pool.
      if (zielZone) c.platz.replaceWith(macheKachel(c.item.dataset.bild));
      else c.platz.remove();
    } else {
      // Verschieben: das Element selbst wandert an den Platzhalter.
      if (zielZone) c.platz.replaceWith(c.item);
      else c.platz.remove();
    }
    c.item.classList.remove('versteckt');
    c.klon.remove();
    document.body.classList.remove('zieht');
    markiereGeaendert();
  };

  const wurzel = $('#app');
  wurzel.addEventListener('pointerdown', start);
  wurzel.addEventListener('pointermove', bewegen);
  wurzel.addEventListener('pointerup', ende);
  wurzel.addEventListener('pointercancel', ende);
};

// ---------------------------------------------------------------------------
// Kontextmenü (Antippen)
// ---------------------------------------------------------------------------
const alleZiele = () => {
  const ziele = [];
  for (const b of BEREICHE)
    for (const s of state.serien[b.id] || [])
      ziele.push({ label: `${b.label}: ${s.titel || s.slug}`, sel: `.kachel-liste[data-bereich="${b.id}"][data-serie="${s.slug}"]` });
  for (const s of SEITEN) ziele.push({ label: `Über mich: ${s.label}`, sel: `.galerie-liste[data-seite="${s.key}"]` });
  return ziele;
};

const zeigeMenu = (kachel) => {
  const istPool = !!kachel.closest('.pool-liste');
  const zone = kachel.closest('.kachel-liste, .galerie-liste');

  const hintergrund = el('div', { class: 'menu-hintergrund' });
  const schliessen = () => hintergrund.remove();
  hintergrund.addEventListener('pointerdown', (e) => { if (e.target === hintergrund) schliessen(); });

  const karte = el('div', { class: 'menu' });
  karte.append(el('img', { class: 'menu-vorschau', src: rawUrl(kachel.dataset.bild), alt: '' }));

  const knopf = (label, fn, klasse) => {
    const b = el('button', { type: 'button', text: label });
    if (klasse) b.className = klasse;
    b.addEventListener('click', () => { fn(); schliessen(); });
    return b;
  };

  if (istPool) {
    karte.append(el('div', { class: 'menu-label', text: 'Hinzufügen zu' }));
    for (const ziel of alleZiele()) {
      karte.append(knopf(ziel.label, () => {
        const liste = document.querySelector(ziel.sel);
        if (!liste) return;
        // Über-mich bekommt eine Reihe (Foto + Textfeld), Serien eine reine Kachel.
        liste.append(
          liste.classList.contains('galerie-liste')
            ? macheGalerieItem(kachel.dataset.bild)
            : macheKachel(kachel.dataset.bild),
        );
        markiereGeaendert();
      }));
    }
    karte.append(
      el('div', { class: 'menu-trenner' }),
      knopf('Aus Pool löschen', () => poolLoeschen(kachel), 'loeschen'),
      knopf('Abbrechen', () => {}, 'abbrechen'),
    );
  } else {
    // Verschieben in ein Ziel derselben Gruppe + Löschen.
    const gruppe = zone?.dataset.gruppe;
    const aktuellSel = zone === null ? '' : zone.dataset.serie || zone.dataset.seite;
    const ziele = alleZiele().filter((z) => {
      const l = document.querySelector(z.sel);
      return l && l.dataset.gruppe === gruppe && l !== zone;
    });
    karte.append(el('div', { class: 'menu-label', text: 'Verschieben nach' }));
    if (ziele.length === 0) karte.append(el('div', { class: 'menu-leer', text: 'Kein anderes Ziel in dieser Gruppe.' }));
    for (const ziel of ziele) {
      karte.append(knopf(ziel.label, () => {
        const liste = document.querySelector(ziel.sel);
        if (liste) { liste.append(kachel); markiereGeaendert(); }
      }));
    }
    karte.append(
      el('div', { class: 'menu-trenner' }),
      knopf('Löschen', () => {
        if (!confirm('Dieses Bild hier entfernen? Der Eintrag wird beim Speichern gelöscht (das Foto bleibt im Pool/Repo).')) return;
        kachel.remove();
        markiereGeaendert();
      }, 'loeschen'),
      knopf('Abbrechen', () => {}, 'abbrechen'),
    );
    // aktuellSel nur zur Klarheit referenziert; keine Wirkung.
    void aktuellSel;
  }

  hintergrund.append(karte);
  document.body.append(hintergrund);
};

// Menü für eine Über-mich-Reihe (Antippen des Fotos): auf die andere Seite
// verschieben oder Reihe löschen. Der Text zieht dabei mit.
const zeigeGalerieMenu = (item) => {
  const foto = $('.kachel', item);
  const aktuell = item.closest('.galerie-liste')?.dataset.seite;

  const hintergrund = el('div', { class: 'menu-hintergrund' });
  const schliessen = () => hintergrund.remove();
  hintergrund.addEventListener('pointerdown', (e) => { if (e.target === hintergrund) schliessen(); });
  const karte = el('div', { class: 'menu' });
  karte.append(el('img', { class: 'menu-vorschau', src: rawUrl(foto.dataset.bild), alt: '' }));
  const knopf = (label, fn, klasse) => {
    const b = el('button', { type: 'button', text: label });
    if (klasse) b.className = klasse;
    b.addEventListener('click', () => { fn(); schliessen(); });
    return b;
  };

  const andere = SEITEN.filter((s) => s.key !== aktuell);
  if (andere.length) {
    karte.append(el('div', { class: 'menu-label', text: 'Verschieben nach' }));
    for (const s of andere) {
      karte.append(knopf(`Über mich: ${s.label}`, () => {
        const ziel = document.querySelector(`.galerie-liste[data-seite="${s.key}"]`);
        if (ziel) { ziel.append(item); markiereGeaendert(); }
      }));
    }
  }
  karte.append(
    el('div', { class: 'menu-trenner' }),
    knopf('Aus „Über mich" entfernen', () => {
      if (!confirm('Diese Reihe (Foto + Text) hier entfernen? Wird beim Speichern übernommen; das Foto bleibt im Pool.')) return;
      item.remove();
      markiereGeaendert();
    }, 'loeschen'),
    knopf('Abbrechen', () => {}, 'abbrechen'),
  );
  hintergrund.append(karte);
  document.body.append(hintergrund);
};

// ---------------------------------------------------------------------------
// Neue Serie
// ---------------------------------------------------------------------------
const neueSerie = (bereich) => {
  const eingabe = prompt(`Titel der neuen ${bereich.label}-Serie?`);
  if (eingabe === null) return;
  const titel = eingabe.trim() || 'Neue Serie';
  let basis = kebab(titel) || 'serie';
  const vorhanden = new Set((state.serien[bereich.id] || []).map((s) => s.slug));
  let slug = basis;
  let n = 2;
  while (vorhanden.has(slug)) slug = `${basis}-${n++}`;
  const serie = {
    slug,
    titel,
    jahr: new Date().getFullYear(),
    reihenfolge: (state.serien[bereich.id]?.length || 0) + 1,
    body: '',
    pfad: null,
    neu: true,
  };
  (state.serien[bereich.id] ||= []).push(serie);
  $(`#board .bereich-serien[data-bereich="${bereich.id}"]`).append(serieSpalte(bereich, serie));
  markiereGeaendert();
};

// ---------------------------------------------------------------------------
// Speichern (ein atomarer Commit via Git-Data-API)
// ---------------------------------------------------------------------------
const gh = async (pfad, opt = {}) => {
  const res = await fetch(`${API}/repos/${REPO}${pfad}`, {
    ...opt,
    headers: { ...ghHeaders(true), 'Content-Type': 'application/json', ...(opt.headers || {}) },
  });
  if (!res.ok) {
    const txt = await res.text();
    if (res.status === 403) {
      throw new Error('Kein Schreibrecht (403). Der Token braucht „Contents: Read and write" auf huwy7/huwy.');
    }
    throw new Error(`GitHub ${opt.method || 'GET'} ${pfad}: HTTP ${res.status} ${txt}`);
  }
  return res.json();
};

const speichern = async (opt = {}) => {
  if (!state.token) return;
  if (!opt.stumm && !confirm(`Änderungen als Commit auf Branch „${state.branch}" speichern?`)) return;
  const assetsLoeschen = opt.assetsLoeschen || [];
  $('#speichern').disabled = true;
  const board = $('#board');
  try {
    setzeStatus('Speichert …');
    const final = {};
    const finalBildPfade = new Set();

    for (const b of BEREICHE) {
      const spalten = [...board.querySelectorAll(`.bereich-serien[data-bereich="${b.id}"] .serie-spalte`)];
      spalten.forEach((spalte, si) => {
        const slug = spalte.dataset.serie;
        const titel = $('.titel-feld', spalte).value.trim();
        const jahr = Number($('.jahr-feld', spalte).value) || new Date().getFullYear();
        const body = (state.serien[b.id] || []).find((s) => s.slug === slug)?.body || '';
        final[`src/content/${b.serieColl}/${slug}.md`] = frontmatter(
          { titel, jahr, reihenfolge: si + 1 },
          body,
        );
        [...spalte.querySelectorAll('.kachel')].forEach((k, ki) => {
          const pfad = `src/content/${b.bildColl}/${slug}-${ki + 1}.md`;
          final[pfad] = frontmatter({
            bild: relPfad(`src/content/${b.bildColl}`, k.dataset.bild),
            serie: slug,
            reihenfolge: ki + 1,
          });
          finalBildPfade.add(pfad);
          k.dataset.origpfad = pfad;
        });
      });
    }

    for (const s of SEITEN) {
      const liste = board.querySelector(`.galerie-liste[data-seite="${s.key}"]`);
      const eintraege = [...liste.querySelectorAll('.galerie-item')].map((item) => ({
        bild: relPfad(SEITEN_DIR, $('.kachel', item).dataset.bild),
        text: $('.item-text', item)?.value || '',
      }));
      final[`${SEITEN_DIR}/${s.key}.md`] = seiteInhalt(eintraege);
    }

    const geloescht = [...state.origBildPfade].filter((p) => !(p in final));

    // Git-Data-API: Baum auf Basis des aktuellen Commits, dann Commit + Ref.
    const ref = await gh(`/git/ref/heads/${state.branch}`);
    const commitSha = ref.object.sha;
    const commit = await gh(`/git/commits/${commitSha}`);
    const baum = await gh('/git/trees', {
      method: 'POST',
      body: JSON.stringify({
        base_tree: commit.tree.sha,
        tree: [
          ...Object.entries(final).map(([path, content]) => ({ path, mode: '100644', type: 'blob', content })),
          ...geloescht.map((path) => ({ path, mode: '100644', type: 'blob', sha: null })),
          ...assetsLoeschen.map((path) => ({ path, mode: '100644', type: 'blob', sha: null })),
        ],
      }),
    });
    const neu = await gh('/git/commits', {
      method: 'POST',
      body: JSON.stringify({
        message: opt.nachricht || 'Bilder anordnen/befüllen (via Admin)',
        tree: baum.sha,
        parents: [commitSha],
      }),
    });
    await gh(`/git/refs/heads/${state.branch}`, { method: 'PATCH', body: JSON.stringify({ sha: neu.sha }) });

    // In-Memory-Zustand angleichen statt neu vom Netz zu laden (CDN hinkt kurz hinterher).
    state.origBildPfade = finalBildPfade;
    for (const b of BEREICHE) {
      const spalten = board.querySelectorAll(`.bereich-serien[data-bereich="${b.id}"] .serie-spalte`);
      const neueListe = [];
      spalten.forEach((spalte, si) => {
        const slug = spalte.dataset.serie;
        const vorhanden = (state.serien[b.id] || []).find((s) => s.slug === slug);
        neueListe.push({
          slug,
          titel: $('.titel-feld', spalte).value.trim(),
          jahr: Number($('.jahr-feld', spalte).value) || new Date().getFullYear(),
          reihenfolge: si + 1,
          body: vorhanden?.body || '',
          pfad: `src/content/${b.serieColl}/${slug}.md`,
        });
      });
      state.serien[b.id] = neueListe;
    }
    for (const s of SEITEN) {
      const liste = board.querySelector(`.galerie-liste[data-seite="${s.key}"]`);
      state.seiten[s.key].eintraege = [...liste.querySelectorAll('.galerie-item')].map((item) => ({
        assetPfad: $('.kachel', item).dataset.bild,
        text: $('.item-text', item)?.value || '',
      }));
    }
    state.snapshot = signatur();
    markiereGeaendert();
    setzeStatus(`Gespeichert auf ${state.branch} (${neu.sha.slice(0, 7)}).`, 'ok');
  } catch (err) {
    console.error(err);
    setzeStatus('Fehler beim Speichern: ' + err.message, 'fehler');
    markiereGeaendert();
  }
};

// Wo wird ein Foto (assetPfad) aktuell auf der Seite verwendet? (aus dem DOM)
const verwendungen = (assetPfad) => {
  const treffer = [];
  $('#board').querySelectorAll('.kachel').forEach((k) => {
    if (k.dataset.bild !== assetPfad) return;
    const serieListe = k.closest('.kachel-liste');
    const galerieListe = k.closest('.galerie-liste');
    if (serieListe) {
      const spalte = k.closest('.serie-spalte');
      const titel = $('.titel-feld', spalte)?.value || spalte.dataset.serie;
      const bereich = BEREICHE.find((b) => b.id === serieListe.dataset.bereich)?.label || '';
      treffer.push(`${bereich}: ${titel}`);
    } else if (galerieListe) {
      const seite = SEITEN.find((s) => s.key === galerieListe.dataset.seite);
      treffer.push(`Über mich: ${seite?.label || galerieListe.dataset.seite}`);
    }
  });
  return treffer;
};

// Foto aus dem Pool (und überall, wo es verwendet wird) löschen. Zeigt vorher, wo
// es sichtbar ist — hilft, Doppel zu erkennen. Löscht das Asset und speichert.
const poolLoeschen = (kachel) => {
  if (!state.token) {
    setzeStatus('Zum Löschen zuerst einen Token einfügen (Einstellungen).', 'fehler');
    return;
  }
  const assetPfad = kachel.dataset.bild;
  const orte = verwendungen(assetPfad);
  const frage = orte.length
    ? `Dieses Foto wird verwendet in:\n\n- ${orte.join('\n- ')}\n\nBeim Löschen wird es dort entfernt und die aktuellen Änderungen werden mitgespeichert. Fortfahren?`
    : `Dieses Foto wird nirgends auf der Seite verwendet.\n\nEndgültig aus dem Repo löschen? (Aktuelle Änderungen werden mitgespeichert.)`;
  if (!confirm(frage)) return;
  const pool = $('#pool');
  [...$('#board').querySelectorAll('.kachel'), ...pool.querySelectorAll('.kachel')].forEach((k) => {
    if (k.dataset.bild === assetPfad) k.remove();
  });
  $('#pool-anzahl').textContent = `(${pool.querySelectorAll('.kachel').length})`;
  speichern({ assetsLoeschen: [assetPfad], stumm: true, nachricht: 'Foto aus dem Pool löschen (via Admin)' });
};

// ---------------------------------------------------------------------------
// Foto-Upload (direkt ins Repo, danach im Pool)
// ---------------------------------------------------------------------------
const DATEI_OK = /\.(jpe?g|png|webp)$/i;
const POOL_DIR = 'src/assets/pool';

// Datei als Base64 (in Blöcken, damit auch grosse Fotos nicht den Stack sprengen).
const alsBase64 = async (file) => {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let bin = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  return btoa(bin);
};

// Kollisionsfreier Zielpfad im Pool-Ordner (kebab + ggf. -2, -3 …).
const eindeutigerPfad = (name, belegt) => {
  const punkt = name.lastIndexOf('.');
  const roh = punkt > 0 ? name.slice(0, punkt) : name;
  const ext = (punkt > 0 ? name.slice(punkt + 1) : 'jpg').toLowerCase();
  const basis = kebab(roh) || 'foto';
  let pfad = `${POOL_DIR}/${basis}.${ext}`;
  let n = 2;
  while (belegt.has(pfad)) pfad = `${POOL_DIR}/${basis}-${n++}.${ext}`;
  belegt.add(pfad);
  return pfad;
};

const hochladen = async (dateien) => {
  const alle = [...(dateien || [])];
  if (!alle.length) return;
  if (!state.token) {
    setzeStatus('Zum Hochladen zuerst einen Token einfügen (Einstellungen).', 'fehler');
    return;
  }
  const liste = alle.filter((f) => DATEI_OK.test(f.name));
  const abgelehnt = alle.length - liste.length;
  if (!liste.length) {
    setzeStatus('Nur JPG, PNG oder WebP werden unterstützt.', 'fehler');
    return;
  }
  $('#hochladen').disabled = true;
  try {
    setzeStatus(`Lädt ${liste.length} Foto(s) hoch …`);
    const belegt = new Set([...document.querySelectorAll('#pool .kachel')].map((k) => k.dataset.bild));
    const eintraege = [];
    for (const f of liste) {
      const pfad = eindeutigerPfad(f.name, belegt);
      const blob = await gh('/git/blobs', {
        method: 'POST',
        body: JSON.stringify({ content: await alsBase64(f), encoding: 'base64' }),
      });
      eintraege.push({ pfad, sha: blob.sha, file: f });
    }
    // Ein Commit mit allen neuen Assets.
    const ref = await gh(`/git/ref/heads/${state.branch}`);
    const commitSha = ref.object.sha;
    const commit = await gh(`/git/commits/${commitSha}`);
    const baum = await gh('/git/trees', {
      method: 'POST',
      body: JSON.stringify({
        base_tree: commit.tree.sha,
        tree: eintraege.map((e) => ({ path: e.pfad, mode: '100644', type: 'blob', sha: e.sha })),
      }),
    });
    const neu = await gh('/git/commits', {
      method: 'POST',
      body: JSON.stringify({ message: `Fotos hochladen (${liste.length}) via Admin`, tree: baum.sha, parents: [commitSha] }),
    });
    await gh(`/git/refs/heads/${state.branch}`, { method: 'PATCH', body: JSON.stringify({ sha: neu.sha }) });

    // Sofort in den Pool (lokale Vorschau, kein Warten auf das CDN).
    const pool = $('#pool');
    for (const e of eintraege) {
      const kachel = macheKachel(e.pfad, { pool: true });
      kachel.querySelector('img').src = URL.createObjectURL(e.file);
      pool.append(kachel);
    }
    $('#pool-anzahl').textContent = `(${pool.querySelectorAll('.kachel').length})`;
    setzeStatus(
      `${liste.length} Foto(s) hochgeladen${abgelehnt ? ` (${abgelehnt} ignoriert)` : ''}. Jetzt in ein Ziel ziehen.`,
      'ok',
    );
  } catch (err) {
    console.error(err);
    setzeStatus('Fehler beim Hochladen: ' + err.message, 'fehler');
  } finally {
    $('#hochladen').disabled = false;
  }
};

// ---------------------------------------------------------------------------
// Einstellungen
// ---------------------------------------------------------------------------
const initEinstellungen = () => {
  const tokenFeld = $('#token');
  const branchFeld = $('#branch');
  tokenFeld.value = state.token;
  branchFeld.value = state.branch;
  $('#token-speichern').addEventListener('click', () => {
    state.token = tokenFeld.value.trim();
    state.branch = branchFeld.value.trim() || STANDARD_BRANCH;
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
$('#hochladen').addEventListener('click', () => $('#datei').click());
$('#datei').addEventListener('change', (e) => {
  hochladen(e.target.files);
  e.target.value = '';
});

// Serien-Kacheln + Pool: verschieben/kopieren in Serien (Pool überall). Kacheln in
// Über-mich-Reihen sind ausgenommen (die haben ihre eigene Reihen-Logik unten).
ziehbar({
  zoneSel: '.kachel-liste',
  itemSel: '.kachel',
  griffSel: null,
  ausschluss: '.galerie-item',
  achse: 'x',
  onTap: zeigeMenu,
  langHalten: true,
  zoneOk: (zone, ctx) => ctx.istPool || zone.dataset.gruppe === ctx.gruppe,
});
// Über-mich-Reihen (Foto + Text) untereinander sortieren; Foto = Greiffläche.
ziehbar({
  zoneSel: '.galerie-liste',
  itemSel: '.galerie-item',
  griffSel: '.kachel',
  achse: 'y',
  onTap: zeigeGalerieMenu,
  langHalten: true,
  zoneOk: () => true,
});
// Serien als Ganzes verschieben (nur innerhalb ihres Bereichs).
ziehbar({
  zoneSel: '.bereich-serien',
  itemSel: '.serie-spalte',
  griffSel: '.griff',
  achse: 'y',
  zoneOk: (zone, ctx) => zone.dataset.bereich === ctx.bereich,
});

laden().catch((e) => setzeStatus('Fehler beim Laden: ' + e.message, 'fehler'));
