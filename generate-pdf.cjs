const fs = require('fs');
const path = require('path');

// Simple HTML to PDF conversion using print CSS
async function generatePDF() {
    const htmlContent = fs.readFileSync('whitepaper-styled.html', 'utf8');
    
    // Check if puppeteer is available
    try {
        const puppeteer = require('puppeteer');
        
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        
        const pdf = await page.pdf({
            format: 'Letter',
            margin: {
                top: '0.5in',
                right: '0.5in',
                bottom: '0.5in',
                left: '0.5in'
            },
            printBackground: true,
            preferCSSPageSize: true
        });
        
        fs.writeFileSync('public/autimind-whitepaper.pdf', pdf);
        console.log('PDF generated successfully!');
        
        await browser.close();
    } catch (error) {
        console.log('Puppeteer not available, trying alternative method...');
        
        // Alternative: Use Chrome/Chromium directly if available
        try {
            const { execSync } = require('child_process');
            
            // Try to use Chrome headless
            const chromeCommand = `google-chrome --headless --disable-gpu --print-to-pdf=public/autimind-whitepaper.pdf --print-to-pdf-no-header file://${path.resolve('whitepaper-styled.html')}`;
            
            execSync(chromeCommand, { stdio: 'inherit' });
            console.log('PDF generated using Chrome headless!');
        } catch (chromeError) {
            console.log('Chrome not available, creating basic PDF instructions...');
            
            // Create instructions for manual PDF generation
            const instructions = `
To generate the PDF:
1. Open whitepaper-styled.html in a browser
2. Press Ctrl+P (or Cmd+P on Mac)
3. Choose "Save as PDF"
4. Set margins to 0.5 inches
5. Enable "Background graphics"
6. Save as autimind-whitepaper.pdf in the public folder

The HTML file is ready for professional PDF conversion.
            `;
            
            console.log(instructions);
            fs.writeFileSync('PDF_GENERATION_INSTRUCTIONS.txt', instructions);
        }
    }
}

generatePDF().catch(console.error);