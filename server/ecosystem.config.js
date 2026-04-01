module.exports = {
  apps: [{
    name: 'my-web-server',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    max_memory_restart: '256M',
    env: {
      NODE_ENV: 'production',
    },
  }],
};
