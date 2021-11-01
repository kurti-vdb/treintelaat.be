require('dotenv').config();

const logger = require("./logger");
const aws = require("aws-sdk");
const mime = require("mime");
const crypto = require("crypto");
const multer = require("multer");
const multerS3 = require("multer-s3");
var multerS3Transform = require('multer-s3-transform')
const sharp = require('sharp');


const spacesEndpoint = new aws.Endpoint(process.env.DO_SPACES_ENDPOINT);
const s3 = new aws.S3({
    endpoint: spacesEndpoint,
    bucket: process.env.DO_SPACES_NAME,
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
    acl: "public-read",
});

const limits = {
  files: 1, // allow only 1 file per request
  fieldSize: 5 * 1024 * 1024, // (replace MBs allowed with your desires)
};

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  }
  else {
    cb("Not an image! Please upload only images.", false);
  }
};


const uploadspaces = multer({
  limits: limits,
  fileFilter: fileFilter,
  storage: multerS3Transform({
      s3,
      endpoint: spacesEndpoint,
      bucket: process.env.DO_SPACES_NAME,
      acl: "public-read",
      shouldTransform: function (req, file, cb) {
        cb(null, /^image/i.test(file.mimetype))
      },
      transforms: [{
        id: 'original',
        key: function (req, file, cb) {
          cb(null, "/original/" + file.originalname)
        },
        transform: function (req, file, cb) {
          cb(null, sharp().withMetadata({
            exif: {
              IFD0: {
                Copyright: 'treintelaat.be',
              }
            }
          }).jpeg())
        }
      }, {
        id: 'thumbnail-250',
        key: function (req, file, cb) {
          cb(null, "/thumbnail-250/" + file.originalname)
        },
        transform: function (req, file, cb) {
          cb(null, sharp().resize(250).withMetadata({
            exif: {
              IFD0: {
                Copyright: 'treintelaat.be'
              }
            }
          }).jpeg())
        }
      },{
        id: 'thumbnail-750',
        key: function (req, file, cb) {
          cb(null, "/750/" + file.originalname)
        },
        transform: function (req, file, cb) {
          cb(null, sharp().resize(750).withMetadata({
            exif: {
              IFD0: {
                Copyright: 'treintelaat.be'
              }
            }
          }).jpeg())
        }
      }]
  }),
});

module.exports = uploadspaces;

