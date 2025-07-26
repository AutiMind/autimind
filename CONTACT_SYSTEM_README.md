# AutiMind Contact System

A comprehensive contact form system with database storage, admin dashboard, and email notifications built on Cloudflare Workers and D1.

## 🚀 Features

### ✅ Phase 1: Backend Infrastructure
- **Server-Side Rendering**: Converted from static to SSR using `@astrojs/cloudflare`
- **Cloudflare D1 Database**: Structured contact storage with full schema
- **API Endpoints**: RESTful contact submission with validation and rate limiting
- **Form Enhancement**: Real-time validation, loading states, and error handling

### ✅ Phase 2: Admin Dashboard
- **Protected Admin Interface**: Password-protected dashboard at `/admin`
- **Contact Management**: View, search, and manage all submissions
- **Status Tracking**: Mark contacts as new/read/responded/archived
- **Priority System**: Flag urgent or high-priority contacts
- **Admin Notes**: Add internal notes to contact records

### ✅ Phase 3: Alert System
- **Email Notifications**: Beautiful HTML emails with contact details
- **Webhook Integration**: Slack/Discord instant notifications
- **Multiple Channels**: Email + webhook for comprehensive coverage
- **Fallback System**: Graceful degradation if services are unavailable

### 🔄 Phase 4: Performance Optimizations (In Progress)
- Image optimization with Astro's `<Image />` component
- Bundle size optimization
- Core Web Vitals monitoring
- Service worker for offline capabilities

## 📋 Setup Instructions

### 1. Database Setup

Create your D1 databases:
```bash
# Production database
wrangler d1 create autimind-contacts

# Development database  
wrangler d1 create autimind-contacts-dev
```

Update `wrangler.toml` with the database IDs returned from the commands above.

Run migrations:
```bash
# Development
npm run db:migrate

# Production
npm run db:migrate:prod
```

### 2. Environment Variables

Configure email notifications (optional):
```bash
# For Resend API (recommended)
wrangler secret put EMAIL_API_KEY

# For Slack notifications
wrangler secret put WEBHOOK_URL
```

### 3. Admin Access

1. Update the admin password in `/src/pages/admin.astro` (line 6)
2. Navigate to `https://your-domain.com/admin`
3. Login with your password

### 4. Deployment

```bash
# Build and deploy
npm run deploy

# Or manually:
npm run build
wrangler pages deploy dist
```

## 🏗️ Architecture

### Database Schema
```sql
CREATE TABLE contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  priority TEXT DEFAULT 'normal',
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  admin_notes TEXT,
  responded_at DATETIME,
  user_agent TEXT,
  ip_address TEXT,
  source TEXT DEFAULT 'website'
);
```

### API Endpoints

#### `POST /api/contact`
Submit a new contact form:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Acme Corp",
  "subject": "Partnership Inquiry",
  "message": "We'd like to discuss..."
}
```

#### `GET/PATCH /api/admin/contacts/[id]`
Admin-only endpoints for managing contacts (requires authentication).

### Rate Limiting
- 5 submissions per hour per IP address
- Automatic cleanup of rate limit records
- Configurable limits in `/src/pages/api/contact.ts`

### Security Features
- Input validation with Zod schemas
- SQL injection prevention with prepared statements
- XSS protection through proper escaping
- CORS configuration for API endpoints
- Admin authentication with secure cookies

## 📊 Admin Dashboard Features

### Contact Overview
- **Total Submissions**: Real-time count
- **Status Distribution**: Visual breakdown of contact statuses
- **Recent Activity**: Latest submissions with timestamps

### Contact Management
- **Status Updates**: One-click status changes
- **Priority Flagging**: Mark urgent/high priority contacts
- **Admin Notes**: Internal notes not visible to contacts
- **Quick Actions**: Reply via email, mark as read/responded

### Filtering & Search (Future Enhancement)
- Filter by status, priority, date range
- Search by name, email, company, or message content
- Export filtered results to CSV

## 📧 Notification System

### Email Notifications
Uses [Resend](https://resend.com) for reliable email delivery:
- **Rich HTML emails** with contact details
- **Plain text fallback** for compatibility
- **Direct action links** (reply, view admin)
- **Professional branding** with AutiMind styling

### Webhook Notifications
Supports Slack/Discord webhooks:
- **Instant notifications** for new submissions
- **Rich formatting** with structured data
- **Action buttons** for quick responses
- **Fallback handling** if webhook fails

### Setup Examples

#### Resend Email Setup
1. Sign up at [resend.com](https://resend.com)
2. Verify your domain
3. Get API key and set: `wrangler secret put EMAIL_API_KEY`

#### Slack Webhook Setup
1. Create Slack app with incoming webhook
2. Copy webhook URL
3. Set: `wrangler secret put WEBHOOK_URL`

## 🔧 Development

### Local Development
```bash
npm run dev
```

### Database Operations
```bash
# Run migrations
npm run db:migrate

