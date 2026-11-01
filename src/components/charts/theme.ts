import { useEffect, useState } from 'react';

import type { ChartColors } from '#/features/iot/chart-options';

function token(styles: CSSStyleDeclaration, name: string) {
  return styles.getPropertyValue(name).trim();
}

/** Chart colours from the current theme's design tokens. */
export function readChartColors(): ChartColors {
  const styles = getComputedStyle(document.documentElement);
  const accent = token(styles, '--action-accent');
  const muted = token(styles, '--text-tertiary');
  const blue = token(styles, '--chart-4');
  const amber = token(styles, '--chart-3');
  return {
    generated: accent,
    consumed: muted,
    exported: blue,
    imported: amber,
    grid: token(styles, '--border-subtle'),
    text: muted,
    palette: [accent, blue, amber, token(styles, '--chart-5'), muted],
  };
}

/** Resolves a colour such as "var(--chart-3)" for canvas drawing. */
export function resolveCssColor(color: string) {
  const name = /^var\((--[\w-]+)\)$/.exec(color)?.[1];
  return name ? token(getComputedStyle(document.documentElement), name) : color;
}

/** Chart colours that follow light/dark theme switches. */
export function useChartColors() {
  const [colors, setColors] = useState(readChartColors);

  useEffect(() => {
    const observer = new MutationObserver(() => setColors(readChartColors()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  return colors;
}
