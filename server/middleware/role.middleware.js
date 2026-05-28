export const isInstructor = (req, res, next) => {
    if (!req.user || (req.user.role !== "instructor" && req.user.role !== "admin")) {
        return res.status(403).json({ message: "Instructor access required" });
    }
    next();
};

export const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
    }
    next();
};

export const isInstituteAdmin = (req, res, next) => {
    if (!req.user || (req.user.role !== "institute_admin" && req.user.role !== "admin")) {
        return res.status(403).json({ message: "Institute Admin access required" });
    }
    next();
};

