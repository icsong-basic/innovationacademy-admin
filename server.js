const express = require('express');
const path = require('path');
const app = express();
const axios = require('axios');
const setupProxy = require('./src/setupProxy');

app.use('/', express.static(path.join(__dirname, 'build')));
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.post('/refresh-faq', (req, res) => {
  const url = (req.host === 'admin.42seoul.kr' || req.host === 'admin.innovationacademy.kr') ? 'https://42seoul.kr/refresh-faq' : 'https://42seoul-test.azy.kr/refresh-faq';
  axios.post(url, undefined, req.headers.cookie ? {
    headers: {
      Cookie: req.headers.cookie
    }
  } : undefined).then(response => {
    res.send(200, response.data);
  }).catch(error => {
    if (error.response && error.response.data) {
      res.send(500, JSON.stringify(error.response.data));
      return;
    }
    res.send(500, error.toString());
  })
});
setupProxy(app);
app.listen(3000);