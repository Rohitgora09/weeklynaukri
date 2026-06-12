import { spawn } from 'child_process';
import puppeteer from 'puppeteer';

async function test() {
  console.log("Starting Vite dev server...");
  const devServer = spawn('npx', ['vite', '--port', '5173'], {
    shell: true,
    cwd: process.cwd()
  });

  devServer.stdout.on('data', (data) => {
    console.log(`Vite: ${data.toString().trim()}`);
  });

  devServer.stderr.on('data', (data) => {
    console.error(`Vite Error: ${data.toString().trim()}`);
  });

  // Wait 3 seconds for Vite to start
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log("Launching Puppeteer...");
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Listen for browser logs and errors
  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE ${msg.type().toUpperCase()}] ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.error(`[BROWSER RUNTIME ERROR] ${err.stack || err.message}`);
  });

  try {
    console.log("Navigating to http://localhost:5173/...");
    await page.goto('http://localhost:5173/', { waitUntil: 'load', timeout: 10000 });
    console.log("Page loaded. Waiting 2 seconds for errors...");
    await new Promise(resolve => setTimeout(resolve, 2000));
  } catch (err) {
    console.error("Navigation failed:", err.message);
  } finally {
    console.log("Closing browser...");
    await browser.close();
    console.log("Stopping Vite dev server...");
    devServer.kill();
    process.exit(0);
  }
}

test().catch(err => {
  console.error("Test script failed:", err);
  process.exit(1);
});
