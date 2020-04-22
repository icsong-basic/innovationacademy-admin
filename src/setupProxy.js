const proxy = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    proxy('/api', {
      target: 'https://admin-test.innovationacademy.kr',
      changeOrigin: true
    })
  );
  app.use(
    proxy('/refresh-faq', {
      target: 'https://42seoul-test.azy.kr/',
      changeOrigin: true
    })
  );
};