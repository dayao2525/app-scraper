module.exports = {
  apps: [{
    name: "app-scraper",
    script: "./src/index.js",
    instances: 1,
    cron_restart: '0 0 * * *',
    env: {
      "NODE_ENV": "production"
    },
    time: true,
    out_file: "./data/log/out.log",
    error_file: "./data/log/error.log",
  }]
}