responseCodes = {
  success: 200,
  successWithEmpty: 201,
  unauthorized: 401,
  forbidden: 403,
  badRequest: 400,
  conflict: 409,
  notFound: 404,
  serverSide: 500,
};

global.pageLimit = 10;

global.uploadDir = `assets/uploads/${sails.config.mode}`;
global.imageUrl = `${sails.config.custom.baseUrl}/uploads/${sails.config.mode}`;
global.uploadPath = {
  users: "users",
};

global.sharp = require("sharp");
global.path = require("path");
global.fs = require("fs");
