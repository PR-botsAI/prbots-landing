# AzuraCast API Integration

This project deliberately separates **public browser calls** from **authenticated management calls**.

## Public browser endpoints

These calls do not require an API key and can be made directly from the station website:

```text
GET  {AZURACAST_ORIGIN}/api/nowplaying/{station_id}
GET  {AZURACAST_ORIGIN}/api/nowplaying/{station_id}/art
GET  {AZURACAST_ORIGIN}/api/station/{station_id}/requests
POST {AZURACAST_ORIGIN}/api/station/{station_id}/request/{request_id}
```

The player currently uses the Now Playing endpoint. Song requests can be enabled later after the station's request rules and moderation policy are configured.

## Authenticated endpoints

Never call authenticated endpoints from browser JavaScript. API keys inherit the user's permissions and must remain in a server-side secret store.

Useful management endpoints include:

```text
POST /api/station/{station_id}/files/upload
GET  /api/station/{station_id}/playlists
POST /api/station/{station_id}/playlists
GET  /api/station/{station_id}/streamers
POST /api/station/{station_id}/streamers
POST /api/station/{station_id}/frontend/{action}
POST /api/station/{station_id}/backend/{action}
GET  /api/station/{station_id}/reports/overview
GET  /api/station/{station_id}/reports/soundexchange
```

Authentication header:

```http
Authorization: Bearer AZURACAST_API_KEY
```

`X-API-Key` is also supported, but Bearer authentication is preferred by the AzuraCast documentation.

## Recommended MCP/PMGPT bridge

Use a small server-side service between PMGPT and AzuraCast:

```text
PMGPT action / MCP tool
        |
        v
Radio API bridge
  - validates request
  - enforces allowed actions
  - loads API key from secrets
  - records an audit event
        |
        v
AzuraCast authenticated REST API
```

Do not expose a generic proxy. Implement a narrow allowlist of operations such as:

- `get_station_health`
- `upload_approved_media`
- `add_media_to_playlist`
- `create_dj_account`
- `restart_station_backend`
- `get_listener_summary`

Destructive or operational actions should require an administrator role and explicit confirmation.

## Configuration

Edit `config.js` after the AzuraCast station is running:

```js
window.RADIO_CONFIG = Object.freeze({
  apiBase: "https://radio.example.com/api",
  stationId: "prbots-radio-lab",
  pollIntervalMs: 15000,
  stationName: "PRbots Radio Lab",
  tagline: "Puerto Rico indie music, Caribbean future sounds & AI radio",
  demoMode: false
});
```

Use the public URL returned in `station.listen_url` instead of manually constructing an Icecast mount URL.

## CORS and HTTPS

The website and station must both use HTTPS. If direct browser requests are blocked by a custom proxy or CORS configuration, permit only the public site origin and the public `/api/nowplaying/*` routes. Do not relax CORS for authenticated endpoints.

## Versioning

Each installed AzuraCast instance exposes API documentation for its installed version. Treat that per-install schema as authoritative and regenerate any typed client when the instance is upgraded.
