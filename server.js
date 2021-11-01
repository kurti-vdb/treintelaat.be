"use strict";
require('dotenv').config();

const express         = require("express");
const morgan          = require("morgan");
const mongoose        = require("mongoose");
const bodyParser      = require("body-parser");
const logger          = require("./restapi/utils/logger");
const config          = require('./restapi/config/database.js');
const userRouter      = require("./restapi/routes/user");
const delayRouter      = require("./restapi/routes/delay");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan(":date :remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms"));

app.use(userRouter);
app.use(delayRouter);
//app.use('/api/user/', userRouter);

mongoose.connect(config.mongodb.host, { useNewUrlParser: true, useUnifiedTopology: true },  function(err) {
  if (err)
    logger.info('Not connected to MongoDB: ' + err);
  else
    logger.info('Successfully connected to MongoDB');
});

app.listen(port, function () {
  logger.info("treintelaat.be restapi started on port " + port);
});

