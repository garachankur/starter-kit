module.exports = {
  friendlyName: "Signup",

  description: "Signup auth.",

  inputs: {
    email: {
      type: "string",
      isEmail: true,
      required: true,
    },
    id: {
      type: "number",
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
    console.log(sails.config.appPath);

    const { email } = inputs;
    try {
      let record = await User.findOne({ email: email });
      if (!record)
        return exits.invalid({ message: sails.__("User not found") });

      const uploadResult = await sails.helpers.file.multipleFilesUpload.with({
        req: this.req,
        field: "profile_image",
        uploadDir: uploadPath?.users,
      });

      if (uploadResult?.length > 0)
        inputs.profile_image = uploadResult[0]?.fileName;

      let result = await User.updateOne({ id: inputs.id }).set(inputs);
      if (!result)
        return exits.invalid({ message: sails.__("User not updated") });

      exits.success({
        message: sails.__("User update successfully"),
        data: result,
      });
    } catch (e) {
      return exits.invalid({ message: sails.__("User not updated") });
    }
  },
};
