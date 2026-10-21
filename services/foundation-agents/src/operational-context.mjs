export function formatOperationalContext(context) {
  const { approvedKnowledge, ...operational } = context;
  const summary = JSON.stringify(operational).slice(0, 4000);
  if (approvedKnowledge === undefined) return summary;
  const approved = JSON.stringify(approvedKnowledge);
  if (approved.length > 32000) throw new Error("Approved public knowledge exceeds the supported context limit.");
  return `${summary}\n\nComplete approved public knowledge:\n${approved}`;
}
