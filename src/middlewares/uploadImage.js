import multer from "multer";
import path from "path";
const storage = multer.memoryStorage({
  destination(req, res, cb) {
    cb(null, "");
  },
});
function checkFileType(file, cb) {
  const fileTypes = /jpg||jpeg||png||gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb("", true);
  } else {
    return cb("Error image only");
  }
}
const maxsize = 1024 * 1024 * 5;
const upload = multer({
  storage,
  limits: { fileSize: maxsize },
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
});
export default upload;
