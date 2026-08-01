export class AzuraCastPublicClient {
  constructor({ apiBase, stationId }) {
    this.apiBase = String(apiBase || "").replace(/\/$/, "");
    this.stationId = String(stationId || "").trim();
  }

  get isConfigured() {
    return Boolean(this.apiBase && this.stationId);
  }

  async getNowPlaying({ signal } = {}) {
    this.#assertConfigured();
    return this.#get(`/nowplaying/${encodeURIComponent(this.stationId)}`, signal);
  }

  async getRequestableSongs({ signal } = {}) {
    this.#assertConfigured();
    return this.#get(`/station/${encodeURIComponent(this.stationId)}/requests`, signal);
  }

  async submitRequest(requestId, { signal } = {}) {
    this.#assertConfigured();
    if (!requestId) throw new Error("A request ID is required.");

    const response = await fetch(
      `${this.apiBase}/station/${encodeURIComponent(this.stationId)}/request/${encodeURIComponent(requestId)}`,
      { method: "POST", headers: { Accept: "application/json" }, signal }
    );

    if (!response.ok) {
      throw new Error(`AzuraCast request failed with HTTP ${response.status}.`);
    }

    return response.json();
  }

  async #get(path, signal) {
    const response = await fetch(`${this.apiBase}${path}`, {
      headers: { Accept: "application/json" },
      signal
    });

    if (!response.ok) {
      throw new Error(`AzuraCast API returned HTTP ${response.status}.`);
    }

    return response.json();
  }

  #assertConfigured() {
    if (!this.isConfigured) {
      throw new Error("AzuraCast API base URL and station ID are not configured.");
    }
  }
}
