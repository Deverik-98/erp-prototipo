import { APP_NAME } from "../branding";
import type { SaleRecord } from "./sales.types";

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Importes en pesos, estilo ticket. */
const money0 = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const money2 = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const IVA_RATE = 0.21;

function formatReceiptDate(d: Date) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function formatReceiptTime(d: Date) {
  return d.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/** Código de barras simulado (solo visual, coherente por venta). */
function barcodeBarsHtml(seed: string): string {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const parts: string[] = [];
  for (let i = 0; i < 52; i++) {
    const w = 1 + (Math.abs(h >>> (i % 28)) % 3);
    h = (h * 31 + i) | 0;
    parts.push(`<span class="bc-bar" style="width:${w}px"></span>`);
  }
  return `<div class="bc-bars" aria-hidden="true">${parts.join("")}</div>`;
}

function footerSerial(saleId: string): string {
  let h = 0;
  for (let i = 0; i < saleId.length; i++) h = (h * 33 + saleId.charCodeAt(i)) % 1e9;
  const a = String(h).padStart(7, "0").slice(0, 7);
  return `Z1B${a}`;
}

/**
 * HTML autocontenido: ticket térmico / factura simplificada (demo, no fiscal).
 * Layout responsive: ancho fluido hasta ~26rem, centrado, tipografía monoespaciada.
 */
export function buildInvoiceHtml(sale: SaleRecord): string {
  const issued = new Date(sale.issuedAt);
  const fecha = formatReceiptDate(issued);
  const hora = formatReceiptTime(issued);
  const facturaDisplay = sale.receiptNumber.padStart(8, "0");

  const itemRows = sale.items
    .map((it) => {
      const code = String(it.productId).padStart(8, "0");
      const nameU = esc(it.name.toUpperCase());
      const line = it.unitPrice * it.quantity;
      return `
      <div class="it">
        <div class="it-qty">${it.quantity} x ${money2.format(it.unitPrice)}</div>
        <div class="it-line">
          <span class="it-desc">${code} ${nameU} (G)</span>
          <span class="it-amt">${money2.format(line)}</span>
        </div>
      </div>`;
    })
    .join("");

  const total = sale.total;
  const biGravado = total / (1 + IVA_RATE);
  const ivaMonto = total - biGravado;

  const discountBlock =
    sale.discountPct > 0 && sale.discountAmount > 0
      ? `<div class="t-row"><span>DESCUENTO (${sale.discountPct}%)</span><span>− ${money2.format(sale.discountAmount)}</span></div>`
      : "";

  const payLine = `${esc(sale.paymentMethodLabel.toUpperCase())} 1`;

  const bc = barcodeBarsHtml(`${sale.id}-${sale.receiptNumber}`);
  const serial = footerSerial(sale.id);
  const barcodeDigits = `${facturaDisplay}${String(sale.customerId).padStart(4, "0")}`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>FACTURA ${esc(sale.receiptNumber)} — ${esc(APP_NAME)}</title>
  <style>
    * { box-sizing: border-box; }
    html { -webkit-text-size-adjust: 100%; }
    body {
      margin: 0;
      min-height: 100%;
      font-family: ui-monospace, "Cascadia Code", "Consolas", "Courier New", Courier, monospace;
      font-size: clamp(0.7rem, 2.8vw, 0.8125rem);
      line-height: 1.35;
      color: #0a0a0a;
      background: #e8e8ea;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding: clamp(0.5rem, 3vw, 1.25rem);
    }
    .paper {
      width: 100%;
      max-width: min(100%, 26rem);
      background: #faf9f7;
      color: #111;
      padding: clamp(0.75rem, 4vw, 1.125rem) clamp(0.65rem, 3.5vw, 1rem);
      border: 1px solid #c8c8c8;
      box-shadow: 0 2px 12px rgba(0,0,0,.08);
    }
    .demo-stamp {
      text-align: center;
      font-size: 0.65rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #555;
      margin-bottom: 0.35rem;
    }
    .brand {
      text-align: center;
      font-weight: 800;
      font-size: clamp(0.95rem, 4vw, 1.15rem);
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }
    .legal {
      text-align: center;
      font-size: 0.68rem;
      color: #333;
      margin-top: 0.35rem;
      line-height: 1.45;
    }
    .caja {
      text-align: center;
      font-size: 0.72rem;
      margin-top: 0.5rem;
    }
    hr.d {
      border: none;
      border-top: 1px dashed #333;
      margin: 0.65rem 0;
    }
    .sec-title { font-size: 0.68rem; font-weight: 700; margin-bottom: 0.25rem; }
    .cli { font-size: 0.72rem; line-height: 1.5; }
    .factura-title {
      text-align: center;
      font-size: clamp(0.85rem, 3.5vw, 1rem);
      font-weight: 800;
      letter-spacing: 0.12em;
      margin: 0.35rem 0 0.5rem;
    }
    .meta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.15rem 0.75rem;
      font-size: 0.72rem;
    }
    .meta-k { color: #333; }
    .meta-v { text-align: right; font-weight: 600; }
    .it { margin-bottom: 0.45rem; }
    .it-qty { font-size: 0.68rem; color: #333; }
    .it-line {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 0.35rem;
      font-size: 0.72rem;
      font-weight: 600;
    }
    .it-desc {
      flex: 1;
      min-width: 0;
      word-break: break-word;
      text-transform: uppercase;
    }
    .it-amt {
      flex-shrink: 0;
      text-align: right;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }
    .t-row {
      display: flex;
      justify-content: space-between;
      gap: 0.5rem;
      font-size: 0.72rem;
      padding: 0.2rem 0;
      font-variant-numeric: tabular-nums;
    }
    .t-row span:last-child { text-align: right; white-space: nowrap; }
    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-top: 0.35rem;
      padding-top: 0.45rem;
      border-top: 2px solid #111;
      font-size: clamp(0.88rem, 3.8vw, 1.05rem);
      font-weight: 800;
    }
    .pay {
      font-size: 0.72rem;
      margin-top: 0.35rem;
      display: flex;
      justify-content: space-between;
      gap: 0.5rem;
      font-variant-numeric: tabular-nums;
    }
    .thanks {
      text-align: center;
      font-weight: 700;
      font-size: 0.75rem;
      letter-spacing: 0.04em;
      margin: 0.65rem 0 0.5rem;
    }
    .bc-wrap { margin: 0.5rem auto 0.25rem; max-width: 100%; }
    .bc-bars {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      height: 2.25rem;
      gap: 0;
      overflow: hidden;
    }
    .bc-bar {
      display: block;
      align-self: stretch;
      background: #111;
      margin-right: 1px;
      min-height: 40%;
    }
    .bc-bar:nth-child(odd) { min-height: 100%; }
    .bc-num {
      text-align: center;
      font-size: 0.72rem;
      letter-spacing: 0.08em;
      font-variant-numeric: tabular-nums;
    }
    .foot-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.62rem;
      color: #555;
      margin-top: 0.65rem;
    }
    .fine {
      margin-top: 0.75rem;
      font-size: 0.62rem;
      color: #666;
      line-height: 1.45;
      text-align: center;
    }
    @media print {
      body { background: #fff; padding: 0; }
      .paper { box-shadow: none; border: none; max-width: none; }
    }
  </style>
</head>
<body>
  <div class="paper">
    <div class="demo-stamp">Comprobante no válido como factura fiscal · Demo ${esc(APP_NAME)}</div>
    <div class="brand">${esc(APP_NAME)}</div>
    <div class="legal">
      Razón social de ejemplo S.A.<br />
      Av. Corrientes 1234, CABA · Argentina<br />
      Tel. +54 11 0000-0000 · ${esc(APP_NAME)} POS
    </div>
    <div class="caja">CAJA 01</div>
    <hr class="d" />
    <div class="sec-title">Información del cliente</div>
    <div class="cli">
      <strong>${esc(sale.customerName)}</strong><br />
      Tel. ${esc(sale.customerPhone)} · Ref. #${sale.customerId}
    </div>
    <hr class="d" />
    <div class="factura-title">FACTURA</div>
    <div class="meta">
      <span class="meta-k">FACTURA:</span>
      <span class="meta-v">${esc(facturaDisplay)}</span>
      <span class="meta-k">FECHA:</span>
      <span class="meta-v">${esc(fecha)}</span>
      <span class="meta-k">HORA:</span>
      <span class="meta-v">${esc(hora)}</span>
    </div>
    <hr class="d" />
    ${itemRows}
    <hr class="d" />
    <div class="t-row"><span>EXENTO (E)</span><span>${money2.format(0)}</span></div>
    ${discountBlock}
    <div class="t-row"><span>BI G (21,00%)</span><span>${money2.format(biGravado)}</span></div>
    <div class="t-row"><span>IVA G (21,00%)</span><span>${money2.format(ivaMonto)}</span></div>
    <div class="total-row"><span>TOTAL</span><span>${money2.format(total)}</span></div>
    <div class="pay"><span>${payLine}</span><span>${money2.format(total)}</span></div>
    <hr class="d" />
    <div class="thanks">GRACIAS POR SU VISITA</div>
    <div class="bc-wrap">${bc}</div>
    <div class="bc-num">${esc(barcodeDigits)}</div>
    <div class="foot-row"><span>${esc(sale.id)}</span><span>${esc(serial)}</span></div>
    <p class="fine">
      Prototipo: totales con IVA 21 % simulado sobre el total cobrado. No reemplaza comprobante AFIP.
    </p>
  </div>
</body>
</html>`;
}
