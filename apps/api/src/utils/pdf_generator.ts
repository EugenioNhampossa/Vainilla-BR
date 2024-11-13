import { InternalServerErrorException } from '@nestjs/common';
const ejs = require('ejs');
const path = require('path');
const puppeteer = require('puppeteer');

export async function generatePdf(data: any, fileName: string) {
  try {
    const filePath = path.resolve(__dirname, '..', 'templates', fileName);
    const html = await ejs.renderFile(filePath, data);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { timeout: 0 });
    await page.emulateMediaType('screen');
    const pdf = await page.pdf({
      printBackground: true,
      format: 'Letter',
    });
    await browser.close();
    return pdf;
  } catch (err) {
    console.error('Error:', err);
    throw new InternalServerErrorException(['Erro no servidor']);
  }
}


export async function generateHtml(data: any, fileName: string) {
  try {
    const filePath = path.resolve(__dirname, '..', 'templates', fileName);
    const html = await ejs.renderFile(filePath, data);
    return html;
  } catch (err) {
    console.error('Error:', err);
    throw new InternalServerErrorException(['Erro no servidor']);
  }
}
