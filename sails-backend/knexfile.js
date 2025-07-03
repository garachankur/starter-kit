// Update with your config settings.

module.exports = {
  development: {
    client: "mysql",
    connection: "mysql://root@localhost:3306/sailstemplate",
    migrations: {
      directory: __dirname + "/migrations",
    },
  },
  production: {
    client: "mysql",
    connection: "mysql://root@localhost:3306/sailstemplate",
  },
  staging: {
    client: "mysql",
    connection: "mysql://root@localhost:3306/sailstemplate",
  },
};
