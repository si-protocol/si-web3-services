const path = require('path');
const serviceName = path.basename(__dirname);

module.exports = {
  apps: [{
    name: serviceName,
    script: './dist/main.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    restart_delay: 5000, 
    exp_backoff_restart_delay: 100, 
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    },
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    error_file: 'logs/err.log',
    out_file: 'logs/out.log'
  }]
};
