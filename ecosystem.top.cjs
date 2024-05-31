module.exports = {
  apps: [
    {
      name: "app-top-scraper",
      script: "./src/top.js",
      instances: 1,
      cron_restart: '0 */1 * * *',
      env: {
        "NODE_ENV": "production"
      },
      time: true,
      out_file: "./data/log/out-top.log",
      error_file: "./data/log/error-top.log",
    }
  ]
}