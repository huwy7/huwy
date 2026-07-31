/**
 * Mobile Galerie — eigene Berechnung, getrennt von der Desktop-Fassung.
 *
 * Die Desktop-Darstellung bleibt vollständig unberührt: dieses Modul rechnet nur,
 * solange `MOBIL_QUERY` zutrifft, und räumt beim Wechsel auf Desktop alle gesetzten
 * Werte restlos wieder ab (`raeumeAb`). Es setzt ausschliesslich Inline-Werte auf
 * den Serien — kein einziger Desktop-Wert wird überschrieben.
 *
 * Aufbau einer Serie (Reihenfolge fest, nur die Bildgrösse ist dynamisch):
 *
 *     Titel
 *     fester Abstand            (--abstand-24, steht in Serie.astro)
 *     Bild mit weissem Rahmen
 *     fester Abstand            (--abstand-24, steht in Serie.astro)
 *     Zähler
 *
 * Alle Masse kommen aus gemessenen Elementgrössen und der aktuellen Viewportgrösse;
 * es gibt keine festen Bildgrössen und keine festen Höhen.
 */

/**
 * Was hier als „mobil" gilt: **ausschliesslich ein Telefon im Hochformat.**
 *
 * Die drei Teile der Bedingung, jeder mit einem Grund:
 *   - `hover: none` + `pointer: coarse` — ein echtes Berührgerät. Ein Desktop mit
 *     Maus fällt nie darunter, auch nicht mit Touchscreen (dort `hover: hover`),
 *     und ein schmal gezogenes Desktop-Fenster behält seine bisherige Darstellung.
 *   - `max-width: 500px` — trennt Telefon von Tablet. Über die Breite allein geht
 *     das nicht: ein iPhone quer ist 932px breit, ein iPad mini hochkant nur 744px.
 *     Im Hochformat sind Telefone aber immer schmaler als 500px und Tablets immer
 *     breiter — zusammen mit der Ausrichtung trennt das sauber.
 *   - `orientation: portrait` — im Querformat bleibt vom Bildschirm nach Kopfzeile
 *     und Mindestabständen zu wenig übrig (gemessen: 86px Bildhöhe statt 310px).
 *     Dort gilt darum die bisherige Darstellung, genau wie auf Tablets.
 *
 * Alles ausserhalb dieser Bedingung — Tablet in beiden Ausrichtungen, Telefon quer,
 * Desktop — läuft unverändert über den bisherigen Code-Pfad.
 *
 * CSS kann keine Custom Property in einer Media-Query auswerten — dieselbe
 * Bedingung steht darum wörtlich in `global.css` und in `Serie.astro`. Wird sie hier
 * geändert, müssen beide Stellen mitgeändert werden.
 */
export const MOBIL_QUERY =
  '(hover: none) and (pointer: coarse) and (max-width: 500px) and (orientation: portrait)';

/**
 * Kennzeichnung, solange die mobile Galerie rechnet. Sie sitzt auf jeder Serie und
 * steuert das mobile CSS — bewusst dort und nicht auf `<html>`: Astro hängt sein
 * Scope-Attribut an jeden Teil eines Selektors, und eine Klasse auf der Wurzel trägt
 * dieses Attribut nicht; Regeln wie `.wurzelklasse .serie` greifen dann nie (am
 * gebauten CSS geprüft).
 */
const SERIEN_MARKE = 'ist-mobil';

const zahl = (wert: string) => Number.parseFloat(wert) || 0;

/**
 * Die beiden festen Viewport-Höhen des Geräts, gemessen über ein unsichtbares
 * Hilfselement:
 *
 *   `gross` (`100lvh`) — Höhe mit eingefahrener Adressleiste
 *   `klein` (`100svh`) — Höhe mit ausgefahrener Adressleiste
 *
 * Beide sind je Gerät und Ausrichtung fest. `window.innerHeight` ist das NICHT: es
 * springt beim Scrollen zwischen den beiden Werten hin und her, sobald die
 * Adressleiste ein- oder ausfährt. Wer damit rechnet, bekommt Bilder, die mitten im
 * Scrollen ihre Grösse ändern. Kennt der Browser die Einheiten nicht, fällt beides
 * auf `window.innerHeight` zurück — dann verhält sich alles wie zuvor.
 */
const messeViewport = () => {
  const probe = document.createElement('div');
  probe.style.cssText =
    'position:fixed;top:0;left:0;width:0;pointer-events:none;visibility:hidden';
  document.body.append(probe);
  const messe = (einheit: string) => {
    probe.style.height = `100${einheit}`;
    return probe.getBoundingClientRect().height;
  };
  const gross = messe('lvh') || window.innerHeight;
  const klein = messe('svh') || window.innerHeight;
  probe.remove();
  return { gross, klein: Math.min(klein, gross) };
};

interface Serie {
  el: HTMLElement;
  kopf: HTMLElement;
  karussell: HTMLElement;
  zaehler: HTMLElement | null;
  buehnen: HTMLElement[];
}

