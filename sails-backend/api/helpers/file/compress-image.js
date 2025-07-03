module.exports = {
  friendlyName: "Verification code",

  description: "",

  inputs: {
    file: {
      type: "ref",
    },
    toFile: {
      type: "string",
    },
    quality: {
      type: "number",
      default: 30,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function ({ file, toFile, quality }, exits) {
    global
      .sharp(file)
      .jpeg({ quality: quality })
      .toFile(toFile)
      .then(function (outputBuffer) {
        exits.success({ data: outputBuffer });
      });
  },
};
