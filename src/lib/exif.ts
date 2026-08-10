/*
  Minimaler EXIF-Leser für die Aufnahmedaten unter dem Bild (Polaroid-Streifen,
  Serie.astro). Liest AUSSCHLIESSLICH vier Werte: Blende, Belichtungszeit, ISO und
  Brennweite. Kamera, Objektiv, Datum, Software, Artist/Copyright und GPS werden
  bewusst NICHT gelesen — Entscheidung des Betreibers (nur technischer Einblick,
  keine Geräte- oder Ortsangaben).

  Bewusst ohne Fremdbibliothek (CLAUDE.md Regel 1: keine neue Dependency ohne
  Rückfrage). Der Parser läuft nur zur BAUZEIT in Node, nie im Browser — im
  ausgelieferten Bundle landet nichts davon.

  Aufbau einer JPEG-Datei, soweit hier gebraucht:
    FFD8                        SOI, Dateianfang
    FFEn <len> <daten>          Segmente; EXIF steckt in APP1 (FFE1)
    APP1-Daten: "Exif\0\0" + TIFF-Block
    TIFF-Block: "II"/"MM" (Byte-Reihenfolge), 0x002A, Offset auf IFD0
    IFD: <anzahl:2> dann je 12 Byte: tag:2 typ:2 anzahl:4 wert/offset:4
  Die vier Werte stehen in der Exif-Sub-IFD, auf die Tag 0x8769 in IFD0 zeigt.
*/
import { readFileSync } from 'node:fs';

export interface Aufnahmedaten {
  blende: string; // "f/3.2"
  zeit: string; // "1/170 s"
  iso: string; // "ISO 800"
  brennweite: string; // "23 mm"
}

// Tags in der Exif-Sub-IFD.
const TAG_EXIF_IFD = 0x8769;
const TAG_BELICHTUNGSZEIT = 0x829a;
const TAG_BLENDE = 0x829d;
const TAG_ISO = 0x8827;
const TAG_BRENNWEITE = 0x920a;

// Grösse eines Einzelwerts je EXIF-Typ (Index = Typnummer).
const TYP_GROESSE = [0, 1, 1, 2, 4, 8, 1, 1, 2, 4, 8, 4, 8];

class Leser {
  constructor(
    private buf: Buffer,
    private littleEndian: boolean,
  ) {}
  u16(p: number) {
    return this.littleEndian ? this.buf.readUInt16LE(p) : this.buf.readUInt16BE(p);
  }
  u32(p: number) {
    return this.littleEndian ? this.buf.readUInt32LE(p) : this.buf.readUInt32BE(p);
  }
}

/** Findet den TIFF-Block im APP1-Segment. Gibt dessen Startposition zurück. */
function findeTiffBlock(buf: Buffer): number | null {
  if (buf.length < 4 || buf.readUInt16BE(0) !== 0xffd8) return null; // kein JPEG
  let p = 2;
  while (p + 4 <= buf.length) {
    if (buf[p] !== 0xff) return null; // Segmentkette gerissen
    const marker = buf.readUInt16BE(p);
    // SOS (FFDA) — ab hier kommen Bilddaten, kein EXIF mehr.
    if (marker === 0xffda) return null;
    const laenge = buf.readUInt16BE(p + 2);
    if (marker === 0xffe1 && buf.toString('latin1', p + 4, p + 10) === 'Exif\0\0') {
      return p + 10;
    }
    p += 2 + laenge;
  }
  return null;
}

/** Liest einen Rational-Wert (Zähler/Nenner) an der angegebenen Position. */
function rational(l: Leser, pos: number): number | null {
  const zaehler = l.u32(pos);
  const nenner = l.u32(pos + 4);
  if (!nenner) return null;
  return zaehler / nenner;
}

