"use strict";
require('dotenv').config();

const express = require("express");
const jwt = require("jsonwebtoken");
const User = require('../models/mongo/user');
const logger = require("../utils/logger");
const checkAuth = require('../utils/auth-check');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const request = require('request');

const aws = require("aws-sdk");
const sharp = require("sharp");
const multer = require("multer");
const multerS3 = require("multer-s3");

const spacesEndpoint = new aws.Endpoint(process.env.DO_SPACES_ENDPOINT);
const s3 = new aws.S3({
    endpoint: spacesEndpoint,
    bucket: process.env.DO_SPACES_NAME,
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
    acl: "public-read",
    //acl: "private",
});


const router = express.Router();

router.use((req, res, next) => {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  next();
});

router.get("/api/user/", (req, res, next) => {
  res.status(200).json({ status: 'Success', response: "..." });
});

router.get("/api/user/delays", checkAuth.oAuth, function (req, res) {

  let delays = [];

  User.findOne({ _id: req.userID })
    .then(user => {
      res.status(200).send(delays);
    })
    .catch(err => {
      logger.error(err);
    })
});


router.post("/api/user/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ 'local.email': req.body.email })
    .then(user => {
      if(user == null) {
        throw new Error(`Authentication failed.`);
        //return res.status(401).send({ message: "Authentication failed" });
      }
      fetchedUser = user;
      return user.validPassword(req.body.password);
    })
    .then(result => {
      if(!result) {
        throw new Error(`Authentication failed.`);
      }
      const token = jwt.sign({ email: fetchedUser.local.email, id: fetchedUser._id }, process.env.JWT_SECRET, { expiresIn: "48h" });

      res.status(200).json({
        token: token,
        expiresIn: 3600 * 48,
        user: generateAngularUser(fetchedUser)
      });

    })
    .catch(err => {
      logger.error(err);
      return res.status(401).send({ message: "Authentication failed", error: err });
    })
});

router.post("/api/user/signup", (req, res, next) => {

  let fetchedUser;
  User.findOne({ 'local.email': req.body.email })
    .then((user) => {
      if (user) {
        res.status(200).json({ message: "User or email address already exists."});
      }
      else {
        user = new User();
        user.local.email = req.body.email;
        user.local.password = user.generateHash(req.body.password);
        user.account.avatar = user.generateAvatar();
        user.save();
        fetchedUser = user;
      }

      const token = jwt.sign({ email: fetchedUser.google.email, id: fetchedUser._id }, process.env.JWT_SECRET, { expiresIn: "48h" });

      res.status(200).json({
        token: token,
        expiresIn: 3600 * 48,
        user: generateAngularUser(fetchedUser)
      });

    })
    .catch(err => {
      logger.error(err);
      res.status(500).json({ message: "Try catch Error", error: err })
    })
});

router.post("/api/user/findemail", (req, res, next) => {
  User.find({ 'local.email': req.body.email })
    .then((response) => {
      res.json(response); // returns an array of users, empty if no user found.
    })
    .catch(err => {
      res.status(500).json({ message: "Error", error: err })
    })
});

router.post("/api/user/auth/google", (req, res, next) => {

  let fetchedUser;
  verifyGoogleToken(req.body.idToken).then(response => {

    User.findOne({ 'google.id' : response.sub }).then(user => {

      if(user) {
        if (!user.google.token) {
          user.google.token = req.body.idToken; // User exists, but unlinked his/her google account in the past, so re-link
        }
        user.account.avatar = response.picture; // Always update avatar, user can be logged in with other social account
        user.save();
        fetchedUser = user;
      }
      else {
        let user = new User(); // Create a brand new google user
        user.google.name = response.name;
        user.google.token = req.body.idToken;
        user.google.email = response.email;
        user.google.id = response.sub;
        user.account.username = acronym(response.name);
        user.account.firstname = response.given_name;
        user.account.lastname = response.family_name;
        user.account.avatar = response.picture;
        user.save();
        fetchedUser = user;
      }

      const token = jwt.sign({ email: fetchedUser.google.email, id: fetchedUser._id }, process.env.JWT_SECRET, { expiresIn: "48h" });

      res.status(200).json({
        token: token,
        expiresIn: 3600 * 48,
        user: generateAngularUser(fetchedUser)
      });

    }).catch(err => { return res.status(401).json({ message: "Er ging iets verkeerd", error: err }); }) // Mongo error
  })
  .catch(console.error); // Token verify error
})

