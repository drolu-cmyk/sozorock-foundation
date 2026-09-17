import fs from "node:fs";
import path from "node:path";

const reportPath = path.resolve("audit-output/report.json");
if (!fs.existsSync(reportPath)) throw new Error(`Missing audit report: ${reportPath}`);

const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
const summary = report.summary || {};
const failures = [];

if ((summary.failedStatuses || []).length) failures.push(`failed routes: ${JSON.stringify(summary.failedStatuses)}`);
if (Number(summary.contrastIssueCount || 0) > 0) failures.push(`text contrast issues: ${summary.contrastIssueCount}`);
if (Number(summary.controlIssueCount || 0) > 0) failures.push(`control contrast issues: ${summary.controlIssueCount}`);
if (Number(summary.gradientCount || 0) > 0) failures.push(`rendered gradients: ${summary.gradientCount}`);
if ((summary.overflowRoutes || []).length) failures.push(`horizontal overflow: ${summary.overflowRoutes.join(", ")}`);
if (Number(summary.pageErrorCount || 0) > 0) failures.push(`browser errors: ${summary.pageErrorCount}`);

const expectedRoutes = 37;
if (Number(summary.pages || 0) !== expectedRoutes) failures.push(`audited pages: ${summary.pages}; expected ${expectedRoutes}`);

console.log(JSON.stringify(summary, null, 2));
if (failures.length) {
  throw new Error(`Current-site audit did not pass:\n- ${failures.join("\n- ")}`);
}

console.log("Current-site contrast, control, gradient, overflow and browser checks passed.");
