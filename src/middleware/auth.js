import jwt from "jsonwebtoken";

export default function authMiddleware(handler, roles = []) {
  return async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ error: "Access denied" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: "Forbidden" });
      }

      req.user = decoded;
      return handler(req, res);
    } catch (error) {
      res.status(401).json({ error: "Invalid token" });
    }
  };
}
