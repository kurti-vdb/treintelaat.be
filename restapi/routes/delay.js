"use strict";
require('dotenv').config();

const express = require("express");
const router = express.Router();
const { title } = require('process');
//const Delay = require('../models/delay');

const resultsPerPage = parseInt(process.env.RECIPE_RESULTS_PER_PAGE) || 16;


router.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  next();
});


router.get('/api/delays', (req, res, next) => {

  let delays = [
    { id: "some-guid", from: "Oostende", to: "Gent-St-Pieters", date: "17-10-2021 18:05", delay: "+0h08", user: "Kurt Van den Branden", remark: "", avatar: "assets/images/avatars/avatar-16.jpg"  },
    { id: "some-guid", from: "Antwerpen", to: "Leuven", date: "17-10-2021 17:53", delay: "+0h04", user: "Els Vermeersch", remark: "", avatar: "assets/images/avatars/avatar-2.jpg"  },
    { id: "some-guid", from: "Diegem", to: "Leuven", date: "17-10-2021 17:33", delay: "+0h06", user: "Dimitri Scheirnaart", remark: "", avatar: "assets/images/avatars/avatar-1.jpg"  },
    { id: "some-guid", from: "Luik", to: "Brussel-Zuid", date: "17-10-2021 17:32", delay: "+0h23", user: "Sofie Delkens", remark: "", avatar: "assets/images/avatars/avatar-4.jpg"  },
    { id: "some-guid", from: "Oostende", to: "Brugge", date: "17-10-2021 17:07", delay: "+0h03", user: "Gabriel d'Hondt", remark: "", avatar: "assets/images/avatars/avatar-7.jpg"  },
    { id: "some-guid", from: "Oostende", to: "Gent-St-Pieters", date: "17-10-2021 18:05", delay: "+0h08", user: "Kurt Van den Branden", remark: "", avatar: "assets/images/avatars/avatar-16.jpg"  },
    { id: "some-guid", from: "Antwerpen", to: "Leuven", date: "17-10-2021 17:53", delay: "+0h04", user: "Els Vermeersch", remark: "", avatar: "assets/images/avatars/avatar-15.jpg"  },
    { id: "some-guid", from: "Diegem", to: "Leuven", date: "17-10-2021 17:33", delay: "+0h06", user: "Dimitri Scheirnaart", remark: "", avatar: "assets/images/avatars/avatar-5.jpg"  },
    { id: "some-guid", from: "Luik", to: "Brussel-Zuid", date: "17-10-2021 17:32", delay: "+0h23", user: "Sofie Delkens", remark: "", avatar: "assets/images/avatars/avatar-8.jpg"  },
    { id: "some-guid", from: "Oostende", to: "Brugge", date: "17-10-2021 17:07", delay: "+0h03", user: "Gabriel d'Hondt", remark: "", avatar: "assets/images/avatars/avatar-9.jpg"  },
    { id: "some-guid", from: "Oostende", to: "Gent-St-Pieters", date: "17-10-2021 18:05", delay: "+0h08", user: "Kurt Van den Branden", remark: "", avatar: "assets/images/avatars/avatar-10.jpg"  },
    { id: "some-guid", from: "Antwerpen", to: "Leuven", date: "17-10-2021 17:53", delay: "+0h04", user: "Els Vermeersch", remark: "", avatar: "assets/images/avatars/avatar-11.jpg"  },
    { id: "some-guid", from: "Diegem", to: "Leuven", date: "17-10-2021 17:33", delay: "+0h06", user: "Dimitri Scheirnaart", remark: "", avatar: "assets/images/avatars/avatar-12.jpg"  },
    { id: "some-guid", from: "Luik", to: "Brussel-Zuid", date: "17-10-2021 17:32", delay: "+0h23", user: "Sofie Delkens", remark: "", avatar: "assets/images/avatars/avatar-13.jpg"  },
    { id: "some-guid", from: "Oostende", to: "Brugge", date: "17-10-2021 17:07", delay: "+0h03", user: "Gabriel d'Hondt", remark: "", avatar: "assets/images/avatars/avatar-14.jpg"  },
    { id: "some-guid", from: "Oostende", to: "Gent-St-Pieters", date: "17-10-2021 18:05", delay: "+0h08", user: "Kurt Van den Branden", remark: "", avatar: "assets/images/avatars/avatar-15.jpg"  },
    { id: "some-guid", from: "Antwerpen", to: "Leuven", date: "17-10-2021 17:53", delay: "+0h04", user: "Els Vermeersch", remark: "", avatar: "assets/images/avatars/avatar-17.jpg"  },
    { id: "some-guid", from: "Diegem", to: "Leuven", date: "17-10-2021 17:33", delay: "+0h06", user: "Dimitri Scheirnaart", remark: "", avatar: "assets/images/avatars/avatar-18.jpg"  },
    { id: "some-guid", from: "Luik", to: "Brussel-Zuid", date: "17-10-2021 17:32", delay: "+0h23", user: "Sofie Delkens", remark: "", avatar: "assets/images/avatars/avatar-19.jpg"  },
    { id: "some-guid", from: "Oostende", to: "Brugge", date: "17-10-2021 17:07", delay: "+0h03", user: "Gabriel d'Hondt", remark: "", avatar: "assets/images/avatars/avatar-20.jpg"  }
  ];

  res.status(200).json({ message: 'Success', delays: delays });


});


router.get('/api/delays/count', (req, res, next) => {
  Delay.countDocuments()
    .then(result => {
      res.status(200).json({ count: result });
  });
});


module.exports = router;
