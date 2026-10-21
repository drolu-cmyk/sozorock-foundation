import assert from "node:assert/strict";
import fs from "node:fs";
const puppeteer = (await import(process.env.AUDIT_BROWSER_DRIVER || "puppeteer-core")).default;
const candidates=[process.env.CHROME_PATH,"/usr/bin/google-chrome","/usr/bin/google-chrome-stable","/usr/bin/chromium","/usr/bin/chromium-browser"].filter(Boolean);
const executablePath=candidates.find(p=>fs.existsSync(p));
assert.ok(executablePath,"A Chromium executable is required for rendered contrast regression tests.");
const source=fs.readFileSync(new URL("./current-site-audit.mjs",import.meta.url),"utf8");
const start=source.indexOf("const audit = await page.evaluate(")+"const audit = await page.evaluate(".length;
const end=source.indexOf("\n  });\n\n  results.push(",start);
assert.ok(start>0&&end>start,"The production audit entry point must be identifiable.");
const evaluateAudit=source.slice(start,end)+"\n  }";
const browser=await puppeteer.launch({executablePath,headless:true,args:process.env.AUDIT_BROWSER_ARGS?JSON.parse(process.env.AUDIT_BROWSER_ARGS):["--no-sandbox","--disable-dev-shm-usage"]});
try {
 const page=await browser.newPage();
 const icon=(color,style="")=>`<svg width="24" height="24" viewBox="0 0 24 24" style="${style}"><path fill="${color}" d="M2 2h20v20H2z"/></svg>`;
 await page.setContent(`<style>body{background:#fff;color:#000}button{width:48px;height:48px;background:#fafafa;border:0;outline:0}svg{display:block}</style>
 <button id="good-icon" aria-label="Open">${icon("#000")}</button>
 <button id="good-outline" aria-label="Open" style="outline:2px solid #000"></button>
 <button id="good-shadow" aria-label="Open" style="box-shadow:0 0 0 2px #000"></button>
 <button id="good-icon-light-border" aria-label="Open" style="border:1px solid #eee">${icon("#000")}</button>
 <button id="good-label">Open</button>
 <button id="bad-icon" aria-label="Open">${icon("#ddd")}</button>
 <button id="hidden-icon" aria-label="Open">${icon("#000","display:none")}</button>
 <button id="faint-icon" aria-label="Open">${icon("#000","opacity:.01")}</button>
 <button id="clipped-icon" aria-label="Open">${icon("#000","clip-path:inset(100%)")}</button>
 <button id="offscreen-icon" aria-label="Open">${icon("#000","transform:translateX(300px)")}</button>
 <button id="unpainted-icon" aria-label="Open">${icon("none")}</button>
 <button id="bad-shadow" aria-label="Open" style="box-shadow:0 0 0 2px rgba(0,0,0,.01)"></button>
 <button id="plain" aria-label="Open"></button>`);
 const audit=await page.evaluate(`(${evaluateAudit})()`);
 const ids=[...new Set(audit.controlIssues.map(issue=>issue.selector.match(/#([\w-]+)/)?.[1]))].sort();
 assert.deepEqual(ids,["bad-icon","bad-shadow","clipped-icon","faint-icon","hidden-icon","offscreen-icon","plain","unpainted-icon"]);
 assert.equal(audit.contrastIssues.length,0);
 console.log("Rendered control contrast regressions passed: 5 identifiable controls accepted; 8 inadequate or unpainted controls rejected.");
} finally {await browser.close();}
