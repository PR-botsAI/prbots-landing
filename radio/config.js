window.RADIO_CONFIG = Object.freeze({
  // Replace with your AzuraCast origin after deployment, for example:
  // apiBase: "https://radio.example.com/api",
  apiBase: "",

  // AzuraCast accepts the numeric station ID or station shortcode.
  stationId: "prbots-radio-lab",

  // Public Now Playing data is lightweight; 15 seconds is responsive without
  // placing unnecessary load on the station server.
  pollIntervalMs: 15000,

  stationName: "PRbots Radio Lab",
  tagline: "Puerto Rico indie music, Caribbean future sounds & AI radio",
  demoMode: true
});
