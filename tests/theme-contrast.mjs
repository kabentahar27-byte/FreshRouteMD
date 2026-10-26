import assert from 'node:assert/strict';
import { themeTokens, luminance, palettes } from '../lib/theme.mjs';
const contrast = (a, b) =>
  (Math.max(luminance(a), luminance(b)) + 0.05) /
  (Math.min(luminance(a), luminance(b)) + 0.05);
let count = 0;
for (let r = 0; r <= 255; r += 17)
  for (let g = 0; g <= 255; g += 17)
    for (let b = 0; b <= 255; b += 17) {
      const accent =
        '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
      const tokens = themeTokens('custom', accent);
      assert.ok(
        contrast(tokens['--primary'], tokens['--primary-foreground']) >= 4.5,
        accent,
      );
      count++;
    }
for (const name of Object.keys(palettes)) {
  const t = themeTokens(name);
  assert.ok(contrast('#27392E', t['--background']) >= 4.5);
  assert.ok(contrast('#FFFEF8', t['--rail']) >= 4.5);
}
assert.equal(
  themeTokens('bad', 'javascript:bad')['--primary'],
  palettes.pine.accent,
);
console.log(
  `Palette and ${count} custom-accent text contrasts passed (WCAG formula). Browser focus/layout checks remain separate.`,
);
