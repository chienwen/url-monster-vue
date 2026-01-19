# URL Monster

[Install from Chrome Web Store](https://chrome.google.com/webstore/detail/url-monster/beabfimakokhfnnkabnjdelbkgaobhjh)

A Chrome Extension that helps you edit URLs with ease.

## Features

URL Monster can help you edit URL:
1. List scheme/host/port/path/queries/fragment of the current URL as separate components
2. Create/edit/delete/decode/encode/copy components
3. Rebuild the full URL and apply to current/new tab

## Manifest V3 Upgrade ✨

This extension has been upgraded to **Manifest V3**, ensuring compatibility with the latest Chrome Extension standards and future-proofing the extension.

### What's New in V3

- ✅ Updated to `manifest_version: 3`
- ✅ Migrated from `browser_action` to `action`
- ✅ Converted background scripts to service worker
- ✅ Updated Content Security Policy format
- ✅ Integrated GA4 Measurement Protocol API
- ✅ Replaced deprecated APIs (clipboard, etc.)

## Development Setup

### Prerequisites

- Node.js v10 or higher (tested with v23)
- npm

### Installation

```bash
# Install dependencies
npm install --ignore-scripts

# Copy environment variables template
cp .env.example .env

# Edit .env and add your GA4 API Secret (optional)
# GA4_API_SECRET=your_api_secret_here

# Build the extension
npm run build
```

### Load Unpacked Extension

1. Open `chrome://extensions/` in Chrome
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `dist/` directory

## Google Analytics 4 Setup (Optional)

This extension uses GA4 Measurement Protocol API for usage tracking.

### Quick Start

1. **Get API Secret:**
   - Go to [Google Analytics](https://analytics.google.com/)
   - Navigate to Admin > Data Streams > [Your Stream]
   - Scroll to "Measurement Protocol API secrets"
   - Create a new API secret
   - Copy the secret

2. **Configure Environment Variable:**
   ```bash
   # Edit .env file
   GA4_API_SECRET=your_api_secret_here
   ```

3. **Rebuild:**
   ```bash
   npm run build
   ```

4. **Reload Extension:**
   - Go to `chrome://extensions/`
   - Click the reload button on URL Monster

### Tracked Events

- `page_view`: When popup is opened
- `parse_error`: When URL parsing fails
  - `error_type`: 'furl' or 'comp'

**Note:** GA4 real-time reports may take 5-30 minutes to show data.

## Security Notes 🔒

### Environment Variables

This project uses environment variables to protect sensitive API keys in the source code:

- API secrets are stored in `.env` (git-ignored)
- `.env.example` provides a template
- Secrets are injected during build via webpack

### Important Limitation

⚠️ **Chrome Extension Security Reality:**

Even with environment variables, the API Secret will be visible in the bundled JavaScript after building. Anyone who installs the extension can inspect the source code at `chrome://extensions/`.

**Why this is acceptable for GA4:**

- GA4 Measurement Protocol API Secret has limited risk
- It only allows sending analytics data, not accessing your account
- Worst case: someone sends fake data to your GA4 property
- Solution: Regenerate the API secret and publish an update

**Best Practices:**

1. ✅ Use environment variables to protect source code
2. ✅ Use a dedicated GA4 property for this extension
3. ✅ Monitor for unusual analytics data
4. ✅ Rotate API secrets periodically if needed
5. ⚠️ Don't worry excessively - it's not a payment or authentication API

## Build Scripts

```bash
# Production build
npm run build

# Development build
npm run build:dev

# Watch mode
npm run watch

# Lint
npm run lint
```

## Tech Stack

- Vue.js 2.x
- Vuex (state management)
- Webpack 4
- Sass/SCSS
- Babel

## Change Log

* **version 3.0.0** - Manifest V3 upgrade, GA4 integration, modern tooling
* version 2.1.0 - fix query typing issue
* version 2.0.0 - remake with Vue.js
* version 1.1 - add viewport meta for mobile devices
* version 1.0 - initial version