/** Läuft eine IFD durch und sammelt die gesuchten Tags als Rohwerte. */
function liesIfd(
  l: Leser,
  buf: Buffer,
  tiff: number,
  ifd: number,
  gesucht: Set<number>,
): Map<number, number> {
  const werte = new Map<number, number>();
  if (tiff + ifd + 2 > buf.length) return werte;
  const anzahl = l.u16(tiff + ifd);
  for (let i = 0; i < anzahl; i++) {
    const eintrag = tiff + ifd + 2 + i * 12;
    if (eintrag + 12 > buf.length) break;
    const tag = l.u16(eintrag);
    if (!gesucht.has(tag)) continue;
    const typ = l.u16(eintrag + 2);
    const n = l.u32(eintrag + 4);
    const groesse = (TYP_GROESSE[typ] ?? 0) * n;
    // Werte über 4 Byte stehen nicht im Eintrag, sondern an einem Offset.
    const pos = groesse > 4 ? tiff + l.u32(eintrag + 8) : eintrag + 8;
    if (pos + Math.max(groesse, 4) > buf.length) continue;
    if (typ === 5 || typ === 10) {
      const r = rational(l, pos);
      if (r !== null) werte.set(tag, r);
    } else if (typ === 3) {
      werte.set(tag, l.u16(pos));
    } else if (typ === 4 || typ === 9) {
      werte.set(tag, l.u32(pos));
    }
  }
  return werte;
}

/** Belichtungszeit lesbar machen: unter 1 s als Bruch, darüber in Sekunden. */
function formatiereZeit(sekunden: number): string {
  if (sekunden >= 1) {
    // 2 s, 2.5 s — keine unnötige Nachkommastelle.
    const gerundet = Math.round(sekunden * 10) / 10;
    return `${Number.isInteger(gerundet) ? gerundet : gerundet.toFixed(1)} s`;
  }
  return `1/${Math.round(1 / sekunden)} s`;
}

/** Zahl ohne überflüssige Nachkommastelle: 5.6 → "5.6", 22.0 → "22". */
function knapp(wert: number): string {
  const gerundet = Math.round(wert * 10) / 10;
  return Number.isInteger(gerundet) ? String(gerundet) : gerundet.toFixed(1);
}

/**
 * Liest Blende, Zeit, ISO und Brennweite aus einer JPEG-Datei.
 * Gibt `null` zurück, sobald irgendetwas fehlt — der Streifen unter dem Bild
 * erscheint dann gar nicht erst (statt halb leer zu bleiben).
 */
export function leseAufnahmedaten(pfad: string): Aufnahmedaten | null {
  let buf: Buffer;
  try {
    buf = readFileSync(pfad);
  } catch {
    return null;
  }

  const tiff = findeTiffBlock(buf);
  if (tiff === null || tiff + 8 > buf.length) return null;

  const ordnung = buf.toString('latin1', tiff, tiff + 2);
  if (ordnung !== 'II' && ordnung !== 'MM') return null;
  const l = new Leser(buf, ordnung === 'II');
  if (l.u16(tiff + 2) !== 0x002a) return null;

  // IFD0 nur nach dem Zeiger auf die Exif-Sub-IFD durchsuchen.
  const ifd0 = liesIfd(l, buf, tiff, l.u32(tiff + 4), new Set([TAG_EXIF_IFD]));
  const exifIfd = ifd0.get(TAG_EXIF_IFD);
  if (exifIfd === undefined) return null;

  const w = liesIfd(
    l,
    buf,
    tiff,
    exifIfd,
    new Set([TAG_BELICHTUNGSZEIT, TAG_BLENDE, TAG_ISO, TAG_BRENNWEITE]),
  );
  const blende = w.get(TAG_BLENDE);
  const zeit = w.get(TAG_BELICHTUNGSZEIT);
  const iso = w.get(TAG_ISO);
  const brennweite = w.get(TAG_BRENNWEITE);
  if (!blende || !zeit || !iso || !brennweite) return null;

  return {
    blende: `f/${knapp(blende)}`,
    zeit: formatiereZeit(zeit),
    iso: `ISO ${Math.round(iso)}`,
    brennweite: `${knapp(brennweite)} mm`,
  };
}
