export const palettes = {
  pine: {
    accent: '#345E45',
    rail: '#193E32',
    background: '#F4F2E9',
    sage: '#E4EADD',
  },
  moss: {
    accent: '#58613B',
    rail: '#343F29',
    background: '#F6F2E5',
    sage: '#E9EAD8',
  },
  dusk: {
    accent: '#426365',
    rail: '#263F44',
    background: '#EEF1ED',
    sage: '#DEE7E2',
  },
};
export function luminance(color) {
  const v = color
    .slice(1)
    .match(/../g)
    .map((x) => parseInt(x, 16) / 255)
    .map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
}
export function themeTokens(name, custom) {
  const p = palettes[name] || palettes.pine;
  const color = custom && /^#[0-9a-f]{6}$/i.test(custom) ? custom : p.accent;
  return {
    '--primary': color,
    '--primary-foreground': luminance(color) > 0.179 ? '#000000' : '#FFFFFF',
    '--rail': p.rail,
    '--background': p.background,
    '--accent': p.sage,
    '--focus': '#27392E',
  };
}
