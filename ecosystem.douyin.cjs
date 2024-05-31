module.exports = {
  apps: [
    {
      name: "app-douyin-scraper",
      script: "./src/douyin.js",
      instances: 1,
      cron_restart: '*/1 * * * *',
      env: {
        "NODE_ENV": "production"
      },
      time: true,
      out_file: "./data/log/out-douyin.log",
      error_file: "./data/log/error-douyin.log",
    }
  ]
}