# Mixxx Live Broadcast Setup

Mixxx is the recommended live-DJ client for PRbots Radio Lab. AzuraCast receives the live source through Liquidsoap and automatically returns to AutoDJ when the DJ disconnects.

## 1. Create the DJ account

In AzuraCast:

1. Open the station.
2. Enable **Streamers/DJs** in the station profile.
3. Open **Streamers/DJ Accounts**.
4. Create an individual account for the DJ.
5. Copy the Icecast connection details shown by AzuraCast.

Use one account per person. Do not share the station administrator password or the AutoDJ source password.

## 2. Configure Mixxx

Open:

```text
Options → Preferences → Live Broadcasting
```

Use the values displayed by AzuraCast:

| Mixxx field | Value |
|---|---|
| Type | Icecast 2 |
| Host | AzuraCast Server value or direct server IP |
| Port | AzuraCast Port value |
| Login | DJ username |
| Password | DJ password |
| Mount | AzuraCast Mount Name, commonly `/` |
| Format | Ogg Vorbis for the source connection |

AzuraCast recommends Icecast 2. Its Liquidsoap backend can transcode the incoming Ogg Vorbis source into the station's configured public MP3/AAC mount points.

## 3. Metadata

Leave Mixxx track metadata enabled for normal music programs. For a talk show or continuous DJ set, enable custom metadata and use:

```text
Artist: DJ or host name
Title: Program name
```

Accurate metadata improves Now Playing, history, recordings, and reports.

## 4. Microphone test

Before going live:

- Select the correct microphone input in Mixxx.
- Confirm headphones do not feed the stream back into the microphone.
- Keep master levels below clipping.
- Test speech over music at a lower music gain.
- Record a local test before connecting.

## 5. Connection test

1. Start AutoDJ and listen to the public stream.
2. In Mixxx, enable live broadcasting.
3. Confirm the AzuraCast dashboard shows the DJ as live.
4. Confirm the public player changes from `AUTODJ` to `LIVE`.
5. Verify title/artist metadata.
6. Disable live broadcasting.
7. Confirm AutoDJ resumes without dead air.

## 6. Network note

If Cloudflare or another reverse proxy protects the AzuraCast hostname, the broadcaster port may not pass through it. Use the direct server IP or a DNS-only hostname for the Mixxx source connection. The listener-facing website and stream should still use HTTPS.

## 7. Live-show checklist

- [ ] Wired connection when available
- [ ] Local music files analyzed in Mixxx
- [ ] Microphone and monitoring tested
- [ ] DJ credentials confirmed
- [ ] Program metadata prepared
- [ ] Station contact available
- [ ] AutoDJ running before connection
- [ ] Public stream monitored on a second device
- [ ] DJ disconnect tested before the show
