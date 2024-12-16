import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Specify the public/images directory as the destination
        cb(null, path.join(process.cwd(), "public/images"));
    },
    filename: (req, file, cb) => {
        // Create a unique filename using the current timestamp and original name
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});


const upload = multer({storage: storage});

export default upload;