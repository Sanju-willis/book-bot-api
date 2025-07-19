// src\middlewares\multer.ts
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // optional: limit to 5MB
  },
});

export default upload;
