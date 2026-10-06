// Shared page measurements and budgets for the visual-quality and visual-states checks.
// measurePage runs inside the browser, so it must stay self-contained.

export const BUDGETS = Object.freeze({
  documentOverflowPx: 0,
  overflowingChildren: 0,
  clippedText: 0,
  minFontPx: 12,
  charsBelowMinFontPct: 0,
  charsBelowContrastPct: 1,
  targetsBelow24px: 0,
  lightNativeSelects: 0,
  consoleErrors: 0,
  badValueTokens: 0,
  textOverflowsBox: 0,
  brokenImages: 0,
  minMainTextLength: 40,
  thirdPartyOrigins: 0,
});

export function measurePage(minFontPx) {
  const q = (selector) => Array.from(document.querySelectorAll(selector));
  const parse = (value) => {
    const match = value.match(/rgba?\(([^)]+)\)/);
    if (!match) return null;
    const p = match[1].split(/[ ,/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const lin = (v) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  const lum = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
  const ratio = (a, b) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);
  const over = (top, bottom) => ({
    r: top.r * top.a + bottom.r * (1 - top.a),
    g: top.g * top.a + bottom.g * (1 - top.a),
    b: top.b * top.a + bottom.b * (1 - top.a),
    a: 1,
  });
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && cs.opacity !== '0';
  };
  const label = (el) => {
    const cls = typeof el.className === 'string' && el.className.trim()
      ? `.${el.className.trim().split(/\s+/).slice(0, 2).join('.')}` : '';
    return `${el.tagName.toLowerCase()}${cls}`;
  };
  const backgroundOf = (el) => {
    const layers = [];
    for (let e = el; e; e = e.parentElement) {
      const c = parse(getComputedStyle(e).backgroundColor);
      if (c && c.a > 0) layers.push(c);
      if (c && c.a >= 1) break;
    }
    const body = parse(getComputedStyle(document.body).backgroundColor);
    let base = body && body.a > 0 ? { ...body, a: 1 } : { r: 0, g: 0, b: 0, a: 1 };
    for (let i = layers.length - 1; i >= 0; i -= 1) base = over(layers[i], base);
    return base;
  };

  const out = { problems: [] };
  const de = document.documentElement;
  out.documentOverflowPx = Math.max(0, de.scrollWidth - de.clientWidth);

  let chars = 0;
  let small = 0;
  let faint = 0;
  const smallSamples = new Map();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent.replace(/\s+/g, ' ').trim();
    const el = node.parentElement;
    if (!text || !el || el.closest('script,style') || !visible(el)) continue;
    const cs = getComputedStyle(el);
    const px = parseFloat(cs.fontSize);
    chars += text.length;
    if (px < minFontPx) {
      small += text.length;
      smallSamples.set(`${label(el)} ${px}px`, text.slice(0, 40));
    }
    // Inactive controls are exempt from the contrast minimum (WCAG 2.2, 1.4.3).
    if (el.closest('button:disabled, [aria-disabled="true"]')) continue;
    const fg = parse(cs.color);
    if (!fg) continue;
    const bg = backgroundOf(el);
    const eff = over({ ...fg, a: fg.a * (parseFloat(cs.opacity) || 1) }, bg);
    const large = px >= 24 || (px >= 18.66 && parseInt(cs.fontWeight, 10) >= 700);
    if (ratio(eff, bg) < (large ? 3 : 4.5)) faint += text.length;
  }
  out.charsBelowMinFontPct = +(100 * small / Math.max(chars, 1)).toFixed(2);
  out.charsBelowContrastPct = +(100 * faint / Math.max(chars, 1)).toFixed(2);
  out.smallTextSamples = [...smallSamples].slice(0, 5).map(([k, v]) => `${k} "${v}"`);

  const overflowing = [];
  for (const card of q('*')) {
    if (!visible(card)) continue;
    const cs = getComputedStyle(card);
    const boxed = ['Top', 'Right', 'Bottom', 'Left'].some((s) => parseFloat(cs[`border${s}Width`]) > 0 && cs[`border${s}Style`] !== 'none')
      || (parse(cs.backgroundColor)?.a ?? 0) > 0.05;
    if (!boxed || cs.overflowX !== 'visible') continue;
    const box = card.getBoundingClientRect();
    if (box.width < 24 || box.height < 24) continue;
    for (const child of card.children) {
      if (!visible(child)) continue;
      const r = child.getBoundingClientRect();
      if (r.right > box.right + 2 && r.left < box.right) {
        overflowing.push(`${label(card)} > ${label(child)} (+${Math.round(r.right - box.right)}px)`);
        break;
      }
    }
  }
  out.overflowingChildren = overflowing.length;
  out.overflowingChildrenSamples = overflowing.slice(0, 4);

  const clipped = [];
  for (const el of q('*')) {
    if (!visible(el) || el.clientWidth <= 2 || el.scrollWidth <= el.clientWidth + 2 || el.closest('.visually-hidden')) continue;
    const cs = getComputedStyle(el);
    // Some engines (WebKit) include a <select>'s popup width in layout overflow even though nothing
    // is visible; for a container, require a visible descendant that really sticks out.
    if (el.children.length && cs.textOverflow !== 'ellipsis') {
      const edge = el.getBoundingClientRect().right;
      const sticksOut = Array.from(el.querySelectorAll('*')).some((c) => !c.closest('select') && visible(c) && c.getBoundingClientRect().right > edge + 2);
      if (!sticksOut) continue;
    }
    if ((cs.textOverflow === 'ellipsis' || cs.overflowX === 'hidden' || cs.overflowX === 'clip') && (el.textContent || '').trim()) {
      clipped.push(`${label(el)} (-${el.scrollWidth - el.clientWidth}px) "${el.textContent.trim().slice(0, 30)}"`);
    }
  }
  out.clippedText = clipped.length;
  out.clippedTextSamples = clipped.slice(0, 4);

  // Text wider than its own box, where nothing clips it: a title squeezed to a sliver in a flex row.
  const squeezed = [];
  for (const el of q('*')) {
    if (!visible(el) || el.clientWidth < 8 || el.scrollWidth <= el.clientWidth + 2) continue;
    if (el.closest('select, pre, textarea, input, svg, .visually-hidden, [role="region"][tabindex], table')) continue;
    // WebKit counts a <select>'s popup width in the scroll width of its label; nothing is visible.
    if (el.querySelector('select')) continue;
    if (el.closest('[style*="overflow"]')) continue;
    const cs = getComputedStyle(el);
    if (cs.overflowX !== 'visible' || cs.display === 'inline') continue;
    const ownText = Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim().length > 2);
    if (!ownText) continue;
    let scroller = false;
    for (let p = el.parentElement; p; p = p.parentElement) { const o = getComputedStyle(p).overflowX; if (o === 'auto' || o === 'scroll') { scroller = true; break; } }
    if (scroller) continue;
    squeezed.push(`${label(el)} box ${el.clientWidth}px < text ${el.scrollWidth}px "${el.textContent.trim().slice(0, 28)}"`);
  }
  out.textOverflowsBox = squeezed.length;
  out.textOverflowsBoxSamples = squeezed.slice(0, 4);

  const targets = q('a,button,[role="button"],select,input,summary').filter(visible);
  const tiny = targets.filter((t) => {
    const r = t.getBoundingClientRect();
    // Inline links inside running text are exempt from the target-size minimum (WCAG 2.2, 2.5.8).
    if (t.tagName === 'A' && getComputedStyle(t).display === 'inline') return false;
    return r.width < 24 || r.height < 24;
  });
  out.targetsBelow24px = tiny.length;
  out.targetsBelow24pxSamples = tiny.slice(0, 4).map((t) => {
    const r = t.getBoundingClientRect();
    return `${label(t)} ${Math.round(r.width)}x${Math.round(r.height)} "${(t.textContent || '').trim().slice(0, 20)}"`;
  });

  out.lightNativeSelects = q('select').filter(visible).filter((s) => {
    const bg = parse(getComputedStyle(s).backgroundColor);
    return bg && lum(bg) > 0.6;
  }).length;
  // Render bugs: unresolved values, empty pages, broken images.
  const bodyText = (document.body.innerText || '');
  const bad = bodyText.match(/\b(undefined|NaN|\[object Object\])\b/g) || [];
  out.badValueTokens = bad.length;
  out.badValueSamples = [...new Set(bad)].slice(0, 3);
  const main = document.querySelector('main');
  out.mainTextLength = main ? (main.innerText || '').trim().length : 0;
  out.brokenImages = q('img').filter((img) => img.complete && img.naturalWidth === 0).length;
  out.busyRegions = q('[aria-busy="true"]').filter(visible).length;
  return out;
}

