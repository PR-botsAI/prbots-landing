import { AzuraCastPublicClient } from "./azuracast-client.js";

const config = window.RADIO_CONFIG || {};
const client = new AzuraCastPublicClient(config);

const elements = {
  stationName: document.querySelector("[data-station-name]"),
  tagline: document.querySelector("[data-tagline]"),
  artwork: document.querySelector("[data-artwork]"),
  title: document.querySelector("[data-title]"),
  artist: document.querySelector("[data-artist]"),
  listeners: document.querySelector("[data-listeners]"),
  liveBadge: document.querySelector("[data-live-badge]"),
  status: document.querySelector("[data-status]"),
  history: document.querySelector("[data-history]"),
  progress: document.querySelector("[data-progress]"),
  elapsed: document.querySelector("[data-elapsed]"),
  duration: document.querySelector("[data-duration]"),
  playButton: document.querySelector("[data-play]"),
  audio: document.querySelector("audio")
};

const demoPayload = {
  station: {
    name: config.stationName || "PRbots Radio Lab",
    listen_url: ""
  },
  listeners: { current: 0 },
  live: { is_live: false, streamer_name: "" },
  now_playing: {
    elapsed: 42,
    duration: 186,
    song: {
      title: "Waiting for the AzuraCast signal",
      artist: "PRbots Radio Lab",
      text: "PRbots Radio Lab - Waiting for the AzuraCast signal",
      art: ""
    }
  },
  song_history: [
    { song: { title: "Boricua Morning Energy", artist: "Demo programming" } },
    { song: { title: "Caribbean Future Sounds", artist: "Demo programming" } },
    { song: { title: "Creator Spotlight", artist: "Demo programming" } }
  ]
};

let currentStreamUrl = "";
let pollTimer = null;
let currentAbortController = null;

function formatTime(value) {
  const seconds = Math.max(0, Number(value) || 0);
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

function normalizePayload(payload) {
  const song = payload?.now_playing?.song || {};
  return {
    stationName: payload?.station?.name || config.stationName || "PRbots Radio Lab",
    title: song.title || song.text || "Unknown title",
    artist: song.artist || "Unknown artist",
    artwork: song.art || "",
    streamUrl: payload?.station?.listen_url || payload?.mounts?.[0]?.url || "",
    listeners: Number(payload?.listeners?.current) || 0,
    isLive: Boolean(payload?.live?.is_live),
    streamerName: payload?.live?.streamer_name || "Live DJ",
    elapsed: Number(payload?.now_playing?.elapsed) || 0,
    duration: Number(payload?.now_playing?.duration) || 0,
    history: Array.isArray(payload?.song_history) ? payload.song_history.slice(0, 5) : []
  };
}

function render(payload, { demo = false } = {}) {
  const data = normalizePayload(payload);
  elements.stationName.textContent = data.stationName;
  elements.tagline.textContent = config.tagline || "Live independent radio";
  elements.title.textContent = data.title;
  elements.artist.textContent = data.artist;
  elements.listeners.textContent = `${data.listeners} listener${data.listeners === 1 ? "" : "s"}`;
  elements.liveBadge.textContent = data.isLive ? `LIVE: ${data.streamerName}` : "AUTODJ";
  elements.liveBadge.dataset.live = String(data.isLive);
  elements.status.textContent = demo ? "Demo mode — add your AzuraCast URL in config.js" : "Connected to AzuraCast";

  if (data.artwork) {
    elements.artwork.src = data.artwork;
    elements.artwork.hidden = false;
  } else {
    elements.artwork.removeAttribute("src");
    elements.artwork.hidden = true;
  }

  const progress = data.duration > 0 ? Math.min(100, (data.elapsed / data.duration) * 100) : 0;
  elements.progress.value = progress;
  elements.elapsed.textContent = formatTime(data.elapsed);
  elements.duration.textContent = data.duration > 0 ? formatTime(data.duration) : "LIVE";

  elements.history.replaceChildren(
    ...data.history.map((item) => {
      const li = document.createElement("li");
      const historySong = item?.song || {};
      li.textContent = `${historySong.artist || "Unknown artist"} — ${historySong.title || historySong.text || "Unknown title"}`;
      return li;
    })
  );

  if (data.streamUrl && data.streamUrl !== currentStreamUrl) {
    currentStreamUrl = data.streamUrl;
    const wasPlaying = !elements.audio.paused;
    elements.audio.src = currentStreamUrl;
    if (wasPlaying) elements.audio.play().catch(() => setPlayingState(false));
  }
}

function setPlayingState(isPlaying) {
  elements.playButton.textContent = isPlaying ? "Pause" : "Listen Live";
  elements.playButton.setAttribute("aria-pressed", String(isPlaying));
}

async function refresh() {
  if (!client.isConfigured || config.demoMode) {
    render(demoPayload, { demo: true });
    return;
  }

  currentAbortController?.abort();
  currentAbortController = new AbortController();

  try {
    const payload = await client.getNowPlaying({ signal: currentAbortController.signal });
    render(payload);
  } catch (error) {
    if (error.name === "AbortError") return;
    elements.status.textContent = `Connection problem: ${error.message}`;
  }
}

elements.playButton.addEventListener("click", async () => {
  if (!currentStreamUrl) {
    elements.status.textContent = "The stream URL will appear after AzuraCast is configured.";
    return;
  }

  if (elements.audio.paused) {
    try {
      await elements.audio.play();
      setPlayingState(true);
    } catch (error) {
      elements.status.textContent = `Playback could not start: ${error.message}`;
      setPlayingState(false);
    }
  } else {
    elements.audio.pause();
    setPlayingState(false);
  }
});

elements.audio.addEventListener("play", () => setPlayingState(true));
elements.audio.addEventListener("pause", () => setPlayingState(false));
elements.audio.addEventListener("error", () => {
  elements.status.textContent = "The audio stream is currently unavailable.";
  setPlayingState(false);
});

refresh();
pollTimer = window.setInterval(refresh, Math.max(5000, Number(config.pollIntervalMs) || 15000));
window.addEventListener("beforeunload", () => {
  window.clearInterval(pollTimer);
  currentAbortController?.abort();
});
