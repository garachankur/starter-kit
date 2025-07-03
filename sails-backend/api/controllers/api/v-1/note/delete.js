module.exports = {
  friendlyName: "Note delete",

  description: "Note delete",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
  },

  exits: {
    invalid: {
      statusCode: responseCodes.badRequest,
    },
  },

  fn: async function (inputs, exits) {
    try {
      let result = await Note.destroy({ id: inputs.id });
      if (!result)
        return exits.invalid({ message: sails.__("Note not deleted") });

      exits.success({
        message: sails.__("Note deleted successfully"),
      });
    } catch (e) {
      return exits.invalid({ message: sails.__("Note not deleted") });
    }
  },
};
