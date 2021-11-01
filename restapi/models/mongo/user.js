var mongoose          = require('mongoose');
var bcrypt            = require('bcrypt');
var randtoken         = require('rand-token');

generatePin = function() {
  return Math.floor(Math.random() * 10).toString() + Math.floor(Math.random() * 10).toString() + Math.floor(Math.random() * 10).toString() + Math.floor(Math.random() * 10).toString();
}

const userSchema = mongoose.Schema({
  account        : {
    username     : String,
    title        : String,
    firstname    : String,
    lastname     : String,
    gender       : String,
    phone        : String,
    country      : String,
    countryISO2  : String,
    city         : String,
    avatar       : String,
    birthday     : Date,
    isAdmin      : { type: Boolean, default: false },
    language     : { type: String, default: "nl" },
    active       : { type: Boolean, default: false },
    lastlogon    : { type: Date, default: Date.now },
    pincode      : {
        number   : { type: Number, default: generatePin() },
        attempts : { type: Number, default: 0 }
    },
    token        : {
        GUID     : { type: String, default: () => randtoken.generate(64) },
        expires  : { type: Date, default: () => Date.now() + 7*24*60*60*1000 } // 7 days valid
    },
    resetPasswordToken  : {
        GUID            : { type: String, default: () => randtoken.generate(64) },
        expires         : { type: Date, default: () => Date.now() + 60*60*1000 } // 1 hour valid
    }
  },
  delays                : { type: Array, default: [] },
  phoneNumber          : String,
  local : {
    email        : String,
    password     : String
  },
  facebook       : {
      id         : String,
      token      : String,
      name       : String,
      email      : String
  },
  google         : {
      id         : String,
      token      : String,
      email      : String,
      name       : String
  },
  twitter        : {
    id           : String,
    token        : String,
    displayName  : String,
    username     : String
  }
},
{ timestamps: { createdAt: 'created', updatedAt: 'modified' } }
);

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.generateAvatar = function() {
  let random = Math.floor(Math.random() * 28) + 1;
  return "avatar-" + random + ".jpg";
};

module.exports = mongoose.model('User', userSchema);
