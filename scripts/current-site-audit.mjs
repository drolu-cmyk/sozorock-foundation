import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const baseUrl = process.env.AUDIT_BASE_URL || "http://127.0.0.1:4173";
const outputDir = path.resolve("audit-output");
fs.mkdirSync(outputDir, { recursive: true });

const browserCandidates = [
  process.env.CHROME_PATH,
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);
const executablePath = browserCandidates.find((candidate) => fs.existsSync(candidate));
if (!executablePath) throw new Error(`No supported Chromium executable found. Checked: ${browserCandidates.join(", ")}`);

const desktopRoutes = [
  ["home", "/"],
  ["work", "/platforms"],
  ["health", "/platforms/health"],
  ["applied-learning", "/platforms/applied-learning"],
  ["institute", "/platforms/institute"],
  ["research", "/publications"],
  ["rebs", "/publication/rebs-v1-2025"],
  ["rrg", "/publication/rrg-v1-2025"],
  ["hsa", "/publication/hsa-v1-2026"],
  ["ai-society", "/ai-society"],
  ["partner", "/partner"],
  ["support", "/support"],
  ["about", "/about"],
  ["contact", "/contact"],
  ["standards", "/standards"],
  ["privacy", "/privacy"],
];
const mobileRoutes = [
  ["home", "/"],
  ["work", "/platforms"],
  ["research", "/publications"],
  ["ai-society", "/ai-society"],
  ["partner", "/partner"],
  ["contact", "/contact"],
];

const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--font-render-hinting=none"],
});

const results = [];

