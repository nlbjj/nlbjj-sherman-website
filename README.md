# Next Level Jiu-Jitsu Sherman Website

This is the website for Next Level Jiu-Jitsu Sherman, located in Sherman, Texas.

## Files Included

- `index.html` - Main website page
- `styles.css` - Website styling
- `assets/logo.svg` - Logo file
- `README.md` - This file

## GitHub Pages Deployment Instructions

Follow these steps to deploy your website to GitHub Pages and connect your custom domain:

### Step 1: Create GitHub Account (if you don't have one)

1. Go to [github.com](https://github.com)
2. Click "Sign up" and create your account
3. Verify your email address

### Step 2: Create a New Repository

1. Click the "+" icon in the top right corner
2. Select "New repository"
3. Name your repository: `nlbjj-sherman-website`
4. Make sure it's set to "Public"
5. Check "Add a README file"
6. Click "Create repository"

### Step 3: Upload Your Website Files

1. In your new repository, click "uploading an existing file"
2. Drag and drop all the website files:
   - `index.html`
   - `styles.css`
   - `assets/logo.svg`
3. Write a commit message: "Initial website upload"
4. Click "Commit changes"

### Step 4: Enable GitHub Pages

1. In your repository, click "Settings" tab
2. Scroll down to "Pages" in the left sidebar
3. Under "Source", select "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Click "Save"
6. GitHub will provide you with a URL like: `https://yourusername.github.io/nlbjj-sherman-website`

### Step 5: Configure Custom Domain

1. In the Pages settings, scroll to "Custom domain"
2. Enter your domain: `www.nlbjjsherman.com`
3. Click "Save"
4. GitHub will create a CNAME file in your repository

### Step 6: Configure DNS in Hostinger

1. Log into your Hostinger account
2. Go to Domains → Domain portfolio
3. Click "Manage" next to nlbjjsherman.com
4. Click "DNS / Nameservers" tab
5. Add these DNS records:

**For the main domain (nlbjjsherman.com):**
- Type: A Record
- Name: @ (or leave blank)
- Value: 185.199.108.153
- TTL: 3600

Add three more A records with these IP addresses:
- 185.199.109.153
- 185.199.110.153
- 185.199.111.153

**For the www subdomain:**
- Type: CNAME
- Name: www
- Value: yourusername.github.io
- TTL: 3600

### Step 7: Wait for DNS Propagation

- DNS changes can take up to 24-48 hours to propagate globally
- You can check if it's working by visiting your domain
- Use tools like [whatsmydns.net](https://whatsmydns.net) to check propagation status

### Step 8: Enable HTTPS

1. Back in GitHub Pages settings
2. Check "Enforce HTTPS" (this may take a few minutes to become available)

## Updating Your Website

To make changes to your website:

1. Edit the files in your GitHub repository
2. Commit the changes
3. GitHub Pages will automatically update your live website

## Support

If you need help with any of these steps, contact your web developer or GitHub support.

## Domain Information

- Domain: www.nlbjjsherman.com
- Registrar: Hostinger
- Hosting: GitHub Pages
- SSL: Provided by GitHub Pages

## Website Features

- Responsive design (works on mobile and desktop)
- Modern, professional appearance
- Fast loading
- SEO-friendly structure
- Accessible design

