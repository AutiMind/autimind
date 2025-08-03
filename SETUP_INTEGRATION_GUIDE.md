# AutiMind AI Assistant Integration Guide

## Quick Setup Instructions

Follow these steps to integrate the AI lead generation system into your AutiMind website.

## 🚀 Step 1: Add AI Assistant to Your Site

### Option A: Site-wide Integration (Recommended)

Edit your main layout file:

```astro
<!-- src/layouts/Layout.astro -->
---
// Add this import at the top
import AIAssistant from '../components/AIAssistant.tsx';
---

<html lang="en">
  <head>
    <!-- existing head content -->
  </head>
  <body>
    <slot />
    
    <!-- Add AI Assistant before closing body tag -->
    <AIAssistant 
      context="sales" 
      enableLeadCapture={true}
      client:load 
    />
  </body>
</html>
```

### Option B: Specific Pages Only

Add to individual pages where you want lead capture:

```astro
<!-- src/pages/services.astro or any other page -->
---
import Layout from '../layouts/Layout.astro';
import AIAssistant from '../components/AIAssistant.tsx';
---

<Layout title="AutiMind Services">
  <!-- your existing page content -->
  
  <!-- Add AI Assistant -->
  <AIAssistant 
    context="sales" 
    enableLeadCapture={true}
    client:load 
  />
</Layout>
```

## 🔧 Step 2: Environment Variables

Add these to your Cloudflare Pages environment variables:

### Production Environment
```bash
BREAKCOLD_WEBHOOK_SECRET=wk_354a4803ba2384
BREAKCOLD_API_KEY=your_breakcold_api_key_here
BREAKCOLD_SECRET_STORE_ID=383e46b47c2749a1804ba0c434b80b47
```

### Preview Environment (same values)
```bash
BREAKCOLD_WEBHOOK_SECRET=wk_354a4803ba2384
BREAKCOLD_API_KEY=your_breakcold_api_key_here
BREAKCOLD_SECRET_STORE_ID=383e46b47c2749a1804ba0c434b80b47
```

## 🔗 Step 3: Breakcold Webhook Setup

1. **Go to Breakcold Dashboard** → Settings → Webhooks
2. **Create New Webhook** with these settings:
   - **URL**: `https://autimind.pages.dev/api/breakcold/webhook`
   - **Secret**: `wk_354a4803ba2384`
   - **Events**: Select `lead.create`, `lead.update`, `lead.delete`

## 🧪 Step 4: Test the Integration

### Test Commands
```bash
# Test webhook endpoint
curl -X GET https://autimind.pages.dev/api/breakcold/webhook

# Test lead creation
curl -X POST https://autimind.pages.dev/api/leads/create \
  -H "Content-Type: application/json" \
  -d '{"email": "test@university.edu", "firstName": "Test", "company": "Test University"}'
```

### Expected Responses
- **Webhook GET**: `{"service":"AutiMind Breakcold Webhook Endpoint","status":"active"...}`
- **Lead Creation**: `{"success":true,"data":{"id":"..."},"message":"AutiMind lead created successfully"}`

## 📱 Step 5: Deploy

```bash
# Build and deploy
npm run build
npm run deploy
```

## ✅ Verification Checklist

- [ ] AI Assistant appears as chat bubble in bottom-right corner
- [ ] Clicking opens educational AI conversation
- [ ] Webhook endpoint returns active status
- [ ] Environment variables are configured
- [ ] Breakcold webhook is active
- [ ] Test lead creation works

## 🎯 Customization Options

### Different Contexts
```astro
<!-- For technical support pages -->
<AIAssistant context="technical" enableLeadCapture={false} client:load />

<!-- For general information pages -->
<AIAssistant context="general" enableLeadCapture={true} client:load />

<!-- For sales/services pages (default) -->
<AIAssistant context="sales" enableLeadCapture={true} client:load />
```

### Custom Styling
The AI Assistant uses Tailwind classes and matches your AutiMind gradient design system. It will automatically inherit your site's styling.

## 🚨 Troubleshooting

### Chat Button Not Appearing
- Check that `client:load` directive is included
- Verify React dependencies are installed
- Check browser console for JavaScript errors

### Leads Not Creating in CRM
- Verify `BREAKCOLD_API_KEY` environment variable
- Check Cloudflare Functions logs for errors
- Test webhook endpoint manually

### Styling Issues
- Ensure Tailwind CSS is loaded on the page
- Check for CSS conflicts with existing styles
- Verify Lucide React icons are rendering

## 📞 Need Help?

If you encounter issues:
1. Check the comprehensive documentation in `AUTIMIND_AI_SYSTEM_DOCS.md`
2. Review Cloudflare Functions logs
3. Test individual components with the provided curl commands
4. Verify all environment variables are set correctly

Your AutiMind AI assistant is now ready to capture educational technology leads! 🎓