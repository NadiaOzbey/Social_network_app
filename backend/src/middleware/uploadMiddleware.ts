import multer from "multer";
import sharp from "sharp";
import type {
  Request,
  Response,
  NextFunction,
} from "express";

const storage =
  multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: (
    req,
    file,
    callback,
  ) => {
    if (
      !file.mimetype.startsWith(
        "image/",
      )
    ) {
      return callback(
        new Error(
          "Only image files are allowed",
        ),
      );
    }

    callback(null, true);
  },
});

const processImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file) {
      return next();
    }

    console.log(
      "IMAGE BEFORE SHARP:",
      {
        filename:
          req.file.originalname,
        mimetype:
          req.file.mimetype,
        size: req.file.size,
      },
    );

    const processedImage =
      await sharp(req.file.buffer)
        .rotate()
        .resize({
          width: 1200,
          height: 1200,
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({
          quality: 80,
          mozjpeg: true,
        })
        .toBuffer();

    console.log(
      "IMAGE AFTER SHARP:",
      {
        size: processedImage.length,
        savedPercent: Math.round(
          (1 -
            processedImage.length /
              req.file.size) *
            100,
        ),
      },
    );

    req.file.buffer =
      processedImage;

    req.file.mimetype =
      "image/jpeg";

    req.file.size =
      processedImage.length;

    next();
  } catch (error) {
    console.error(
      "Image processing error:",
      error,
    );

    return res.status(400).json({
      message:
        "Failed to process image",
    });
  }
};

export {
  upload,
  processImage,
};