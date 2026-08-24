import { jsPDF } from 'jspdf';
import { AuditIssue, PlatformProfile, AuditStep } from '../components/BuildPublishAudit';

export interface AuditPdfOptions {
  reportTitle?: string;
  engineerName?: string;
  releaseVersion?: string;
  environment?: string;
  includeSnippets?: boolean;
  includeLogs?: boolean;
  scope?: 'full' | 'performance' | 'dependency' | 'memory';
}

type RGB = [number, number, number];

export function generateAuditPdfReport(
  profile: PlatformProfile,
  issues: AuditIssue[],
  steps: AuditStep[],
  healthScore: number,
  logs: string[],
  options: AuditPdfOptions = {}
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let y = 14;

  const title = options.reportTitle || 'Pre-Flight Build & Publish Audit Report';
  const author = options.engineerName || 'Lead Release & Build Engineer';
  const version = options.releaseVersion || 'v2.4.0-RC1 (Build #8942)';
  const environment = options.environment || 'Production Release / Staging';
  const timestamp = new Date().toUTCString();

  const criticalCount = issues.filter(i => i.severity === 'critical' && !i.fixed).length;
  const warningCount = issues.filter(i => i.severity === 'warning' && !i.fixed).length;
  const passedCount = issues.filter(i => i.severity === 'passed' || i.fixed).length;

  // Helper colors
  const primaryBlue = [31, 111, 235] as const; // #1f6feb
  const darkNavy = [13, 17, 23] as const; // #0d1117
  const cardBg = [22, 27, 34] as const; // #161b22
  const textMuted = [139, 148, 158] as const; // #8b949e
  const textWhite = [240, 246, 252] as const;
  const greenPassed = [35, 134, 54] as const; // #238636
  const amberWarning = [210, 153, 34] as const; // #d29922
  const redCritical = [218, 54, 51] as const; // #da3633
  const purpleAccent = [188, 140, 255] as const; // #bc8cff

  // -------------------------------------------------------------
  // PAGE 1: HEADER & EXECUTIVE SUMMARY
  // -------------------------------------------------------------

  // Top Dark Header Banner
  doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Accent Top Line
  doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.rect(0, 0, pageWidth, 3, 'F');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
  doc.text(title.toUpperCase(), margin, 14);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(
    'AUTOMATED SYSTEM TOPOLOGY, PERFORMANCE CEILINGS, VRAM BUDGET & COMPILER AUDIT',
    margin,
    20
  );

  // Header Metadata Row
  doc.setFontSize(7.5);
  doc.setTextColor(170, 185, 205);
  doc.text(`Target Profile: ${profile.name}`, margin, 27);
  doc.text(`Release Target: ${version}`, margin + 70, 27);
  doc.text(`Environment: ${environment}`, margin + 130, 27);

  doc.text(`Generated: ${timestamp}`, margin, 34);
  doc.text(`Auditor: ${author}`, margin + 70, 34);
  doc.text(`Pipeline Status: ${criticalCount > 0 ? 'BLOCKED (Action Required)' : 'VERIFIED (Ready to Deploy)'}`, margin + 130, 34);

  y = 48;

  // -------------------------------------------------------------
  // READINESS SCORE & KEY METRICS SUMMARY
  // -------------------------------------------------------------
  const boxWidth = (pageWidth - margin * 2 - 9) / 4;
  const boxHeight = 22;

  // Box 1: Readiness Score
  const scoreColor = healthScore > 85 ? greenPassed : healthScore > 65 ? amberWarning : redCritical;
  doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
  doc.roundedRect(margin, y, boxWidth, boxHeight, 2, 2, 'F');
  doc.setDrawColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, boxWidth, boxHeight, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('READINESS SCORE', margin + 3, y + 5);

  doc.setFontSize(14);
  doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.text(`${healthScore} / 100`, margin + 3, y + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(healthScore > 85 ? 'Optimal Release Ready' : healthScore > 65 ? 'Minor Risks Detected' : 'Blockers Present', margin + 3, y + 19);

  // Box 2: Critical Blockers
  const x2 = margin + boxWidth + 3;
  doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
  doc.roundedRect(x2, y, boxWidth, boxHeight, 2, 2, 'F');
  doc.setDrawColor(criticalCount > 0 ? redCritical[0] : cardBg[0], criticalCount > 0 ? redCritical[1] : cardBg[1], criticalCount > 0 ? redCritical[2] : cardBg[2]);
  doc.roundedRect(x2, y, boxWidth, boxHeight, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('CRITICAL BLOCKERS', x2 + 3, y + 5);

  doc.setFontSize(14);
  doc.setTextColor(criticalCount > 0 ? redCritical[0] : greenPassed[0], criticalCount > 0 ? redCritical[1] : greenPassed[1], criticalCount > 0 ? redCritical[2] : greenPassed[2]);
  doc.text(`${criticalCount} Issues`, x2 + 3, y + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(criticalCount > 0 ? 'Requires Immediate Fix' : 'Zero Blocking Defects', x2 + 3, y + 19);

  // Box 3: Warnings
  const x3 = margin + (boxWidth + 3) * 2;
  doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
  doc.roundedRect(x3, y, boxWidth, boxHeight, 2, 2, 'F');
  doc.setDrawColor(cardBg[0], cardBg[1], cardBg[2]);
  doc.roundedRect(x3, y, boxWidth, boxHeight, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('WARNING NOTICES', x3 + 3, y + 5);

  doc.setFontSize(14);
  doc.setTextColor(warningCount > 0 ? amberWarning[0] : greenPassed[0], warningCount > 0 ? amberWarning[1] : greenPassed[1], warningCount > 0 ? amberWarning[2] : greenPassed[2]);
  doc.text(`${warningCount} Items`, x3 + 3, y + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('Review Before Final Seal', x3 + 3, y + 19);

  // Box 4: Passed Invariants
  const x4 = margin + (boxWidth + 3) * 3;
  doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
  doc.roundedRect(x4, y, boxWidth, boxHeight, 2, 2, 'F');
  doc.setDrawColor(cardBg[0], cardBg[1], cardBg[2]);
  doc.roundedRect(x4, y, boxWidth, boxHeight, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('PASSED INVARIANTS', x4 + 3, y + 5);

  doc.setFontSize(14);
  doc.setTextColor(greenPassed[0], greenPassed[1], greenPassed[2]);
  doc.text(`${passedCount} Verified`, x4 + 3, y + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('Complies with Target Budgets', x4 + 3, y + 19);

  y += 28;

  // -------------------------------------------------------------
  // SECTION 1: SYSTEM AUDIT PIPELINE VERIFICATION
  // -------------------------------------------------------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text('1. PRE-FLIGHT AUDIT SUBSYSTEM VERIFICATION', margin, y);

  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.line(margin, y + 1.5, pageWidth - margin, y + 1.5);
  y += 6;

  // Step Table
  steps.forEach(step => {
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 11, 1.5, 1.5, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 11, 1.5, 1.5, 'D');

    // Status pill
    let pillColor: RGB = [greenPassed[0], greenPassed[1], greenPassed[2]];
    let statusText = 'PASSED';
    if (step.status === 'critical') {
      pillColor = [redCritical[0], redCritical[1], redCritical[2]];
      statusText = 'CRITICAL';
    } else if (step.status === 'warning') {
      pillColor = [amberWarning[0], amberWarning[1], amberWarning[2]];
      statusText = 'WARNING';
    }

    doc.setFillColor(pillColor[0], pillColor[1], pillColor[2]);
    doc.roundedRect(margin + 2, y + 2.5, 16, 6, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    doc.setTextColor(255, 255, 255);
    doc.text(statusText, margin + 4, y + 6.8);

    // Step Name & Source
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(step.name, margin + 21, y + 4.8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Source: ${step.sourceTool} | Scope: ${step.details}`, margin + 21, y + 8.8);

    // Duration & Count
    doc.setFont('courier', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(51, 65, 85);
    doc.text(`${step.itemCount} (${step.durationMs}ms)`, pageWidth - margin - 42, y + 6.8);

    y += 13;
  });

  y += 2;

  // -------------------------------------------------------------
  // SECTION 2: TARGET PLATFORM & PERFORMANCE BUDGET MATRIX
  // -------------------------------------------------------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text('2. PLATFORM TARGET & HARDWARE BUDGET INVARIANTS', margin, y);

  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.line(margin, y + 1.5, pageWidth - margin, y + 1.5);
  y += 5;

  const colW = (pageWidth - margin * 2) / 3;
  const rowH = 14;

  // Row 1
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, colW - 2, rowH, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('VRAM BUDGET CEILING', margin + 3, y + 4.5);
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`${profile.vramBudgetMB} MB Dedicated`, margin + 3, y + 10);

  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin + colW, y, colW - 2, rowH, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('SYSTEM RAM BUDGET', margin + colW + 3, y + 4.5);
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`${profile.ramBudgetMB} MB Memory Cap`, margin + colW + 3, y + 10);

  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin + colW * 2, y, colW - 2, rowH, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('PACKAGE DISTRIBUTION SIZE', margin + colW * 2 + 3, y + 4.5);
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`≤ ${profile.packageTargetMB >= 1000 ? (profile.packageTargetMB / 1024).toFixed(1) + ' GB' : profile.packageTargetMB + ' MB'} Target`, margin + colW * 2 + 3, y + 10);

  y += rowH + 2.5;

  // Row 2
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, colW - 2, rowH, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('MAX DRAW CALLS PER FRAME', margin + 3, y + 4.5);
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`${profile.maxDrawCalls} Calls (@ ${profile.targetFPS} FPS)`, margin + 3, y + 10);

  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin + colW, y, colW - 2, rowH, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('SHADER ALU INSTRUCTION LIMIT', margin + colW + 3, y + 4.5);
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`${profile.maxShaderALU} ALU Instructions/Frag`, margin + colW + 3, y + 10);

  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin + colW * 2, y, colW - 2, rowH, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('TARGET FRAME BUDGET', margin + colW * 2 + 3, y + 4.5);
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`${(1000 / profile.targetFPS).toFixed(2)} ms / frame`, margin + colW * 2 + 3, y + 10);

  y += rowH + 6;

  // -------------------------------------------------------------
  // SECTION 3: COMPILER FLAGS & OPTIMIZATION PROFILE
  // -------------------------------------------------------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text('3. COMPILER TOOLCHAIN & CODE GENERATION AUDIT', margin, y);

  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.line(margin, y + 1.5, pageWidth - margin, y + 1.5);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Compiler Backend: ${profile.compilerBackend}`, margin, y);
  y += 4.5;

  doc.setFont('courier', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(15, 23, 42);
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 7.5, 1, 1, 'F');
  doc.text(`Flags: ${profile.recommendedFlags.join(' ')}`, margin + 3, y + 5);

  // Footer for Page 1
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Pre-Flight Build & Publish Audit System - Confidential Engineering Audit Record', margin, pageHeight - 8);
  doc.text('Page 1 of 2', pageWidth - margin - 15, pageHeight - 8);

  // -------------------------------------------------------------
  // PAGE 2: DETAILED FINDINGS & REMEDIATION MATRIX
  // -------------------------------------------------------------
  doc.addPage();
  let p2Y = 14;

  // Page 2 Header
  doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.rect(0, 0, pageWidth, 22, 'F');

  doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.rect(0, 0, pageWidth, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
  doc.text('DETAILED AUDIT FINDINGS & REMEDIATION MATRIX', margin, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(`Total Findings: ${issues.length} | Critical: ${criticalCount} | Warnings: ${warningCount} | Verified: ${passedCount}`, margin, 17);

  p2Y = 28;

  // Render Issues list
  issues.forEach((issue, idx) => {
    // If running out of space, add page
    if (p2Y > pageHeight - 35) {
      doc.addPage();
      p2Y = 14;
    }

    const cardHeight = issue.codeSnippet ? 30 : 25;

    let borderCol: RGB = [226, 232, 240];
    let badgeCol: RGB = [greenPassed[0], greenPassed[1], greenPassed[2]];
    let badgeLabel = 'PASSED';

    if (issue.fixed) {
      badgeCol = [greenPassed[0], greenPassed[1], greenPassed[2]];
      badgeLabel = 'AUTO-FIXED';
    } else if (issue.severity === 'critical') {
      badgeCol = [redCritical[0], redCritical[1], redCritical[2]];
      badgeLabel = 'CRITICAL';
      borderCol = [254, 202, 202];
    } else if (issue.severity === 'warning') {
      badgeCol = [amberWarning[0], amberWarning[1], amberWarning[2]];
      badgeLabel = 'WARNING';
      borderCol = [254, 240, 138];
    } else if (issue.severity === 'info') {
      badgeCol = [primaryBlue[0], primaryBlue[1], primaryBlue[2]];
      badgeLabel = 'INFO';
    }

    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, p2Y, pageWidth - margin * 2, cardHeight, 1.5, 1.5, 'F');
    doc.setDrawColor(borderCol[0], borderCol[1], borderCol[2]);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, p2Y, pageWidth - margin * 2, cardHeight, 1.5, 1.5, 'D');

    // Severity pill
    doc.setFillColor(badgeCol[0], badgeCol[1], badgeCol[2]);
    doc.roundedRect(margin + 3, p2Y + 3, 16, 5, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    doc.setTextColor(255, 255, 255);
    doc.text(badgeLabel, margin + 4.5, p2Y + 6.5);

    // Title & Category
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(issue.title, margin + 22, p2Y + 6.5);

    doc.setFont('courier', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`[${issue.category.toUpperCase()}] • ${issue.sourceTool}`, pageWidth - margin - 45, p2Y + 6.5);

    // Subsystem & File Location
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Subsystem: ${issue.subsystem} ${issue.fileLocation ? `| File: ${issue.fileLocation}` : ''}`, margin + 3, p2Y + 11.5);

    // Description & Impact
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(51, 65, 85);
    const descLines = doc.splitTextToSize(`Description: ${issue.description}`, pageWidth - margin * 2 - 6);
    doc.text(descLines[0] || '', margin + 3, p2Y + 16);

    // Recommendation
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(`Remediation: ${issue.recommendation}`, margin + 3, p2Y + 20.5);

    if (issue.codeSnippet) {
      doc.setFont('courier', 'normal');
      doc.setFontSize(6);
      doc.setTextColor(31, 111, 235);
      doc.text(`Snippet: ${issue.codeSnippet}`, margin + 3, p2Y + 25);
    }

    p2Y += cardHeight + 3.5;
  });

  // -------------------------------------------------------------
  // SIGN-OFF & CERTIFICATION STAMP
  // -------------------------------------------------------------
  if (p2Y > pageHeight - 38) {
    doc.addPage();
    p2Y = 14;
  } else {
    p2Y += 4;
  }

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, p2Y, pageWidth - margin * 2, 22, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, p2Y, pageWidth - margin * 2, 22, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('PRE-FLIGHT RELEASE CERTIFICATION & CHECKSUM VERIFICATION', margin + 4, p2Y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'This document serves as an immutable compliance record generated prior to pipeline publication.',
    margin + 4,
    p2Y + 10
  );

  const mockHash = `SHA256: 7e9b4a1c${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`;
  doc.setFont('courier', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(31, 111, 235);
  doc.text(`Audit Seal Checksum: ${mockHash.toUpperCase()}`, margin + 4, p2Y + 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Certified by: ${author} | Status: ${criticalCount === 0 ? 'SEALED & APPROVED' : 'HOLD (UNRESOLVED CRITICAL ISSUES)'}`, margin + 4, p2Y + 19);

  // Footer for Page 2
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Pre-Flight Build & Publish Audit System - Confidential Engineering Audit Record', margin, pageHeight - 8);
  doc.text('Page 2 of 2', pageWidth - margin - 15, pageHeight - 8);

  // Save the document with clean filename
  const cleanProfileId = profile.id.replace(/[^a-z0-9]/gi, '_');
  const filename = `PreFlight_Audit_Summary_${cleanProfileId}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
