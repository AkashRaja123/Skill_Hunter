export function computeAtsScore(scoreBreakdown: {
  keywordMatch: number;
  formatCompliance: number;
  experienceMatch: number;
  skillsMatch: number;
  educationMatch: number;
}): number {
  const weighted =
    scoreBreakdown.keywordMatch * 0.3 +
    scoreBreakdown.formatCompliance * 0.15 +
    scoreBreakdown.experienceMatch * 0.25 +
    scoreBreakdown.skillsMatch * 0.2 +
    scoreBreakdown.educationMatch * 0.1;

  return Math.max(0, Math.min(100, Math.round(weighted)));
}
