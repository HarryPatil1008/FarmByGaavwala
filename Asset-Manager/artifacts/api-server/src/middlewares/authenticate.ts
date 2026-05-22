import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/auth.js";

declare global {
  namespace Express {
    interface Request {
      user?: { userId: number; email: string; role: string };
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = auth.slice(7);
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.user?.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  next();
}