/**
 * Returns budget violations for one measurement as { rule, key, message, detail } objects,
 * where detail is the first offending sample (used to group repeats of one fault).
 */
export function budgetFailures(key, m, budgets = BUDGETS) {
  const out = [];
  const check = (name, value, limit, samples = []) => {
    if (value > limit) {
      out.push({
        rule: name.replace(/ %$/, ''),
        key,
        detail: samples[0] || '',
        message: `${key} ${name}: ${value} (budget ${limit})${samples.length ? `\n      ${samples.join('\n      ')}` : ''}`,
      });
    }
  };
  check('documentOverflowPx', m.documentOverflowPx, budgets.documentOverflowPx);
  check('overflowingChildren', m.overflowingChildren, budgets.overflowingChildren, m.overflowingChildrenSamples);
  check('clippedText', m.clippedText, budgets.clippedText, m.clippedTextSamples);
  check(`charsBelow${budgets.minFontPx}px %`, m.charsBelowMinFontPct, budgets.charsBelowMinFontPct, m.smallTextSamples);
  check('charsBelowContrast %', m.charsBelowContrastPct, budgets.charsBelowContrastPct);
  check('targetsBelow24px', m.targetsBelow24px, budgets.targetsBelow24px, m.targetsBelow24pxSamples);
  check('lightNativeSelects', m.lightNativeSelects, budgets.lightNativeSelects);
  check('consoleErrors', m.consoleErrors ?? 0, budgets.consoleErrors, m.consoleErrorSamples || []);
  check('textOverflowsBox', m.textOverflowsBox, budgets.textOverflowsBox, m.textOverflowsBoxSamples);
  check('badValueTokens', m.badValueTokens, budgets.badValueTokens, m.badValueSamples);
  check('brokenImages', m.brokenImages, budgets.brokenImages);
  check('thirdPartyOrigins', m.thirdPartyOrigins ?? 0, budgets.thirdPartyOrigins, m.thirdPartyOriginSamples || []);
  if (m.mainTextLength < budgets.minMainTextLength) {
    out.push({ rule: 'mainTextLength', key, detail: '', message: `${key} mainTextLength: ${m.mainTextLength} (page looks empty; minimum ${budgets.minMainTextLength})` });
  }
  return out;
}
