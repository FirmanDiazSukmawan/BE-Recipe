const multer = require("multer");
const path = require("path");

// simpan file

const multerUpload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "./public");
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const fileName = `${Date.now()}${ext}`;
            cb(null, fileName);

        }
    }),

    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const fileSize = parseInt(req.headers["content-length"]);
        const maxSize = 2 * 1024 * 1024;
        if (fileSize > maxSize) {
            const error = {
                message: "File size exceeds maximum"
            };
            return cb(error, false);
        }
        if (ext === ".png" || ext === ".jpg" || ext === ".jpeg") {
            cb(null, true);
        }
        else {
            const error = {
                message: "file must be a .png,.jpg or .jpeg"
            };
            cb(error, false);
        }
    }
});

const upload = (req, res, next) => {
    const multerSingle = multerUpload.single("profile_picture");
    multerSingle(req, res, (err) => {
        if (err) {
            res.json({
                message: "Error uploading",
                err: err.message
            });
        }
        else {
            next();
        }
    });
};

module.exports = upload;