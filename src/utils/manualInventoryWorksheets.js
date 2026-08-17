function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderCell(column) {
  if (column.kind === "checkbox") {
    return `<td class="checkCell"><span class="paperBox" aria-hidden="true"></span></td>`;
  }
  return `<td class="writeCell"><span class="writeLine"></span></td>`;
}

export function buildManualInventoryWorksheetHtml({
  title,
  instructions,
  groups = [],
  columns = [],
  printedDate = new Date().toLocaleDateString(),
}) {
  const safeGroups = groups
    .map((group) => ({
      title: String(group?.title || "Other"),
      items: Array.isArray(group?.items) ? group.items.filter((item) => item?.name) : [],
    }))
    .filter((group) => group.items.length);

  const groupHtml = safeGroups.length
    ? safeGroups.map((group) => `
      <section class="worksheetGroup">
        <h2>${escapeHtml(group.title)}</h2>
        <table>
          <thead>
            <tr>
              <th class="itemHeading">Item</th>
              ${columns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${group.items.map((item) => `
              <tr>
                <td class="itemCell">
                  <strong>${escapeHtml(item.name)}</strong>
                  ${item.detail ? `<small>${escapeHtml(item.detail)}</small>` : ""}
                </td>
                ${columns.map(renderCell).join("")}
              </tr>
            `).join("")}
          </tbody>
        </table>
      </section>
    `).join("")
    : `<section class="worksheetGroup blankGroup">
        <h2>Additional Items</h2>
        <table><tbody>${Array.from({ length: 12 }, () => `
          <tr><td class="itemCell"><span class="writeLine"></span></td>${columns.map(renderCell).join("")}</tr>
        `).join("")}</tbody></table>
      </section>`;

  return `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>${escapeHtml(title)}</title>
      <style>
        @page { size: portrait; margin: .35in; }
        * { box-sizing: border-box; }
        body { margin: 0; color: #191714; font-family: Arial, Helvetica, sans-serif; font-size: 9.5px; line-height: 1.2; }
        header { margin-bottom: 10px; border-bottom: 2px solid #6f6252; padding-bottom: 7px; }
        .headerLine { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; }
        h1 { margin: 0; color: #51473b; font-size: 18px; letter-spacing: .025em; }
        header p { max-width: 670px; margin: 4px 0 0; color: #51473b; font-size: 9px; }
        .date { flex: 0 0 auto; color: #51473b; font-size: 9px; white-space: nowrap; }
        .worksheetGroup { margin: 0 0 10px; break-inside: avoid; page-break-inside: avoid; }
        h2 { margin: 0; border: 1px solid #cfc5b7; border-bottom: 0; background: #fbfaf7; color: #625646; padding: 4px 6px; font-size: 11px; text-transform: uppercase; letter-spacing: .04em; }
        table { width: 100%; border-collapse: collapse; table-layout: fixed; }
        th, td { border: 1px solid #cfc5b7; }
        th { height: 20px; background: #f4f0e8; color: #51473b; padding: 3px 4px; font-size: 8px; text-align: center; text-transform: uppercase; }
        .itemHeading { width: 43%; text-align: left; }
        th:not(.itemHeading) { width: auto; }
        td { height: 25px; padding: 3px 5px; vertical-align: middle; }
        .itemCell strong { display: block; font-size: 9.5px; font-weight: 600; }
        .itemCell small { display: block; margin-top: 1px; color: #625f59; font-size: 7.5px; }
        .checkCell { width: 10%; text-align: center; }
        .paperBox { display: inline-block; width: 11px; height: 11px; border: 1.25px solid #24211d; }
        .writeCell { min-width: 50px; }
        .writeLine { display: block; width: 100%; min-height: 10px; border-bottom: 1px solid #aaa095; }
        .blankGroup { margin-top: 8px; }
        footer { margin-top: 10px; border-top: 1px solid #cfc5b7; padding-top: 5px; color: #625f59; font-size: 8px; }
      </style>
    </head>
    <body>
      <header>
        <div class="headerLine"><h1>${escapeHtml(title)}</h1><span class="date">Printed ${escapeHtml(printedDate)}</span></div>
        <p>${escapeHtml(instructions)}</p>
      </header>
      ${groupHtml}
      <footer>Use this paper worksheet while checking your kitchen, then enter the results on the matching Robert’s Recipe Box page.</footer>
      <script>window.onload = () => { window.focus(); window.print(); };</script>
    </body>
  </html>`;
}

export function printManualInventoryWorksheet(options, browserWindow = window) {
  const printWindow = browserWindow.open("", "_blank", "width=950,height=760");
  if (!printWindow) {
    browserWindow.alert("Please allow pop-up windows so the printable worksheet can open.");
    return false;
  }

  printWindow.document.write(buildManualInventoryWorksheetHtml(options));
  printWindow.document.close();
  return true;
}
