module.exports = {
  friendlyName: "Note Create",

  description: "Note Create",

  inputs: {
    title: {
      type: "string",
      required: true,
    },
    description: {
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
    console.log(inputs);

    let result = await Note.create(inputs);
    if (!result) return exits.invalid({ message: sails.__("Note not create") });

    exits.success({
      message: sails.__("Note create successfully"),
      data: result,
    });
  },
};
