import fs from 'fs';
import path from 'path';

const ensureUploadDirectories = () => {
    const directories = ['uploads/profile_pictures', 'uploads/legal_documents'];
    directories.forEach((dir) => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
};

ensureUploadDirectories();