export function starteMobileGalerie(): void {
  const abschnitte = [...document.querySelectorAll<HTMLElement>('.serie')];
  if (!abschnitte.length) return;

  const serien: Serie[] = [];
  for (const el of abschnitte) {
    const kopf = el.querySelector<HTMLElement>('.serie-kopf');
    const karussell = el.querySelector<HTMLElement>('.karussell');
    if (!kopf || !karussell) continue;
    serien.push({
      el,
      kopf,
      karussell,
      zaehler: el.querySelector<HTMLElement>('.zaehler:not(.zaehler--lightbox)'),
      buehnen: [...el.querySelectorAll<HTMLElement>('.karussell-buehne')],
    });
  }
  if (!serien.length) return;

  const wurzel = document.documentElement;
  const medium = matchMedia(MOBIL_QUERY);

  /** Letzter gesetzter Deckel je Serie — verhindert Endlosschleifen mit dem Beobachter. */
  const letzterDeckel = new WeakMap<HTMLElement, number>();

  const raeumeAb = () => {
    for (const s of serien) {
      s.el.classList.remove(SERIEN_MARKE);
      s.el.style.removeProperty('height');
      s.el.style.removeProperty('min-height');
      s.el.style.removeProperty('margin-block-start');
      s.el.style.removeProperty('margin-block-end');
      s.el.style.removeProperty('--bild-deckel');
      letzterDeckel.delete(s.el);
    }
  };

  /**
   * Sichtbare Bildhöhe einer Bühne. „Sichtbar" heisst auf der düsteren Seite Bild
   * INKLUSIVE weissem Rahmen (der Rahmen ist dort zu sehen), auf der farbigen Seite
   * nur das Foto (der Rahmen ist auf Weiss unsichtbar). Genau diese Unterscheidung
   * gilt auf der Seite schon für alle Abstände — sie bleibt unverändert.
   */
  const sichtbareHoehe = (buehne: HTMLElement, rahmen: number, farbe: boolean) => {
    const h = buehne.getBoundingClientRect().height;
    return h ? Math.max(0, h - (farbe ? 2 * rahmen : 0)) : 0;
  };

  const rechne = () => {
    if (!medium.matches) {
      raeumeAb();
      return;
    }
    for (const s of serien) s.el.classList.add(SERIEN_MARKE);

    const stil = getComputedStyle(wurzel);
    const rahmen = zahl(stil.getPropertyValue('--rahmen-breite'));
    const kopfHoehe = zahl(stil.getPropertyValue('--header-hoehe'));
    const luft = zahl(stil.getPropertyValue('--abstand-24'));
    const extra = zahl(stil.getPropertyValue('--serien-luft-extra'));
    const farbe = wurzel.dataset.modus === 'farbe';
    const { gross: sicht, klein } = messeViewport();
    if (!sicht || !rahmen) return;

    // 1. Höhendeckel.
    //
    //    Gerechnet wird mit der GROSSEN Viewporthöhe (`lvh`), nicht mit der
    //    aktuellen. Auf dem Telefon fährt die Adressleiste beim Scrollen ein und
    //    aus; `window.innerHeight` springt dabei um rund 80px, und die Bilder
    //    änderten mitten im Scrollen ihre Grösse (gemessen: Deckel 588 ↔ 508,
    //    Bild 398×520 ↔ 389×508). `lvh` ist je Gerät und Ausrichtung fest und
    //    ändert sich beim Scrollen nie — und es ist die GRÖSSERE der beiden Höhen,
    //    die Bilder behalten also ihre volle Grösse. (Mit `svh` wären sie stabil,
    //    aber dauerhaft kleiner — darum ausdrücklich nicht.)
    //
    //    Zwei Grenzen müssen halten, es gilt die kleinere:
    //      a) Über dem Titel: Kopfzeile + ein Abstandsschritt. Die Serie steht
    //         mittig im grossen Viewport, also gilt derselbe Abstand auch darunter.
    //      b) Unter dem Zähler bei SICHTBARER Adressleiste: dann endet der
    //         sichtbare Bereich schon bei `svh`. Die Serienmitte liegt weiterhin
    //         bei `lvh/2`, der Zähler also bei `(lvh + hoehe)/2` — davon muss noch
    //         ein Abstandsschritt bis `svh` übrig bleiben.
    //
    //    Der Randabstand war zuerst mit 3 Rahmenbreiten (48px) angesetzt. Auf
    //    kleinen Telefonen frass das zu viel: auf dem iPhone SE wurden Hochformate
    //    dadurch auf 250px Breite gequetscht, obwohl 343px Platz gewesen wären.
    //    Jetzt gilt derselbe Abstand wie zwischen Titel, Bild und Zähler — die
    //    Seite bekommt dadurch einen durchgehenden Rhythmus und die Fotos deutlich
    //    mehr Fläche. Auf grossen Telefonen ändert es nichts: dort begrenzt ohnehin
    //    die Breite. Bewusste Entscheidung des Betreibers, nicht zurückdrehen.
    const mindestLuft = kopfHoehe + luft;
    const serienDeckel = Math.max(
      0,
      Math.min(sicht - 2 * mindestLuft, 2 * klein - sicht - 2 * luft),
    );

    // 2. Je Serie den Deckel für die Bildhöhe setzen. Titel- und Zählerhöhe werden
    //    gemessen (Titel kann umbrechen), die beiden festen Abstände kommen aus dem
    //    Token. Übrig bleibt, was das Bild höchstens hoch sein darf.
    for (const s of serien) {
      const kopfH = s.kopf.getBoundingClientRect().height;
      const zaehlerH = s.zaehler ? s.zaehler.getBoundingClientRect().height : 0;
      const feste = kopfH + luft + (s.zaehler ? luft + zaehlerH : 0);
      const deckel = Math.max(0, Math.floor(serienDeckel - feste));
      if (letzterDeckel.get(s.el) !== deckel) {
        letzterDeckel.set(s.el, deckel);
        s.el.style.setProperty('--bild-deckel', `${deckel}px`);
      }
    }

    // 3. Nach dem Setzen der Deckel die tatsächlichen Bildhöhen messen. Die Serie ist
    //    so hoch wie ihr höchstes Bild — dadurch verschiebt sich beim seitlichen
    //    Blättern nichts vertikal, während die Gruppe aus Titel/Bild/Zähler in der
    //    Serie mittig sitzt und ihre festen Abstände behält.
    const hoehen = serien.map((s) => {
      const kopfH = s.kopf.getBoundingClientRect().height;
      const zaehlerH = s.zaehler ? s.zaehler.getBoundingClientRect().height : 0;
      let bild = 0;
      for (const buehne of s.buehnen) bild = Math.max(bild, sichtbareHoehe(buehne, rahmen, farbe));
      const gesamt = kopfH + luft + bild + (s.zaehler ? luft + zaehlerH : 0);
      return Math.ceil(Math.min(gesamt, serienDeckel));
    });

    // Höhe UND min-height inline: die Desktop-Regeln setzen ein `min-height` von
    // einer vollen Bildschirmhöhe, das sonst die gerechnete Höhe überstimmen würde.
    for (const [i, s] of serien.entries()) {
      s.el.style.height = `${hoehen[i]}px`;
      s.el.style.minHeight = '0px';
    }

    // 4. Abstände zwischen den Serien. Steht eine Serie mittig, bleibt unter ihr
    //    `sicht/2 - hoehe/2` bis zum unteren Bildschirmrand frei. Der Abstand zur
    //    nächsten Serie ist dieses Mass plus 20px — gerechnet mit dem GRÖSSEREN der
    //    beiden Werte, denn nur dann ist die vorherige Serie garantiert schon ganz
    //    oben aus dem Bild, wenn die nächste die Mitte erreicht. Bei gleich hohen
    //    Serien sind beide Werte identisch.
    const restUnten = (i: number) => Math.max(0, sicht / 2 - hoehen[i] / 2);
    for (const [i, s] of serien.entries()) {
      if (i === serien.length - 1) {
        // Letzte Serie: so viel Platz darunter, dass sie noch mittig gescrollt
        // werden kann. Erst danach endet der Scrollbereich.
        s.el.style.marginBlockEnd = `${Math.ceil(restUnten(i))}px`;
      } else {
        s.el.style.marginBlockEnd = `${Math.ceil(Math.max(restUnten(i), restUnten(i + 1)) + extra)}px`;
      }
      s.el.style.marginBlockStart = '';
    }

    // 5. Erste Serie: sie soll ohne Scrollen bereits mittig stehen. Der nötige
    //    Abstand ergibt sich aus ihrer gemessenen Lage im Dokument.
    const erste = serien[0];
    const obenIst = erste.el.getBoundingClientRect().top + window.scrollY;
    const obenSoll = sicht / 2 - hoehen[0] / 2;
    if (obenSoll > obenIst) erste.el.style.marginBlockStart = `${Math.ceil(obenSoll - obenIst)}px`;
  };

  let geplant = false;
  const plane = () => {
    if (geplant) return;
    geplant = true;
    requestAnimationFrame(() => {
      geplant = false;
      rechne();
    });
  };

  // Neu rechnen, sobald sich irgendetwas an den Massen ändert: Bilder laden
  // aufgeschoben nach, das Fenster ändert die Grösse, das Gerät wird gedreht.
  const beobachter = new ResizeObserver(plane);
  for (const s of serien) {
    for (const buehne of s.buehnen) beobachter.observe(buehne);
    beobachter.observe(s.kopf);
  }
  addEventListener('resize', plane, { passive: true });
  addEventListener('orientationchange', plane, { passive: true });
  medium.addEventListener('change', plane);

  rechne();
}
