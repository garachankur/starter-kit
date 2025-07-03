module.exports = {
  friendlyName: "Login",

  description: "Login auth.",

  inputs: {
    email: {
      type: "string",
      isEmail: true,
      required: true,
    },
    password: {
      type: "string",
      required: true,
    },
  },

  exits: {
    success: {
      description: "The requesting user agent has been successfully logged in.",
    },

    invalid: {
      statusCode: responseCodes.badRequest,
    },
  },

  fn: async function (inputs, exits) {
    const { email, password } = inputs;
    console.log(email, password);
    let result = await User.findOne({
      email: email.toLowerCase(),
    });
    if (!result) return exits.invalid({ message: sails.__("User not found") });

    try {
      await sails.helpers.passwords.checkPassword(password, result.password);
    } catch (e) {
      return exits.invalid({ message: sails.__("Invalid password") });
    }

    exits.success({
      data: result,
      token: jwToken.issue({
        id: result.id,
      }),
    });
  },
};
