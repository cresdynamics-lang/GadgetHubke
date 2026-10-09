/** PM2 process file for Contabo (/var/www/sites/gadgethubke.com) */
module.exports = {
  apps: [
    {
      name: "gadgethub",
      cwd: "/var/www/sites/gadgethubke.com",
      script: "./dist/server/entry.mjs",
      interpreter: "/usr/bin/node",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        HOST: "127.0.0.1",
        PORT: "3030",
        REVIEWS_LOCAL_FILE: "1",
        PAYMENTS_MODE: "mock",
      },
    },
  ],
};
