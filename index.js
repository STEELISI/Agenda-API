require('dotenv').config();
const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const app = express();
const makeDir = require('make-dir');
const path = require('node:path');
const touch = require('touch');
const nliPath = process.env.NLI_PATH + '';
const nluPath = process.env.NLU_PATH + '';
const port = Number(process.env.PORT);
const sslPort = Number(process.env.SSL_PORT);
const sslKey = process.env.SSL_KEY + '';
const sslCert = process.env.SSL_CERT + '';

async function doCreateTrainingFiles(triggers){
  console.log(triggers);
  console.log(nliPath);
  console.log(nluPath);

  await makeDir(nliPath);
  await makeDir(nluPath);

  for (let t in triggers) {
    touch.sync(path.join(nliPath, t + '.txt'));
    touch.sync(path.join(nluPath, t + '.txt'));
    touch.sync(path.join(nluPath, 'NOT' + t + '.txt'));
  }
}

function createTrainingFiles(t){
  doCreateTrainingFiles(t).then((result) => {});
}

app.use(cors());

app.get('/', (req, res) => {
  res.send('Agenda-Express API Running.');
});

app.post('/', (req, res) => {
  const triggers=req.header('TRIGGERS');
  console.log('TRIGGERS: ' + triggers);
  createTrainingFiles(triggers.split(','));
  res.end('SUCCESS');
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

fs.stat(sslCert, function(err, stat) {
  if (err == null) {
    const httpsServer = https.createServer({
      key: fs.readFileSync(sslKey),
      cert: fs.readFileSync(sslCert),
    }, app);
    httpsServer.listen(sslPort, () => { console.log('HTTPS Server on port ' + sslPort); });
  }
});