# Query database
npm run db:query "SELECT * FROM contacts LIMIT 10"

# Production queries
npm run db:query:prod "SELECT COUNT(*) FROM contacts"
```

### Testing Contact Form
1. Visit `http://localhost:4321`
2. Scroll to contact form
3. Submit test data
4. Check `/admin` for submissions
5. Verify notifications (if configured)

## 📈 Monitoring & Analytics

### Built-in Logging
- Contact submission logs with IP and user agent
- Rate limiting events
- Email/webhook delivery status
- Database operation results

### Recommended Monitoring
- **Cloudflare Analytics**: Track form submission rates
- **D1 Metrics**: Monitor database performance
- **Error Tracking**: Sentry or similar for error monitoring
- **Uptime Monitoring**: Ensure admin dashboard availability

## 🔒 Security Best Practices

### Current Implementations
- ✅ Input validation and sanitization
- ✅ SQL injection prevention
- ✅ Rate limiting to prevent spam
- ✅ XSS protection
- ✅ Secure admin authentication

### Recommended Additions
- [ ] CAPTCHA for additional spam protection
- [ ] IP-based blocking for persistent abuse
- [ ] Admin session timeout
- [ ] Two-factor authentication for admin
- [ ] Regular security audits

## 📝 Customization

### Styling
Contact form styles are in `/src/components/ContactForm.tsx` using Tailwind CSS classes.

### Email Templates
Email templates are in `/src/lib/email.ts`. Customize HTML/text templates as needed.

### Admin Dashboard
Admin interface is in `/src/pages/admin.astro`. Modify layout, add features, or integrate with external tools.

### Database Schema
Add new fields by creating migration files in `/migrations/` directory.

## 🚨 Troubleshooting

### Common Issues

**Database Connection Failed**
- Check wrangler.toml database IDs
- Verify D1 database exists in Cloudflare dashboard
- Ensure proper authentication: `wrangler whoami`

**Admin Login Not Working**
- Verify password in `/src/pages/admin.astro`
- Check browser cookies are enabled
- Try incognito/private browsing mode

**Email Notifications Not Sending**
- Verify EMAIL_API_KEY is set correctly
- Check Resend dashboard for delivery status
- Review browser console for API errors

**Form Submissions Failing**
- Check network tab for API response errors
- Verify rate limiting isn't triggered
- Ensure database is accessible

### Support
For technical issues or questions:
1. Check the setup documentation above
2. Review Cloudflare D1 and Workers documentation
3. Contact your development team

---

## 🎯 Next Steps (Phase 4)

### Performance Optimizations
- [ ] Image optimization with `@astrojs/image`
- [ ] Bundle analysis and code splitting
- [ ] Service worker for offline functionality
- [ ] Core Web Vitals monitoring

### Advanced Features
- [ ] Contact form analytics dashboard
- [ ] Automated lead scoring
- [ ] CRM integration (Salesforce, HubSpot)
- [ ] Advanced spam detection
- [ ] Multi-language support

### Enhanced Admin Features
- [ ] Bulk operations (delete, export, status change)
- [ ] Advanced filtering and search
- [ ] Contact timeline and interaction history
- [ ] Email templates for common responses
- [ ] Dashboard widgets and charts

This contact system provides a solid foundation for lead management while maintaining security, performance, and user experience standards.