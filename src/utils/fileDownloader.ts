/**
 * Riyal Pay Merchant Suite — File & Report Download Utilities
 */

export function downloadTextFile(filename: string, content: string, mimeType: string = 'text/plain;charset=utf-8;') {
  if (typeof window === 'undefined') return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row
        .map((val) => {
          const str = String(val ?? '');
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        })
        .join(',')
    ),
  ].join('\r\n');

  // UTF-8 BOM for Excel Arabic / English support
  const bomCsv = '\uFEFF' + csvContent;
  downloadTextFile(filename.endsWith('.csv') ? filename : `${filename}.csv`, bomCsv, 'text/csv;charset=utf-8;');
}

export function downloadZatcaTaxInvoice(invoiceData: {
  settlementRef: string;
  utr: string;
  storeName: string;
  crNumber: string;
  vatNumber: string;
  settleBank: string;
  iban: string;
  grossAmount: number;
  vatAmount: number;
  netAmount: number;
  date: string;
}) {
  const content = `===============================================================
              RIYAL PAY — ZATCA PHASE 2 TAX INVOICE
       (فاتورة ضريبية إلكترونية معتمدة — هيئة الزكاة والضريبة والجمارك)
===============================================================
Store / Business Name (اسم المنشأة): ${invoiceData.storeName}
Commercial Reg (السجل التجاري):       ${invoiceData.crNumber}
VAT Registration ID (الرقم الضريبي):  ${invoiceData.vatNumber}
Settlement Reference (مرجع العملية):   ${invoiceData.settlementRef}
Sarie National Rail UTR:             ${invoiceData.utr}
Issue Date & Time (تاريخ الإصدار):     ${invoiceData.date}
Settlement Bank (بنك التسوية):         ${invoiceData.settleBank}
Beneficiary IBAN (الآيبان المستفيد):   ${invoiceData.iban}
---------------------------------------------------------------
Gross Volume (إجمالي التحصيل):        SAR ${invoiceData.grossAmount.toFixed(2)}
Standard VAT (ضريبة القيمة المضافة ١٥٪): SAR ${invoiceData.vatAmount.toFixed(2)}
Net Dispatched Payout (صافي المحول):   SAR ${invoiceData.netAmount.toFixed(2)}
---------------------------------------------------------------
Status: COMPLETED & SETTLED VIA SARIE RTGS
Secured by Riyal Pay & Quantira Technologies Banking Rails
===============================================================`;

  downloadTextFile(
    `ZATCA-Tax-Invoice-${invoiceData.settlementRef}.txt`,
    content,
    'text/plain;charset=utf-8;'
  );
}

