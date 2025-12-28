import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright-core";
import chromiumPack from "@sparticuz/chromium";

export async function POST(req: NextRequest) {
  let browser = null;

  try {
    const { html, fileName } = await req.json();

    // 1. Configuration du binaire Chromium (compatible Local & Vercel/Cloud)
    const executablePath = await chromiumPack.executablePath();

    browser = await chromium.launch({
      args: chromiumPack.args,
      executablePath: executablePath,
      headless: true,
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    // 2. Injection du HTML
    // On utilise waitUntil: "networkidle" pour s'assurer que les polices et Tailwind sont chargés
    // ... après page.setContent ...
    await page.setContent(html, { waitUntil: "networkidle" });

    // FORCER Playwright à attendre le rendu des polices
    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    await new Promise((r) => setTimeout(r, 500));
    // 3. Génération du PDF Haute Fidélité
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: false,
      preferCSSPageSize: true,
      margin: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
    });

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("PDF_GEN_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (browser) await browser.close();
  }
}
