# PRbots Radio Lab — Launch Plan

Working concept: a bilingual Puerto Rico indie + AI radio station that demonstrates AzuraCast streaming, a custom web player, AI voice/station IDs, artist submissions, CRM automation, and social publishing.

## Recommended production-lite stack

- **Streaming:** AzuraCast on a DigitalOcean Basic Droplet
- **Server size:** 4 GiB RAM, 2 vCPU, 80 GiB SSD
- **OS:** Ubuntu 22.04 LTS
- **Region:** nearest available New York region
- **Public site:** GitHub Pages / PMGPT landing page
- **AI + CRM:** PMGPT widget, forms, flows, Google Sheets, and social channels
- **Domain pattern:** `radio.example.com` for AzuraCast and a separate public website domain/subdomain

## Why this size

AzuraCast lists 2 GiB RAM and 20 GiB disk as bare minimums, while 4 GiB RAM and 40 GiB disk are its recommended hobby requirements. The selected Droplet leaves room for the database, AutoDJ, artwork, station IDs, and a modest music library.

## Launch sequence

1. Create the Droplet using `cloud-init.yaml` from this directory.
2. Point a DNS A record such as `radio.yourdomain.com` to the Droplet IPv4 address.
3. Finish the AzuraCast browser setup and create the administrator account.
4. Enable Let's Encrypt and Always Use HTTPS.
5. Create one station with AutoDJ and Icecast.
6. Enable the web proxy so the public player uses HTTPS.
7. Upload only original, properly licensed, Creative Commons, or directly authorized music.
8. Create playlists for Morning, Daytime, Night, Station IDs, and Demo Segments.
9. Connect the public website to `/api/nowplaying/<station-shortcode>`.
10. Test live input with Mixxx or BUTT.
11. Add PMGPT artist submission, listener signup, and AI station concierge.
12. Publish launch posts through the connected Facebook, Instagram, and X accounts.

## Suggested programming for the demo

- Puerto Rico and Caribbean independent artists
- AI-generated instrumental beds and transitions
- Short bilingual AI-hosted technology segments
- Live creator interviews or community shows
- Scheduled station IDs every 15–20 minutes

## Required secrets and information

Do not commit any of these to GitHub:

- AzuraCast administrator password
- DJ/source passwords
- AzuraCast API keys
- VPS root credentials or private SSH keys
- DNS provider credentials

Use GitHub Actions secrets or a secure server-side environment for any later authenticated integration.

## Acceptance checklist

- [ ] HTTPS AzuraCast dashboard available
- [ ] Public HTTPS audio stream works on mobile and desktop
- [ ] AutoDJ continues after browser closes
- [ ] Now Playing title, artwork, listeners, and recent tracks render on site
- [ ] Live DJ can connect and disconnect without stopping AutoDJ
- [ ] Artist submission reaches CRM/Google Sheet
- [ ] AI station assistant answers programming and submission questions
- [ ] Social launch content is ready
- [ ] Backups and update procedure are documented
