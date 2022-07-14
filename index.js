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
const agendaPath = process.env.AGENDA_PATH + '';
const port = Number(process.env.PORT);
const sslPort = Number(process.env.SSL_PORT);
const sslKey = process.env.SSL_KEY + '';
const sslCert = process.env.SSL_CERT + '';

async function doCreateTrainingFiles(triggers){
  console.log(triggers);
  console.log(nliPath);
  console.log(nluPath);
  console.log(agendaPath);

  await makeDir(nliPath);
  await makeDir(nluPath);
  await makeDir(agendaPath);

  for (let t in triggers) {
    let tName = triggers[t];
    touch.sync(path.join(nliPath, tName + '.txt'));
    touch.sync(path.join(nluPath, tName + '.txt'));
    touch.sync(path.join(nluPath, 'NOT' + tName + '.txt'));
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

  const training=req.header('TRAINING');
  console.log('TRAINING: ' + training);
  
  const agenda=req.header('AGENDA');
  console.log('AGENDA: ' + agenda);

  res.end('{"result":"SUCCESS"}');
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
