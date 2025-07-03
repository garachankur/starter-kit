module.exports = {
  friendlyName: "Note Create",

  description: "Note Create",

  inputs: {
    page: {
      type: "number",
      defaultsTo: 1,
    },
    limit: {
      type: "number",
      defaultsTo: 10,
    },
    searchQuery: {
      type: "string",
      defaultsTo: "",
    },
  },

  exits: {
    invalid: {
      statusCode: responseCodes.badRequest,
    },
  },

  fn: async function (inputs, exits) {
    let result = { data: null, pagination: null };
    try {
      const { page, limit, searchQuery } = inputs;
      const skip = (page - 1) * limit;

      const whereClause = searchQuery
        ? {
            or: [
              { title: { contains: searchQuery.toLowerCase() } },
              { description: { contains: searchQuery.toLowerCase() } },
            ],
          }
        : {};

      const total = await Note.count({ where: whereClause });

      const notes = await Note.find({
        where: whereClause,
        skip,
        limit,
        sort: "created_at DESC",
      });

      result.data = notes;
      result.pagination = await sails.helpers.pagination.with({
        total,
        page,
        limit,
      });
      exits.success(result);
    } catch (e) {
      return exits.invalid(result);
    }
  },
};
