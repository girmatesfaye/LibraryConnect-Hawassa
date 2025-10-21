import multer from "multer";
import path from "path";

// Define storage for local disk
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // The 'uploads/' folder must exist in your backend's root directory.
    // Multer will save files here.
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    // Create a unique filename to avoid overwriting files with the same name.
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// File type filter to allow only images
function checkFileType(req, file, cb) {
  // If no file is submitted, just allow the request to pass.
  if (!file.originalname) return cb(null, true);

  const filetypes = /jpg|jpeg|png|gif|svg|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Error: Images Only!"));
  }
}

// Initialize multer with disk storage and file filter
const upload = multer({ storage, fileFilter: checkFileType });
export default upload;
