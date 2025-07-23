const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generateWhitepaperPDF() {
    console.log('Starting PDF generation...');
    
    try {
        // Read the HTML content
        const htmlContent = fs.readFileSync('comprehensive-whitepaper-detailed.html', 'utf8');
        
        // Launch browser
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });
        
        const page = await browser.newPage();
        
        // Set content and wait for it to load
        await page.setContent(htmlContent, { 
            waitUntil: ['networkidle0', 'domcontentloaded']
        });
        
        // Generate PDF with professional settings
        const pdf = await page.pdf({
            format: 'Letter',
            margin: {
                top: '0.5in',
                right: '0.5in',
                bottom: '0.5in',
                left: '0.5in'
            },
            printBackground: true,
            preferCSSPageSize: true,
            displayHeaderFooter: false
        });
        
        // Write to public folder
        fs.writeFileSync('public/autimind-whitepaper.pdf', pdf);
        
        console.log('✅ PDF generated successfully: public/autimind-whitepaper.pdf');
        console.log(`📄 File size: ${(pdf.length / 1024 / 1024).toFixed(2)} MB`);
        
        await browser.close();
        
        // Verify the file was created
        if (fs.existsSync('public/autimind-whitepaper.pdf')) {
            const stats = fs.statSync('public/autimind-whitepaper.pdf');
            console.log(`✅ Verification: PDF file created (${stats.size} bytes)`);
            console.log('🚀 Ready for download at: https://autimind.com/autimind-whitepaper.pdf');
        } else {
            console.error('❌ Error: PDF file was not created');
        }
        
    } catch (error) {
        console.error('❌ Error generating PDF:', error.message);
        process.exit(1);
    }
}

generateWhitepaperPDF();