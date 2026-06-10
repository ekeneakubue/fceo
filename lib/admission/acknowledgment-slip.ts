export type AcknowledgmentSlipData = {
  applicationNo: string;
  submittedAt: string;
  surname: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender?: string | null;
  dateOfBirth?: string | null;
  address?: string | null;
  countryOfOrigin?: string | null;
  stateOfOrigin?: string | null;
  localGovernmentOfOrigin?: string | null;
  homeTown?: string | null;
  schoolName?: string | null;
  programType?: string | null;
  programName?: string | null;
  avatarDataUrl?: string | null;
  logoUrl?: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-NG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function row(label: string, value: string | null | undefined): string {
  const display = value?.trim() ? escapeHtml(value.trim()) : "—";
  return `
    <tr>
      <th>${escapeHtml(label)}</th>
      <td>${display}</td>
    </tr>
  `;
}

export function buildAcknowledgmentSlipHtml(data: AcknowledgmentSlipData): string {
  const fullName = `${data.surname} ${data.firstName} ${data.lastName}`.trim();
  const logoUrl = data.logoUrl || "/images/fceo-logo.jpg";
  const photoBlock = data.avatarDataUrl
    ? `<img src="${data.avatarDataUrl}" alt="Applicant photo" class="photo" />`
    : `<div class="photo photo-placeholder">Photo</div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>FCEO Acknowledgment Slip - ${escapeHtml(data.applicationNo)}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 32px;
      font-family: Georgia, "Times New Roman", serif;
      color: #1e293b;
      background: #f8fafc;
    }
    .slip {
      max-width: 800px;
      margin: 0 auto;
      background: #fff;
      border: 2px solid #039e1d;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
    }
    .header {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 24px 28px;
      border-bottom: 3px double #039e1d;
      background: linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%);
    }
    .logo {
      width: 88px;
      height: 88px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #039e1d;
      flex-shrink: 0;
    }
    .header-text h1 {
      margin: 0;
      font-size: 22px;
      line-height: 1.3;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .header-text p {
      margin: 6px 0 0;
      font-size: 14px;
      color: #475569;
    }
    .title-bar {
      text-align: center;
      padding: 16px 28px;
      background: #039e1d;
      color: #fff;
    }
    .title-bar h2 {
      margin: 0;
      font-size: 18px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .meta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      padding: 20px 28px;
      border-bottom: 1px solid #e2e8f0;
      background: #fafafa;
    }
    .meta-item label {
      display: block;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #64748b;
      margin-bottom: 4px;
    }
    .meta-item strong {
      font-size: 16px;
      color: #0f172a;
    }
    .meta-item.highlight strong {
      color: #039e1d;
      font-size: 18px;
    }
    .content {
      display: grid;
      grid-template-columns: 120px 1fr;
      gap: 24px;
      padding: 24px 28px;
    }
    .photo {
      width: 120px;
      height: 140px;
      object-fit: cover;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
    }
    .photo-placeholder {
      display: grid;
      place-items: center;
      background: #f1f5f9;
      color: #94a3b8;
      font-size: 13px;
    }
    .section-title {
      margin: 0 0 10px;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #039e1d;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      font-size: 14px;
    }
    th, td {
      border: 1px solid #e2e8f0;
      padding: 8px 10px;
      text-align: left;
      vertical-align: top;
    }
    th {
      width: 34%;
      background: #f8fafc;
      font-weight: 600;
      color: #475569;
    }
    .notice {
      margin: 0 28px 24px;
      padding: 14px 16px;
      border-left: 4px solid #039e1d;
      background: #f0fdf4;
      font-size: 13px;
      line-height: 1.6;
      color: #334155;
    }
    .footer {
      padding: 16px 28px 24px;
      border-top: 1px dashed #cbd5e1;
      display: flex;
      justify-content: space-between;
      gap: 24px;
      font-size: 12px;
      color: #64748b;
    }
    .signature {
      margin-top: 28px;
      width: 220px;
      border-top: 1px solid #94a3b8;
      padding-top: 6px;
      font-size: 12px;
      color: #475569;
    }
    @media print {
      body { padding: 0; background: #fff; }
      .slip { box-shadow: none; border-width: 1px; }
    }
  </style>
</head>
<body>
  <div class="slip">
    <div class="header">
      <img src="${logoUrl}" alt="FCEO Logo" class="logo" />
      <div class="header-text">
        <h1>Federal College of Education, Ofeme Ohuhu</h1>
        <p>Admission Office · Application Acknowledgment</p>
      </div>
    </div>

    <div class="title-bar">
      <h2>Acknowledgment Slip</h2>
    </div>

    <div class="meta">
      <div class="meta-item highlight">
        <label>Application Number</label>
        <strong>${escapeHtml(data.applicationNo)}</strong>
      </div>
      <div class="meta-item">
        <label>Date Submitted</label>
        <strong>${escapeHtml(formatDate(data.submittedAt))}</strong>
      </div>
    </div>

    <div class="content">
      ${photoBlock}
      <div>
        <h3 class="section-title">Applicant Information</h3>
        <table>
          ${row("Full Name", fullName)}
          ${row("Email", data.email)}
          ${row("Phone", data.phone)}
          ${row("Gender", data.gender)}
          ${row("Date of Birth", data.dateOfBirth)}
          ${row("Address", data.address)}
          ${row("Country of Origin", data.countryOfOrigin)}
          ${row("State of Origin", data.stateOfOrigin)}
          ${row("Local Government", data.localGovernmentOfOrigin)}
          ${row("Home Town", data.homeTown)}
        </table>

        <h3 class="section-title">Program Applied For</h3>
        <table>
          ${row("School", data.schoolName)}
          ${row("Program Type", data.programType)}
          ${row("Programme", data.programName)}
          ${row("Application Status", "Received — Pending Review")}
        </table>
      </div>
    </div>

    <div class="notice">
      This slip confirms that your application has been received by the Admission Office.
      Please print this acknowledgment slip, attach required credentials and evidence of payment,
      and submit them to the Admission Office. Keep this slip for future reference and admission status checks.
    </div>

    <div class="footer">
      <div>
        <div>Generated electronically by FCEO Online Application Portal</div>
        <div class="signature">Admission Officer</div>
      </div>
      <div style="text-align: right;">
        <div>www.fceo.edu.ng</div>
        <div style="margin-top: 8px;">Status: <strong>Pending Review</strong></div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export function downloadAcknowledgmentSlip(data: AcknowledgmentSlipData): void {
  const html = buildAcknowledgmentSlipHtml({
    ...data,
    logoUrl: data.logoUrl || `${window.location.origin}/images/fceo-logo.jpg`,
  });
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const safeNo = data.applicationNo.replace(/[^\w-]+/g, "-");
  link.href = url;
  link.download = `FCEO-Acknowledgment-${safeNo}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
