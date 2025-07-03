module.exports = {
  friendlyName: "Refresh token",

  description: "",

  inputs: {
    app_version: {
      type: "string",
      required: true,
    },
  },

  exits: {
    invalid: {
      statusCode: responseCodes.badRequest,
    },
  },

  fn: async function ({ app_version }, exits) {
    let result = await User.updateOne({ id: this.req.loginUser.id }).set({
      app_version: app_version,
    });

    if (!result) return exits.invalid({ message: sails.__("User not found") });

    jwToken.refreshToken(this.req.token, function (token) {
      exits.success({
        data: result,
        token: token,
      });
    });
  },
};
