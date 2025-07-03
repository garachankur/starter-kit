module.exports = {
  friendlyName: "Note update",

  description: "Note update",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
    title: {
      type: "string",
    },
    description: {
      type: "string",
    },
  },

  exits: {
    invalid: {
      statusCode: responseCodes.badRequest,
    },
  },

  fn: async function (inputs, exits) {
    try {
      let result = await Note.findOne({ id: inputs.id });
      if (!result)
        return exits.invalid({ message: sails.__("Note not found") });

      let updateResult = await Note.updateOne({ id: inputs.id }).set(inputs);
      if (!updateResult)
        return exits.invalid({ message: sails.__("Note not updated") });

      exits.success({
        message: sails.__("Note update successfully"),
      });
    } catch (e) {
      return exits.invalid({ message: sails.__("Note not updated") });
    }
  },
};
