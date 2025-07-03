module.exports = {
  friendlyName: "Pagination",

  description: "Pagination something.",

  inputs: {
    total: {
      type: "number",
      required: true,
    },
    page: {
      type: "number",
      required: true,
    },
    limit: {
      type: "number",
      required: true,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs) {
    const { total, page, limit } = inputs;
    const totalPages = Math.ceil(total / limit);
    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;
    const startIndex = (page - 1) * limit + 1;
    const endIndex = Math.min(page * limit, total);
    return {
      total,
      page,
      limit,
      totalPages,
      nextPage,
      prevPage,
      startIndex,
      endIndex,
    };
  },
};
