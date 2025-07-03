module.exports = {
  fetchRecordsOnUpdate: true,
  fetchRecordsOnCreate: true,
  fetchRecordsOnDestroy: true,
  tableName: "users",
  attributes: {
    email: {
      type: "string",
      required: true,
      unique: true,
      isEmail: true,
      example: "mary.sue@example.com",
    },
    password: {
      type: "string",
      required: true,
      protect: true,
      example: "2$28a8eabna301089103-13948134nad",
    },
    first_name: {
      type: "string",
      allowNull: true,
    },
    last_name: {
      type: "string",
      allowNull: true,
    },
    profile_image: {
      type: "string",
      allowNull: true,
    },
  },
  customToJSON: function () {
    const user = _.omit(this, ["password", ""]);
    if (user.profile_image)
      user.profile_image = `${global.imageUrl}/${uploadPath?.users}/${user.profile_image}`;

    return user;
  },
  beforeCreate: async function (valuesToSet, proceed) {
    if (valuesToSet.password) {
      await sails.helpers.passwords
        .hashPassword(valuesToSet.password)
        .exec((err, hashedPassword) => {
          if (err) {
            return proceed(err);
          }
          valuesToSet.password = hashedPassword;

          return proceed();
        });
    } else return proceed();
  },
  beforeUpdate: async function (valuesToSet, proceed) {
    if (valuesToSet.password) {
      await sails.helpers.passwords
        .hashPassword(valuesToSet.password)
        .exec((err, hashedPassword) => {
          if (err) {
            return proceed(err);
          }
          valuesToSet.password = hashedPassword;

          return proceed();
        });
    } else return proceed();
  },
};
