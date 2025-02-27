export function isAdminValid(req) {
    if (req.user == null) {
        return false;
    }

    if (req.user.type != "admin") {
        return false;
    }

    return true;
}

