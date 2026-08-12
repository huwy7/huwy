// Zwei erlaubte Bildformate — mehr gibt es auf der Seite nicht (Entscheidung des
// Betreibers). Jedes Foto läuft in einem dieser beiden Rahmen:
//
//   5:4 quer   ▭      4:5 hoch   ▯
//
// Passt ein Bild nicht, wird es beschnitten. Die Regel dahinter:
//
//  1. Es wird IMMER nur EINE Seite beschnitten — entweder die Länge oder die
//     Breite, nie beides. Das ergibt sich von selbst: um ein Seitenverhältnis zu
//     ändern, muss genau eine Achse kürzer werden.
//  2. Beschnitten wird MITTIG — bei der Länge oben und unten gleich viel, bei der
//     Breite links und rechts gleich viel (`position: center` in Bild.astro).
//  3. Gewählt wird das Format, bei dem AM WENIGSTEN wegfällt.
//
// Zu Punkt 3: der erhaltene Anteil ist min(r, z) / max(r, z), wobei r das
// Verhältnis des Originals und z das des Ziels ist. Dieser Anteil wird am
// grössten, wenn z möglichst nah an r liegt. Weil 5/4 und 4/5 spiegelbildlich um
// 1 liegen (das eine ist der Kehrwert des anderen), verläuft die Grenze exakt
// beim Quadrat: alles ab quadratisch aufwärts verliert weniger im Querformat,
// alles darunter weniger im Hochformat. Darum genügt der schlichte Vergleich
// unten — kein Suchen, kein Abwägen.
//
// Beispiele:
//   4000×2250 (16:9)  → quer, Breite auf 2812 gekürzt, je 594 px links/rechts weg
//   2000×3000 (2:3)   → hoch, Länge auf 2500 gekürzt, je 250 px oben/unten weg
//   2000×2500 (4:5)   → hoch, passt bereits, kein Beschnitt

export const QUER = 5 / 4;
export const HOCH = 4 / 5;

/** Das Format, in dem dieses Bild am wenigsten verliert. */
export function zielVerhaeltnis(breite: number, hoehe: number): number {
  return breite >= hoehe ? QUER : HOCH;
}

/**
 * Grösste Breite, die sich aus dem Original noch ohne Hochrechnen schneiden
 * lässt. Wird die Breite beschnitten (Bild ist breiter als das Ziel), schrumpft
 * die nutzbare Breite auf `hoehe * ziel`; wird die Länge beschnitten, bleibt die
 * volle Breite erhalten. Ohne diese Grenze würde Astro breitere Varianten
 * berechnen, als das beschnittene Bild hergibt — also hochgerechnete, weiche
 * Bilder (CLAUDE.md Regel 11: lieber kleiner als schlechter).
 */
export function maxBreite(breite: number, hoehe: number, ziel: number): number {
  return Math.min(breite, Math.round(hoehe * ziel));
}
