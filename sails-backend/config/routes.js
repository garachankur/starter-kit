/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

let apiV1 = {
  //AUTH
  "POST /login": { action: "api/v-1/user/auth/login" },
  "POST /signup": { action: "api/v-1/user/auth/signup" },
  // USER
  "POST /user/refresh-token": { action: "api/v-1/user/refresh-token" },
  "POST /user/update": { action: "api/v-1/user/update" },
  // Notes
  "POST /note/list": { action: "api/v-1/note/list" },
  "POST /note/create": { action: "api/v-1/note/create" },
  "POST /note/update": { action: "api/v-1/note/update" },
  "DELETE /note/delete/:id": { action: "api/v-1/note/delete" },
  "GET /note/:id": { action: "api/v-1/note/detail" },
};

function genRoutes(objRoutes) {
  var prefix = Object.keys(objRoutes);
  let newRoutes = {};
  let routes = {};

  for (let i = 0; i < prefix.length; i++) {
    var paths = Object.keys(objRoutes[prefix[i]]);

    paths.forEach(function (path) {
      var pathParts = path.split(" "),
        uri = pathParts.pop(),
        prefixedURI = "",
        newPath = "";

      prefixedURI = (prefix[i] ? "/" : "") + prefix[i] + uri;
      pathParts.push(prefixedURI);
      newPath = pathParts.join(" ");

      newRoutes[newPath] = objRoutes[prefix[i]][path];
    });
  }
  routes = newRoutes;

  return routes;
}
let routes = genRoutes({
  "api/v1": apiV1,
});

module.exports.routes = routes;
