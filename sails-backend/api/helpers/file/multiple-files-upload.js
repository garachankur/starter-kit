module.exports = {
  friendlyName: "Upload file with .tmp auto-migrate and thumbnail",

  description:
    "Uploads file to .tmp, then moves to assets and creates a thumbnail.",

  inputs: {
    req: { type: "ref", required: true },
    field: { type: "string", required: true },
    uploadDir: { type: "string", required: true },
  },

  exits: {
    success: { description: "File(s) uploaded successfully." },
    error: { description: "Upload failed." },
  },

  fn: async function (inputs, exits) {
    const { req, field, uploadDir } = inputs;

    const assetsDir = global.path.resolve(
      sails.config.appPath,
      global.uploadDir,
      uploadDir
    );

    const thumbDir = global.path.join(assetsDir, "thumb");

    if (!global.fs.existsSync(assetsDir))
      fs.mkdirSync(assetsDir, { recursive: true });
    if (!global.fs.existsSync(thumbDir))
      fs.mkdirSync(thumbDir, { recursive: true });

    req.file(field).upload(
      {
        maxBytes: 10 * 1024 * 1024, // 10MB
      },
      async (err, uploadedFiles) => {
        if (err) return exits.error(err);
        if (!uploadedFiles.length) return exits.success([]);

        const processedFiles = [];

        for (const file of uploadedFiles) {
          const ext = path.extname(file.filename).toLowerCase();
          const baseName = `${path.basename(
            file.filename,
            ext
          )}-${Date.now()}${ext}`;

          const tmpPath = file.fd;
          const newPath = path.join(assetsDir, baseName);
          const thumbPath = path.join(thumbDir, baseName);

          try {
            // Move file from .tmp to assets/uploads
            fs.copyFileSync(tmpPath, newPath);
            fs.copyFileSync(tmpPath, thumbPath);

            // Create thumbnail if it's an image
            if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
              await sails.helpers.file.compressImage(tmpPath, thumbPath, 60);
            }

            processedFiles.push({
              fileName: baseName,
            });

            // Optional: remove original from .tmp
            fs.unlinkSync(tmpPath);
          } catch (error) {
            sails.log.error("Error processing file:", error);
          }
        }

        return exits.success(processedFiles);
      }
    );
  },
};
