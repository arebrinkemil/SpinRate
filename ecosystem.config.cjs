// PM2 ecosystem configuration for SpinRate
// Usage:
//   pm2 start ecosystem.config.cjs --env production
//   pm2 reload spinrate
//   pm2 logs spinrate

module.exports = {
  apps: [
    {
      name: 'spinrate',
      cwd: '/var/www/SpinRate',
      script: 'npm',
      args: 'run start',
      exec_mode: 'fork',
      instances: 1,
      watch: false,
      autorestart: true,
      max_memory_restart: '500M',
      time: true,
      env_file: '/var/www/SpinRate/.env',
      env: {
        NODE_ENV: 'production',
      },
      error_file: 'logs/pm2-error.log',
      out_file: 'logs/pm2-out.log',
      merge_logs: true,
    },
  ],
};
