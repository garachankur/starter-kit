module.exports = {
  friendlyName: "Note Create",

  description: "Note Create",

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
    let result = { data: null };
    try {
      const { id } = inputs;

      const notes = await Note.findOne({
        where: { id: id },
      });
      if (!notes) return exits.invalid(result);
      result.data = notes;
      exits.success(result);
    } catch (e) {
      return exits.invalid(result);
    }
  },
};