async function inspectPage(name, route, viewport, suffix) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.setCacheEnabled(false);
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text().slice(0, 500));
  });
  page.on("pageerror", (error) => pageErrors.push(String(error).slice(0, 500)));

  const url = new URL(route, baseUrl).toString();
  const response = await page.goto(url, { waitUntil: "networkidle0", timeout: 60_000 });
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
    window.scrollTo(0, 0);
  });
  await new Promise((resolve) => setTimeout(resolve, 250));

  const screenshotName = `${name}-${suffix}.png`;
  await page.screenshot({ path: path.join(outputDir, screenshotName), fullPage: true, captureBeyondViewport: true });

  const audit = await page.evaluate(() => {
    const parseColor = (value) => {
      const match = String(value || "").match(/rgba?\(([^)]+)\)/i);
      if (!match) return null;
      const parts = match[1].split(/[ ,/]+/u).filter(Boolean).map(Number);
      if (parts.length < 3 || parts.some((item, index) => index < 3 && !Number.isFinite(item))) return null;
      return { r: parts[0], g: parts[1], b: parts[2], a: Number.isFinite(parts[3]) ? parts[3] : 1 };
    };
    const composite = (foreground, background) => {
      const alpha = foreground.a + background.a * (1 - foreground.a);
      if (alpha <= 0) return { r: 255, g: 255, b: 255, a: 1 };
      return {
        r: (foreground.r * foreground.a + background.r * background.a * (1 - foreground.a)) / alpha,
        g: (foreground.g * foreground.a + background.g * background.a * (1 - foreground.a)) / alpha,
        b: (foreground.b * foreground.a + background.b * background.a * (1 - foreground.a)) / alpha,
        a: alpha,
      };
    };
    const effectiveBackground = (element) => {
      let current = element;
      let result = { r: 255, g: 255, b: 255, a: 1 };
      const layers = [];
      while (current && current !== document.documentElement.parentElement) {
        const parsed = parseColor(getComputedStyle(current).backgroundColor);
        if (parsed && parsed.a > 0) layers.push(parsed);
        current = current.parentElement;
      }
      for (let index = layers.length - 1; index >= 0; index -= 1) result = composite(layers[index], result);
      return result;
    };
    const luminance = (color) => {
      const channel = (value) => {
        const normalized = value / 255;
        return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * channel(color.r) + 0.7152 * channel(color.g) + 0.0722 * channel(color.b);
    };
    const contrast = (first, second) => {
      const l1 = luminance(first);
      const l2 = luminance(second);
      return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    };
    const colorString = (color) => `rgb(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)})`;
    const isVisible = (element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0 && rect.width > 0 && rect.height > 0;
    };
    const directText = (element) => [...element.childNodes]
      .filter((node) => node.nodeType === Node.TEXT_NODE)
      .map((node) => node.textContent || "")
      .join(" ")
      .replace(/\s+/gu, " ")
      .trim();
    const simpleSelector = (element) => {
      const id = element.id ? `#${element.id}` : "";
      const classes = [...element.classList].slice(0, 3).map((value) => `.${value}`).join("");
      return `${element.tagName.toLowerCase()}${id}${classes}`;
    };

    const contrastIssues = [];
    const controlIssues = [];
    const gradientElements = [];
    const longCopy = [];
    const seenContrast = new Set();
    const seenControls = new Set();

    for (const element of document.querySelectorAll("body *")) {
      if (!isVisible(element)) continue;
      const style = getComputedStyle(element);
      if (style.backgroundImage && style.backgroundImage !== "none" && /gradient\(/iu.test(style.backgroundImage)) {
        gradientElements.push({ selector: simpleSelector(element), backgroundImage: style.backgroundImage.slice(0, 300) });
      }

      const text = directText(element);
      if (text) {
        const foregroundRaw = parseColor(style.color);
        const background = effectiveBackground(element);
        if (foregroundRaw) {
          const foreground = composite(foregroundRaw, background);
          const ratio = contrast(foreground, background);
          const fontSize = Number.parseFloat(style.fontSize) || 16;
          const fontWeight = Number.parseInt(style.fontWeight, 10) || 400;
          const isLarge = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
          const required = isLarge ? 3 : 4.5;
          if (ratio + 0.0001 < required) {
            const key = `${simpleSelector(element)}|${text.slice(0, 120)}|${colorString(foreground)}|${colorString(background)}`;
            if (!seenContrast.has(key)) {
              seenContrast.add(key);
              contrastIssues.push({
                selector: simpleSelector(element),
                text: text.slice(0, 220),
                ratio: Number(ratio.toFixed(2)),
                required,
                foreground: colorString(foreground),
                background: colorString(background),
                fontSize,
                fontWeight,
              });
            }
          }
        }
        if ((element.matches("p, li, dd") && text.length > 260) || (element.matches("h1, h2, h3") && text.length > 95)) {
          longCopy.push({ selector: simpleSelector(element), characters: text.length, text: text.slice(0, 400) });
        }
      }

      if (element.matches("input:not([type='checkbox']):not([type='radio']), select, textarea, button, a.button")) {
        const background = effectiveBackground(element.parentElement || element);
        const border = parseColor(style.borderTopColor);
        const elementBackground = parseColor(style.backgroundColor);
        const selector = simpleSelector(element);
        if (border && border.a > 0) {
          const ratio = contrast(composite(border, background), background);
          if (ratio < 3) {
            const key = `${selector}|border|${colorString(border)}|${colorString(background)}`;
            if (!seenControls.has(key)) {
              seenControls.add(key);
              controlIssues.push({ selector, part: "border", ratio: Number(ratio.toFixed(2)), required: 3, foreground: colorString(border), background: colorString(background) });
            }
          }
        }
        if (elementBackground && elementBackground.a > 0 && (element.matches("button, a.button"))) {
          const ratio = contrast(composite(elementBackground, background), background);
          if (ratio < 3 && style.boxShadow === "none") {
            const key = `${selector}|fill|${colorString(elementBackground)}|${colorString(background)}`;
            if (!seenControls.has(key)) {
              seenControls.add(key);
              controlIssues.push({ selector, part: "fill", ratio: Number(ratio.toFixed(2)), required: 3, foreground: colorString(elementBackground), background: colorString(background) });
            }
          }
        }
      }
    }

    const headings = [...document.querySelectorAll("h1, h2, h3")]
      .filter(isVisible)
      .map((element) => ({ level: element.tagName.toLowerCase(), text: element.textContent.replace(/\s+/gu, " ").trim() }));
    const ctas = [...document.querySelectorAll("a, button")]
      .filter(isVisible)
      .map((element) => ({ selector: simpleSelector(element), text: element.textContent.replace(/\s+/gu, " ").trim().slice(0, 160), href: element.getAttribute("href") }))
      .filter((item) => item.text);
    const bodyText = document.body.innerText.replace(/\s+/gu, " ").trim();

    return {
      title: document.title,
      h1Count: document.querySelectorAll("h1").length,
      headings,
      ctas,
      contrastIssues,
      controlIssues,
      gradientElements,
      longCopy,
      bodyCharacters: bodyText.length,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    };
  });

  results.push({
    name,
    route,
    suffix,
    url,
    status: response?.status() ?? null,
    screenshot: screenshotName,
    viewport,
    consoleErrors,
    pageErrors,
    ...audit,
  });
  await page.close();
}

for (const [name, route] of desktopRoutes) {
  await inspectPage(name, route, { width: 1440, height: 1000, deviceScaleFactor: 1 }, "desktop");
}
for (const [name, route] of mobileRoutes) {
  await inspectPage(name, route, { width: 390, height: 844, deviceScaleFactor: 1 }, "mobile");
}

await browser.close();

const report = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  executablePath,
  pages: results,
  summary: {
    pages: results.length,
    failedStatuses: results.filter((item) => item.status && item.status >= 400).map((item) => ({ route: item.route, status: item.status })),
    contrastIssueCount: results.reduce((sum, item) => sum + item.contrastIssues.length, 0),
    controlIssueCount: results.reduce((sum, item) => sum + item.controlIssues.length, 0),
    gradientCount: results.reduce((sum, item) => sum + item.gradientElements.length, 0),
    overflowRoutes: results.filter((item) => item.horizontalOverflow).map((item) => `${item.route} (${item.suffix})`),
    pageErrorCount: results.reduce((sum, item) => sum + item.pageErrors.length + item.consoleErrors.length, 0),
  },
};
fs.writeFileSync(path.join(outputDir, "report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report.summary, null, 2));
