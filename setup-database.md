# Database Setup Instructions

## Prerequisites
- Cloudflare account with Workers and D1 access
- Wrangler CLI installed and configured (`npm install -g wrangler`)
- Authenticated with Cloudflare (`wrangler auth login`)

## Database Setup

### 1. Create D1 Databases

Create production database:
```bash
wrangler d1 create autimind-contacts
```

Create development database:
```bash
wrangler d1 create autimind-contacts-dev
```

### 2. Update wrangler.toml

Copy the database IDs from the previous commands and update `wrangler.toml`:
- Replace `TBD` in the production `database_id` field
- Replace `TBD` in the development `database_id` field

### 3. Run Migrations

Apply migrations to production:
```bash
wrangler d1 execute autimind-contacts --file=./migrations/0001_initial_contacts_table.sql
```

Apply migrations to development:
```bash
wrangler d1 execute autimind-contacts-dev --file=./migrations/0001_initial_contacts_table.sql
```

### 4. Verify Database Setup

Check tables in production:
```bash
wrangler d1 execute autimind-contacts --command="SELECT name FROM sqlite_master WHERE type='table';"
```

Check tables in development:
```bash
wrangler d1 execute autimind-contacts-dev --command="SELECT name FROM sqlite_master WHERE type='table';"
```

## Deployment

### 1. Build the Application
```bash
npm run build
```

### 2. Deploy to Cloudflare Pages
```bash
wrangler pages deploy dist
```

### 3. Set Environment Variables (Optional)

For email notifications (Phase 3):
```bash
wrangler secret put ADMIN_PASSWORD
wrangler secret put EMAIL_API_KEY
wrangler secret put EMAIL_FROM
wrangler secret put EMAIL_TO
```

## Admin Access

1. Navigate to `https://your-domain.com/admin`
2. Use password: `autimind2025!` (change this in `/src/pages/admin.astro`)
3. View and manage contact submissions

## Development

For local development with D1:
```bash
npm run dev
```

The development server will automatically use the local D1 database.

## Troubleshooting

### Database Connection Issues
- Ensure wrangler.toml has correct database IDs
- Check Cloudflare dashboard for D1 database status
- Verify authentication: `wrangler whoami`

### Migration Issues
- Check SQL syntax in migration files
- Verify file paths are correct
- Run migrations one at a time if batch fails

### Deployment Issues
- Ensure all dependencies are installed
- Check build output for errors
- Verify Cloudflare Pages configuration

## Security Notes

1. **Change Admin Password**: Update the password in `/src/pages/admin.astro`
2. **Use HTTPS**: Ensure your domain uses SSL/TLS
3. **Regular Backups**: Export contact data regularly
4. **Monitor Access**: Check admin access logs periodically

## Data Export

Export contacts to CSV:
```bash
wrangler d1 execute autimind-contacts --command="SELECT * FROM contacts;" --output=csv
```