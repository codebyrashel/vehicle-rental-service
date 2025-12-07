import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/dotenv.config";


export interface AuthRequest extends Request {
  user?: { userId: number; role: string };
}

export const requireAuth = (roles?: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "Missing token" });
    }

    try {
      const decoded = jwt.verify(token, ENV.jwtSecret) as any;
      req.user = decoded; 

      if (roles && !roles.includes(decoded.role)) {

        return res
          .status(403)
          .json({ success: false, message: "Forbidden: insufficient permissions" });
      }

      next();
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token" });
    }
  };
};