#!/usr/bin/env node

const express = require('express'),
  app = express(),
  fs = require('fs'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  path = require('path');

// Helper Functions
const getDirectoryContents = require('./utils/getDirectoryContents');
const extractFileNameFromPath = require('./utils/extractFileNameFromPath');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
  origin: 'http://localhost:5000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.all('*', function(req, res,next) {
  const responseSettings = {
    "AccessControlAllowOrigin": req.headers.origin,
    "AccessControlAllowHeaders": "Content-Type, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name",
    "AccessControlAllowMethods": "POST, GET, PUT, DELETE, OPTIONS",
    "AccessControlAllowCredentials": true
  };

  res.header("Access-Control-Allow-Credentials", responseSettings.AccessControlAllowCredentials);
  res.header("Access-Control-Allow-Origin",  responseSettings.AccessControlAllowOrigin);
  res.header("Access-Control-Allow-Headers", req.headers['access-control-request-headers'] || "x-requested-with");
  res.header("Access-Control-Allow-Methods", req.headers['access-control-request-method'] || responseSettings.AccessControlAllowMethods);

  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});

/**
 * Reads content of a file
 */
app.get('/files/:path', function (req, res, next) {
  const filePath = path.join(req.params.path === 'root' ? process.cwd() : req.params.path);
  const fileName = extractFileNameFromPath(req.params.path);
  const fileStat = fs.statSync(filePath);

  if (fileStat.isDirectory()) {
    fs.readdir(filePath, (err, items) => {
      const files = getDirectoryContents(filePath, items);
      res.status(200).send(files);
    });
  } else {
    res.writeHead(200, {
      "Content-Type": "application/octet-stream",
      "Content-Disposition" : "attachment; filename=" + fileName
    });

    fs.createReadStream(filePath).pipe(res);
  }
});

/**
 * Saves content of a file
 */
app.post('/files/:path', function (req, res, next) {
  const filePath = path.join(req.params.path);

  fs.writeFile(filePath, req.body.content, { encoding: 'utf8' }, function(err) {
    if (err) {
      return res.status(422).send(err);
    }

    res.status(200).send({ status: 'OK' });
  });
});

app.listen(5000, function() {
  console.log('Listening on port 5000...')
});