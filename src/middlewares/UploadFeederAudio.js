const multer = require("multer");

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("audio")) {
    return cb(null, true);
  } else {
    return cb("Please upload only audio files.", false);
  }
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/upload/pets/audio");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-bezkoder-${file.originalname}`);
  },
});

var uploadFeederAudio = multer({ storage: storage, fileFilter: imageFilter });
module.exports = uploadFeederAudio;