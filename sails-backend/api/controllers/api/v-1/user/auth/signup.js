module.exports = {
  friendlyName: "Signup",

  description: "Signup auth.",

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
    first_name: {
      type: "string",
      required: true,
    },
    last_name: {
      type: "string",
      required: true,
    },
  },

  exits: {
    invalid: {
      statusCode: responseCodes.badRequest,
    },
  },

  fn: async function (inputs, exits) {
    const { email } = inputs;

    let record = await User.findOne({ email: email });
    if (record)
      return exits.invalid({ message: sails.__("Email already exist") });

    let result = await User.create(inputs);
    if (!result) return exits.invalid({ message: sails.__("User not create") });

    exits.success({
      message: sails.__("User create successfully"),
    });
  },
};