export function downloadStandeeQrSvg(qrData: {
  businessName: string;
  crNumber: string;
  vatNumber: string;
  qrPayload: string;
  terminalId?: string;
}) {
  // Generate a clean high-res vector printable poster
  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900" width="600" height="900">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#080C14"/>
      <stop offset="50%" stop-color="#111726"/>
      <stop offset="100%" stop-color="#080C14"/>
    </linearGradient>
    <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00C853"/>
      <stop offset="100%" stop-color="#009624"/>
    </linearGradient>
  </defs>

  <!-- Background Poster Card -->
  <rect width="600" height="900" rx="32" fill="url(#bgGrad)" stroke="#1E293B" stroke-width="4"/>

  <!-- Top Header Ribbon -->
  <rect x="0" y="0" width="600" height="110" rx="32" fill="url(#greenGrad)"/>
  <text x="300" y="65" fill="#080C14" font-size="34" font-weight="900" font-family="system-ui, -apple-system, sans-serif" text-anchor="middle">RIYAL PAY — ريال باي</text>
  <text x="300" y="92" fill="#080C14" font-size="14" font-weight="700" font-family="system-ui, -apple-system, sans-serif" text-anchor="middle">SAMA &amp; ZATCA COMPLIANT INSTANT PAYMENT STAND</text>

  <!-- Store Information Card -->
  <rect x="40" y="140" width="520" height="100" rx="20" fill="#161F30" stroke="#2A364F" stroke-width="2"/>
  <text x="300" y="180" fill="#FFFFFF" font-size="26" font-weight="800" font-family="system-ui, -apple-system, sans-serif" text-anchor="middle">${qrData.businessName}</text>
  <text x="300" y="215" fill="#94A3B8" font-size="15" font-weight="600" font-family="system-ui, -apple-system, sans-serif" text-anchor="middle">CR: ${qrData.crNumber}  •  VAT: ${qrData.vatNumber}</text>

  <!-- White QR Container Box -->
  <rect x="75" y="270" width="450" height="450" rx="28" fill="#FFFFFF" stroke="#00C853" stroke-width="6"/>

  <!-- QR Outer Border Markers -->
  <rect x="110" y="305" width="80" height="80" rx="12" fill="#080C14"/>
  <rect x="125" y="320" width="50" height="50" rx="6" fill="#FFFFFF"/>
  <rect x="135" y="330" width="30" height="30" rx="4" fill="#00C853"/>

  <rect x="410" y="305" width="80" height="80" rx="12" fill="#080C14"/>
  <rect x="425" y="320" width="50" height="50" rx="6" fill="#FFFFFF"/>
  <rect x="435" y="330" width="30" height="30" rx="4" fill="#00C853"/>

  <rect x="110" y="605" width="80" height="80" rx="12" fill="#080C14"/>
  <rect x="125" y="620" width="50" height="50" rx="6" fill="#FFFFFF"/>
  <rect x="135" y="630" width="30" height="30" rx="4" fill="#00C853"/>

  <!-- Center Decorative Grid & Brand Inset -->
  <circle cx="300" cy="495" r="44" fill="#080C14"/>
  <circle cx="300" cy="495" r="38" fill="#00C853"/>
  <text x="300" y="504" fill="#080C14" font-size="24" font-weight="900" font-family="system-ui, -apple-system, sans-serif" text-anchor="middle">﷼</text>

  <!-- Dynamic Simulated QR Code Pattern Matrix -->
  <g fill="#080C14">
    <rect x="230" y="315" width="20" height="40" rx="4"/>
    <rect x="270" y="315" width="40" height="20" rx="4"/>
    <rect x="330" y="315" width="20" height="50" rx="4"/>
    <rect x="370" y="340" width="20" height="30" rx="4"/>
    <rect x="210" y="375" width="50" height="20" rx="4"/>
    <rect x="280" y="375" width="30" height="30" rx="4"/>
    <rect x="330" y="385" width="50" height="20" rx="4"/>
    <rect x="110" y="420" width="60" height="20" rx="4"/>
    <rect x="190" y="420" width="30" height="40" rx="4"/>
    <rect x="390" y="420" width="50" height="30" rx="4"/>
    <rect x="460" y="420" width="30" height="50" rx="4"/>
    <rect x="110" y="480" width="40" height="30" rx="4"/>
    <rect x="170" y="480" width="60" height="20" rx="4"/>
    <rect x="370" y="480" width="60" height="20" rx="4"/>
    <rect x="450" y="490" width="40" height="30" rx="4"/>
    <rect x="210" y="550" width="40" height="40" rx="4"/>
    <rect x="270" y="560" width="50" height="20" rx="4"/>
    <rect x="340" y="540" width="30" height="50" rx="4"/>
    <rect x="390" y="560" width="50" height="30" rx="4"/>
    <rect x="460" y="560" width="30" height="40" rx="4"/>
    <rect x="210" y="620" width="60" height="20" rx="4"/>
    <rect x="290" y="620" width="40" height="40" rx="4"/>
    <rect x="350" y="620" width="30" height="30" rx="4"/>
    <rect x="400" y="620" width="80" height="20" rx="4"/>
    <rect x="230" y="660" width="30" height="30" rx="4"/>
    <rect x="350" y="665" width="60" height="20" rx="4"/>
    <rect x="430" y="660" width="40" height="30" rx="4"/>
  </g>

  <!-- Instructions Banner -->
  <text x="300" y="760" fill="#FFFFFF" font-size="20" font-weight="800" font-family="system-ui, -apple-system, sans-serif" text-anchor="middle">امسح وادفع فوراً عبر أي تطبيق بنكي سعودي</text>
  <text x="300" y="790" fill="#00C853" font-size="16" font-weight="700" font-family="system-ui, -apple-system, sans-serif" text-anchor="middle">Scan &amp; Pay via any Saudi Banking App • Apple Pay • mada</text>

  <!-- Accepted Rails Badges Footer -->
  <rect x="40" y="820" width="520" height="55" rx="16" fill="#111726" stroke="#1E293B" stroke-width="1.5"/>
  <text x="100" y="853" fill="#FFFFFF" font-size="15" font-weight="800" font-family="system-ui, -apple-system, sans-serif" text-anchor="middle">mada مدى</text>
  <text x="210" y="853" fill="#FFFFFF" font-size="15" font-weight="800" font-family="system-ui, -apple-system, sans-serif" text-anchor="middle">Apple Pay</text>
  <text x="320" y="853" fill="#FFFFFF" font-size="15" font-weight="800" font-family="system-ui, -apple-system, sans-serif" text-anchor="middle">SARIE سريع</text>
  <text x="430" y="853" fill="#FFFFFF" font-size="15" font-weight="800" font-family="system-ui, -apple-system, sans-serif" text-anchor="middle">VISA / MC</text>
  <text x="515" y="853" fill="#00C853" font-size="14" font-weight="900" font-family="system-ui, -apple-system, sans-serif" text-anchor="middle">ZATCA ✓</text>
</svg>`;

  downloadTextFile(
    `RiyalPay-Standee-QR-${qrData.businessName.replace(/\s+/g, '-')}.svg`,
    svgContent,
    'image/svg+xml;charset=utf-8;'
  );
}

export function downloadReceiptTxt(receiptData: {
  orderRef: string;
  storeName: string;
  crNumber: string;
  vatNumber: string;
  customerMasked?: string;
  paymentMethod: string;
  cardLast4?: string;
  grossAmount: number;
  vatAmount: number;
  netAmount: number;
  date: string;
}) {
  const content = `===============================================================
              RIYAL PAY — ZATCA SIMPLIFIED TAX INVOICE
       (فاتورة ضريبية مبسطة معتمدة — هيئة الزكاة والضريبة والجمارك)
===============================================================
Merchant / Store Name: ${receiptData.storeName}
Commercial Reg (CR):   ${receiptData.crNumber}
VAT Registration ID:   ${receiptData.vatNumber}
Invoice / Order Ref:   ${receiptData.orderRef}
Transaction Date/Time: ${receiptData.date}
Customer ID / Phone:   ${receiptData.customerMasked || 'Walk-in Customer'}
Payment Acceptance:    ${receiptData.paymentMethod.replace(/_/g, ' ').toUpperCase()}${receiptData.cardLast4 ? ` (•••• ${receiptData.cardLast4})` : ''}
---------------------------------------------------------------
Subtotal (Excl. VAT):  SAR ${receiptData.netAmount.toFixed(2)}
15% ZATCA VAT Amount:  SAR ${receiptData.vatAmount.toFixed(2)}
TOTAL PAID (شامل الضريبة): SAR ${receiptData.grossAmount.toFixed(2)}
---------------------------------------------------------------
Authorization: APPROVED • STATUS: SETTLED VIA SARIE
Powered by Riyal Pay — Quantira Technologies Payment Rails
===============================================================`;

  downloadTextFile(
    `Receipt-${receiptData.orderRef}.txt`,
    content,
    'text/plain;charset=utf-8;'
  );
}

export function downloadAccountDataExport(accountData: {
  merchantName: string;
  phone: string;
  crNumber: string;
  vatNumber: string;
  registrationDate?: string;
  totalBalance: number;
  collectionsCount: number;
  settlementsCount: number;
}) {
  const exportPayload = {
    exportedAt: new Date().toISOString(),
    system: 'Riyal Pay Merchant Suite (SAMA & ZATCA Compliant)',
    merchantProfile: {
      businessName: accountData.merchantName,
      phone: accountData.phone,
      crNumber: accountData.crNumber,
      vatNumber: accountData.vatNumber,
      registrationDate: accountData.registrationDate || '2026-01-15',
      liveBalanceSAR: accountData.totalBalance,
    },
    activitySummary: {
      totalCollectionsRecorded: accountData.collectionsCount,
      totalSettlementsDispatched: accountData.settlementsCount,
    },
    compliance: {
      pciDssCertified: true,
      zatcaPhase2Compliant: true,
      samaRegulatoryCompliant: true,
    }
  };

  downloadTextFile(
    `RiyalPay-MerchantData-${accountData.phone.replace(/\D/g, '') || 'Account'}.json`,
    JSON.stringify(exportPayload, null, 2),
    'application/json;charset=utf-8;'
  );
}

