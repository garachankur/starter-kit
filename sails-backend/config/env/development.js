// var AWS = require("aws-sdk");

module.exports = {
  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/
  mode: "development",
  siteName: "SailsBackend",
  shortName: "SB",
  redis_url: "redis://127.0.0.1:6379",
  port: 1337,
  datastores: {
    default: {
      adapter: "sails-mysql",
      host: "localhost",
      user: "root",
      password: "",
      database: "sailstemplate",
      port: 3306,
      charset: "utf8mb4",
      collation: "utf8mb4_unicode_ci",
      timezone: "utc",
    },
  },

  mail: {
    api_user: "apikey",
    api_key: "",
    email: "",
    password: "",
    host: "smtp.sendgrid.net",
    port: 587,
    secure: false, // true for 465, false for other ports
    from: {
      name: "sails_testing",
      email: "sails@template.com",
    },
    to: {
      name: "",
      email: "sails@template.com",
    },
  },

  custom: {
    baseUrl: "http://localhost:1337",
    frontUrl: "",
    aws: {
      key: "",
      secret: "",
      bucket: "",
      uploadUrlPath: "",
      publicUrl: "",
      snsRegion: "us-east-1",
      snsOutput: "json",
      snsArnIosUserPlatformApplication: "",
      snsArnAndroidUserPlatformApplication: "",
    },
    GOOGLE_API_KEY: "",
    CONTACT_EMAIL: "",
    uploadUrlPath:
      "/Users/garach/ANKUR/PROJECTS/DEMO/starter-kit/sails-backend/",
  },
  url: {
    appURL: "http://localhost:1337",
    imagePath: "http://localhost/sails-backend/",
  },
};
