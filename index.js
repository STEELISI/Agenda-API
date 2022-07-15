require('dotenv').config();
const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const yaml = require('yaml');
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

async function doCreateTrainingFiles(triggers, training, agenda){
  console.log('Creating Training Files...');
  console.log(agenda['name'] + ':' + triggers);

  await makeDir(nliPath);
  await makeDir(nluPath);
  await makeDir(agendaPath);

  let agendaYaml = yaml.stringify(agenda);
  let agendaFile = path.join(agendaPath, agenda['name'] + '.yaml');
  writeFile(agendaFile, agendaYaml);

  for (let t in triggers) {
    let tName = triggers[t];
    let nli = training[tName + '_nli'] + '';
    let nlu = training[tName + '_nlu'] + '';
    let nluNot = training[tName + '_nlu_not'] + '';

    let nliFile = path.join(nliPath, tName + '.txt');
    touch.sync(nliFile);
    if (nli) {
      writeFile(nliFile, nli);
    }

    let nluTriggerPath = path.join(nluPath, tName);
    await makeDir(nluTriggerPath);

    let nluFile = path.join(nluTriggerPath, tName + '.txt');
    touch.sync(nluFile);
    if (nlu) {
      writeFile(nluFile, nlu);
    }

    let nluNotFile = path.join(nluTriggerPath, 'NOT' + tName + '.txt')
    touch.sync(nluNotFile);
    if (nluNot) {
      writeFile(nluNotFile, nluNot);
    }
  }
}

function writeFile(filename, data){
  fs.writeFile(filename, data, (err) => {
    if (err) throw err;
  })
}

function createTrainingFiles(t, training, agenda){
  doCreateTrainingFiles(t, training, agenda).then((result) => {});
}

app.use(cors());

app.get('/', (req, res) => {
  res.send('Agenda-Express API Running.');
});

app.post('/', (req, res) => {
  const triggers = req.header('TRIGGERS').split(',');
  const training = JSON.parse(req.header('TRAINING'));
  const agenda = JSON.parse(req.header('AGENDA'));
  createTrainingFiles(triggers, training, agenda);
  res.end('{"result":"SUCCESS"}');
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
  console.log('NLI Path: ' + nliPath);
  console.log('NLU Path: ' + nluPath);
  console.log('Agenda Path: ' + agendaPath);
  console.log('SSL Port: ' + sslPort);
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
