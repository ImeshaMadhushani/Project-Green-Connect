import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const username = req.body.username;
        if (!username) {
            return cb(new Error('Username is required to create user-specific folders.'), false);
        }

        // Base directory for the user's folder
        const userDir = path.join('uploads', username);

        // Determine subfolder based on the file field
        let subFolder = '';
        if (file.fieldname === "profile_picture") {
            subFolder = 'profile_pictures';
        } else if (file.fieldname === "legalDocument") {
            subFolder = 'legal_documents';
        } else {
            return cb(new Error('Invalid file field.'), false);
        }

        // Full path to the subfolder
        const destinationDir = path.join(userDir, subFolder);

        // Create the directories if they don't exist
        if (!fs.existsSync(destinationDir)) {
            fs.mkdirSync(destinationDir, { recursive: true });
        }

        cb(null, destinationDir); // Set destination to the user-specific subfolder
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and PDF are allowed.'), false);
    }
};

// Multer middleware
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // Limit file size to 5MB
});

export default upload;