router.post("/api/user/auth/facebook", (req, res, next) => {

  request('https://graph.facebook.com/me?access_token=' + req.body.authToken, function (err, response, user) {

    if(response.statusCode !== 200) {
      let body = JSON.parse(response.body);
      return res.status(400).json({ message: "Er ging iets verkeerd", err: body.error.message });
    }

    user = JSON.parse(user);

    if (!err && response.statusCode == 200 && req.body.name === user.name && req.body.id === user.id && user != null) {

      let fetchedUser;
      User.findOne({ 'facebook.id' : user.id }).then(user => {
        if(user) {
          if (!user.facebook.token) {
            user.facebook.token = req.body.authToken; // User exists, but unlinked his/her facebook account in the past, so re-link
          }
          user.account.avatar = req.body.photoUrl; // Always update avatar, user can be logged in with other social account
          user.save();
          fetchedUser = user;
        }
        else {
          let user = new User(); // Create a brand new facebook user
          user.facebook.name = req.body.name;
          user.facebook.token = req.body.idToken;
          user.facebook.email = req.body.email;
          user.facebook.id = req.body.id;
          user.account.username = acronym(req.body.name);
          user.account.firstname = req.body.firstName;
          user.account.lastname = req.body.lastName;
          user.account.avatar = req.body.photoUrl;
          user.save();
          fetchedUser = user;
        }

        const token = jwt.sign({ email: fetchedUser.google.email, id: fetchedUser._id }, process.env.JWT_SECRET, { expiresIn: "48h" });

        res.status(200).json({
          token: token,
          expiresIn: 3600 * 48,
          user: generateAngularUser(fetchedUser)
        });

      }).catch(err => { return res.status(401).json({ message: "Er ging iets verkeerd", error: err }); }) // Mongo error
    }
  })
})

// Update user
router.put("/api/user/:id", checkAuth.oAuth, (req, res, next) => {

  let fetchedUser;
  User.findOne({ _id: req.params.id }).then(user => {

    user.account.firstname = req.body.firstname;
    user.account.lastname = req.body.lastname;
    user.account.city = req.body.city;
    user.account.country = req.body.country;
    user.account.username = req.body.username;
    user.account.lastlogon = new Date();

    if(req.body.base64Image) {
      let mimetype = req.body.base64Image.substring("data:image/".length, req.body.base64Image.indexOf(";base64"));
      let filename = req.params.id + '.jpg' ;//+ mimetype;
      user.account.avatar = filename;
      uploadToSpaces(req.body.base64Image, filename, mimetype, process.env.DO_SPACES_AVATARFOLDER);
    }

    user.save(function (err) {
      if (err) {
        logger.error(err);
        console.error("Error: " + err);
      }

      fetchedUser = user;

      const token = jwt.sign({ email: fetchedUser.google.email, id: fetchedUser._id }, process.env.JWT_SECRET, { expiresIn: "48h" });

      res.status(200).json({
        token: token,
        expiresIn: 3600 * 48,
        user: generateAngularUser(fetchedUser),
        message: { title: 'Gegevens aangepast', body: 'De wijzigingen zijn succesvol bewaard.'}
      });
    });
  })
  .catch(err => {
    logger.error(err);
    res.status(400).json({ success: false, title: "Er ging iets verkeerd, probeer het later opnieuw", message: err });
  })
})


// Helpers

async function verifyGoogleToken(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  return payload;
}

function acronym (sentence) {
  var matches = sentence.match(/\b(\w)/g);
  var acronym = matches.join('');
  return acronym;
}

function generateAngularUser(fetchedUser) {
  return {
    id: fetchedUser._id,
    username: fetchedUser.account.username,
    language: fetchedUser.account.language,
    isAdmin: fetchedUser.account.isAdmin,
    title: fetchedUser.account.title,
    firstname: fetchedUser.account.firstname,
    lastname: fetchedUser.account.lastname,
    birthday: fetchedUser.account.birthday,
    city: fetchedUser.account.city,
    country: fetchedUser.account.country,
    avatar: fetchedUser.account.avatar,
    delays: fetchedUser.delays
  }
}

function uploadToSpaces(base64Image, filename, mimetype, subfolder) {

  if(base64Image) {

    let base64Data = base64Image.replace(/^data:image\/png;base64,/, "");
    base64Data = base64Image.replace(/^data:image\/jpg;base64,/, "");
    base64Data = base64Image.replace(/^data:image\/jpeg;base64,/, "");

    let buf = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ""), "base64");

    sharp(buf)
      .resize(200)
      .withMetadata({
        exif: {
          IFD0: {
            Copyright: 'Copyright - Treintelaat.be'
          }
        }
      })
      .jpeg()
      .rotate()
      .toBuffer((err, data, info) => {
        var config = {
          Bucket: process.env.DO_SPACES_NAME,
          Key: subfolder + "/" + filename,
          Body: data,
          ContentEncoding: "base64",
          ContentType: mimetype,
          ACL: "public-read",
        };
        s3.putObject(config, function (err, data) {
          if (err) {
            logger.error(err);
            logger.error(data);
          } else {
            logger.info("Succesfully uploaded image!");
          }
        });
      })
      .catch( err => {
        logger.error(err);
      });
  }
}

module.exports = router;



