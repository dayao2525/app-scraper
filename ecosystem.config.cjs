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
  },
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
  },
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