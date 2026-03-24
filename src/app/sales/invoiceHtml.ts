import { APP_NAME } from "../branding";
import type { SaleRecord } from "./sales.types";

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const money = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const dateLong = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "long",
  timeStyle: "short",
});

/** Documento HTML autocontenido: aspecto de recibo / factura de pago (solo demo, no fiscal). */
export function buildInvoiceHtml(sale: SaleRecord): string {
  const rows = sale.items
    .map(
      (it) => `
    <tr>
      <td>${esc(it.name)}</td>
      <td class="num">${it.quantity}</td>
      <td class="num">${money.format(it.unitPrice)}</td>
      <td class="num">${money.format(it.unitPrice * it.quantity)}</td>
    </tr>`
    )
    .join("");

  const issued = dateLong.format(new Date(sale.issuedAt));

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Recibo ${esc(sale.receiptNumber)} — ${esc(APP_NAME)}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 24px; color: #111827; background: #f3f4f6; }
    .sheet { max-width: 720px; margin: 0 auto; background: #fff; border: 1px solid #e5e7eb; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,.08); }
    .inner { padding: 28px 32px 32px; }
    .ribbon { background: linear-gradient(90deg, #1d4ed8, #2563eb); color: #fff; padding: 10px 32px; font-size: 11px; letter-spacing: .06em; text-transform: uppercase; font-weight: 600; border-radius: 4px 4px 0 0; }
    .head { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 16px; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 2px solid #1d4ed8; }
    .brand { font-size: 22px; font-weight: 800; color: #1e3a8a; letter-spacing: -0.02em; }
    .sub { font-size: 12px; color: #6b7280; margin-top: 4px; }
    .meta { text-align: right; font-size: 13px; }
    .meta strong { display: block; font-size: 15px; color: #111827; }
    .badge { display: inline-block; margin-top: 8px; padding: 4px 10px; background: #fef3c7; color: #92400e; font-size: 11px; font-weight: 600; border-radius: 4px; border: 1px solid #fcd34d; }
    .block { margin-bottom: 20px; }
    .block h3 { font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: #6b7280; margin: 0 0 8px; }
    .block p { margin: 0; font-size: 14px; line-height: 1.5; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; margin: 16px 0 8px; }
    th { text-align: left; padding: 10px 8px; background: #f9fafb; border-bottom: 2px solid #e5e7eb; font-size: 11px; text-transform: uppercase; letter-spacing: .04em; color: #4b5563; }
    td { padding: 10px 8px; border-bottom: 1px solid #f3f4f6; vertical-align: top; }
    td.num { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
    .totals { margin-top: 12px; margin-left: auto; max-width: 280px; font-size: 14px; }
    .totals .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f3f4f6; }
    .totals .grand { font-size: 18px; font-weight: 800; color: #1d4ed8; border-bottom: none; margin-top: 4px; padding-top: 12px; border-top: 2px solid #e5e7eb; }
    .foot { margin-top: 28px; padding-top: 16px; border-top: 1px dashed #d1d5db; font-size: 11px; color: #6b7280; line-height: 1.5; }
    @media print {
      body { background: #fff; padding: 0; }
      .sheet { box-shadow: none; border: none; max-width: none; }
      .ribbon { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="ribbon">Comprobante no fiscal — Recibo de pago (demostración)</div>
    <div class="inner">
      <div class="head">
        <div>
          <div class="brand">${esc(APP_NAME)}</div>
          <div class="sub">Documento generado en prototipo · Sin validez fiscal ante AFIP</div>
          <span class="badge">Solo uso interno / demo</span>
        </div>
        <div class="meta">
          <strong>Recibo N.º ${esc(sale.receiptNumber)}</strong>
          <div>Venta: <strong>${esc(sale.id)}</strong></div>
          <div style="margin-top:6px;color:#4b5563;">${esc(issued)}</div>
        </div>
      </div>

      <div class="block">
        <h3>Cliente</h3>
        <p><strong>${esc(sale.customerName)}</strong><br />
        Tel. ${esc(sale.customerPhone)}<br />
        Ref. interna cliente #${sale.customerId}</p>
      </div>

      <div class="block">
        <h3>Detalle</h3>
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th class="num">Cant.</th>
              <th class="num">P. unit.</th>
              <th class="num">Subtotal</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>

      <div class="totals">
        <div class="row"><span>Subtotal</span><span>${money.format(sale.subtotal)}</span></div>
        ${
          sale.discountPct > 0
            ? `<div class="row"><span>Descuento (${sale.discountPct}%)</span><span>− ${money.format(sale.discountAmount)}</span></div>`
            : ""
        }
        <div class="row grand"><span>Total cobrado</span><span>${money.format(sale.total)}</span></div>
      </div>

      <div class="block" style="margin-top:20px;">
        <h3>Forma de pago</h3>
        <p>${esc(sale.paymentMethodLabel)}</p>
      </div>

      <div class="foot">
        Este archivo es una simulación de recibo para pruebas de ${esc(APP_NAME)}. No reemplaza factura electrónica ni comprobante autorizado.
        Podés imprimirlo o guardarlo como PDF desde el menú de impresión del navegador.
      </div>
    </div>
  </div>
</body>
</html>`;
}

export function downloadInvoiceHtml(sale: SaleRecord) {
  const html = buildInvoiceHtml(sale);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `recibo-${sale.receiptNumber}-${sale.id}.html`;
  a.rel = "noopener";
  a.click();
  URL.revokeObjectURL(url);
}

/** Abre ventana de impresión; devuelve false si el popup fue bloqueado. */
export function printInvoiceInNewWindow(sale: SaleRecord): boolean {
  const html = buildInvoiceHtml(sale);
  const w = window.open("", "_blank", "noopener,noreferrer");
  if (!w) return false;
  w.document.open();
  w.document.write(html);
  w.document.close();
  w.focus();
  requestAnimationFrame(() => {
    w.print();
  });
  return true;
}
