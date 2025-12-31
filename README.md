# 🚀 React and Tailwind Starter Kit

Quickly set up a new `React.js` project with Tailwind CSS using the [starter kit](https://github.com/labnol/react-tailwind). The project was bootstrapped with Vite (replacing Create React App) and it uses the `singlefile` plugin to inline all the JavaScript and CSS files into a single minified file.

The latest version of the starter kit is built with React 19 and Tailwind CSS 4.

## Live Demo

The [Digital Inspiration](https://digitalinspiration.com/) website is built with the Tailwind CSS, React.js and Vite. You can test the starter kit by opening the project in [StackBlitz](https://stackblitz.com/github/labnol/react-tailwind) or [CodeSandbox](https://codesandbox.io/p/sandbox/github/labnol/react-tailwind).

[![Screenshot](screenshot.png)](https://stackblitz.com/github/labnol/react-tailwind)

[![Open in StackBlitz](https://img.shields.io/badge/Open_In_StackBlitz-blue.svg?logo=stackblitz&style=flat-square)](https://stackblitz.com/github/labnol/react-tailwind) [![Open in CodeSandbox](https://img.shields.io/badge/Open_In_CodeSandbox-000000?logo=codesandbox&style=flat-square)](https://codesandbox.io/p/sandbox/github/labnol/react-tailwind)

### Available `npm` commands

In the project directory, you can run:

#### `npm run start`

Runs the app in the development mode.

Open `http://localhost:5173` to view it in the browser. The page will reload if you make edits. You will also see any lint errors in the console.

#### `npm run build`

Builds the React app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

#### `npm run inline`

This command will inline all the JavaScript and CSS files from the production build into a single minified file.

## Connect with me

The React and Tailwind CSS starter is written by [Amit Agarwal](https://www.labnol.org/about).

[![X](https://img.shields.io/badge/Twitter-black.svg?logo=X&logoColor=white&style=flat)](https://x.com/labnol) [![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?logo=YouTube&logoColor=white&style=flat)](https://www.youtube.com/labnol) [![Google](https://img.shields.io/badge/Google-black.svg?logo=Google&logoColor=white&style=flat)](https://g.dev/amit) [![Instagram](https://img.shields.io/badge/Instagram-%23E4405F.svg?logo=Instagram&logoColor=white&style=flat)](https://instagram.com/labnol) [![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white&style=flat)](https://linkedin.com/in/labnol) [![Stack Overflow](https://img.shields.io/badge/-Stackoverflow-FE7A16?logo=stack-overflow&logoColor=white&style=flat)](https://stackoverflow.com/users/512127/amit-agarwal)

If you have any questions or feedback, send an email at [amit@labnol.org](mailto:amit@labnol.org?subject=Tailwind+React).

🟦 1. Overview
Klupar.com  is hosted on Azure Static Web Apps (SWA) with a companion Azure Function App that powers the whisperEngine (AI greeter). DNS is managed through Cloudflare, with Cloudflare acting as the authoritative nameserver for the domain.

The architecture is intentionally simple, resilient, and low‑maintenance:

Frontend: React + Tailwind, deployed via GitHub → Azure SWA

Backend: Azure Function App (Node) for AI requests

DNS: Cloudflare for nameservers, DNSSEC disabled, apex + www mapped to SWA

SSL: Managed automatically by Azure Static Web Apps

CI/CD: GitHub Actions created automatically by SWA

This document explains how to maintain, update, and troubleshoot the system.

🟦 2. Azure Static Web App Deployment
2.1 Deployment Flow
The site deploys automatically whenever changes are pushed to the configured GitHub branch (typically main).

Azure SWA handles:

Build

Bundling

Deployment

CDN distribution

SSL certificate issuance

No manual deployment steps are required.

2.2 Build Configuration
The SWA GitHub Action uses:

app_location: "/"

output_location: "build" (React default)

Node version pinned by Azure’s build environment

If you ever change the build output folder, update the GitHub Action accordingly.

2.3 Environment Variables
Static Web Apps supports environment variables via:

Configuration → Application settings

Or .env files during build (not recommended for secrets)

The whisperEngine endpoint is configured in the frontend as an environment variable pointing to the Function App.

🟦 3. Azure Function App (whisperEngine)
3.1 Purpose
The Function App acts as the backend for:

AI greeter

Persona injection

Context extraction

Any future server-side logic

It exposes an HTTP endpoint consumed by the frontend.

3.2 Deployment
The Function App is deployed via:

GitHub Actions (if configured), or

Manual publish from VS Code (common during development)

3.3 Configuration
Key settings:

OPENAI_ENDPOINT

OPENAI_API_KEY

MODEL_NAME (e.g., gpt‑4o‑mini)

CORS allowed origins:

https://klupar.com

https://www.klupar.com

http://localhost:3000 (for development)

3.4 Logging
Logs are available in:

Azure Portal → Function App → Monitor

Azure Portal → Function App → Log Stream

Application Insights (if enabled)

🟦 4. DNS Configuration (Cloudflare)
4.1 Nameservers
Cloudflare is the authoritative DNS provider.

4.2 DNSSEC
DNSSEC is disabled.
This is required because Azure Static Web Apps cannot validate TXT records while DNSSEC signatures are present.

4.3 Required DNS Records
Apex domain (klupar.com)
Azure SWA requires:

Type	Name	Value	Purpose
A	@	75.2.60.5	SWA global endpoint
A	@	99.83.190.102	SWA global endpoint
TXT	@	_azure_swa_verification_token	Domain validation
www subdomain
Type	Name	Value	Purpose
CNAME	www	.azurestaticapps.net	SWA mapping
4.4 Email Routing
Cloudflare Email Routing is enabled for forwarding (optional).

4.5 CAA Records
None required.
If you ever add CAA records, ensure DigiCert is allowed:

Code
0 issue "digicert.com"
Azure uses DigiCert for SSL.

🟦 5. SSL Certificates
Azure Static Web Apps automatically issues and renews SSL certificates for:

klupar.com

www.klupar.com

No manual renewal is required.

If validation ever fails:

Check TXT record

Check DNSSEC is still disabled

Check for lingering RRSIG signatures

Check CAA records

🟦 6. Troubleshooting Guide
6.1 Apex domain stuck on “Validating”
Most common cause: DNSSEC residue.

Check with:

Code
Resolve-DnsName klupar.com -Type TXT -DnssecOk
If you see RRSIG, Azure will not validate until it disappears.

6.2 Browser redirect issues
Browsers aggressively cache 301 redirects.

Use:

Incognito mode

curl -I https://klupar.com

Chrome HSTS clearing page

6.3 Function App CORS errors
Ensure allowed origins include:

https://klupar.com

https://www.klupar.com

6.4 Static Web App not updating
Check:

GitHub Action logs

Build output folder

Branch mapping in Azure SWA

🟦 7. Operational Notes
7.1 Deployment cadence
Safe to deploy anytime — SWA handles zero‑downtime swaps.

7.2 Backups
Static Web Apps are immutable; the repo is the source of truth.
Function App settings should be exported periodically.

7.3 Domain transfers
If transferring again:

Disable DNSSEC before transfer

Wait for DS record removal

Re-enable only after Azure validation (if desired)

7.4 Future enhancements
Add chat UI (Copilot‑style)

Add additional Function App endpoints

Add logging/telemetry via Application Insights

Add staging environment via SWA “Environments”

🟦 8. Post‑Mortem Summary (DNSSEC Incident)
Root Cause
DNSSEC was enabled immediately after registrar transfer, while the registry still had the old DS record. Azure attempted TXT validation during this window and cached a failure.

Contributing Factors
DNSSEC signatures persisted in resolver caches

Azure’s resolvers are strict and slow to drop DNSSEC residue

Browser cached 301 redirect from apex → www

Resolution
DNSSEC disabled

Waited for RRSIG signatures to expire

Azure validated automatically

Lessons Learned
Avoid enabling DNSSEC immediately after a registrar transfer

Azure SWA does not support DNSSEC during validation

Browser caching can mask apex-domain issues

If you want, I can also generate:

A diagram of the architecture

A README‑style version for the repo

A runbook for on‑call troubleshooting

A glossary for future maintainers

Just tell me what direction you want to take thi