import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface CustomerAuthenticatedRequest extends Request {
  customer?: { id: string; email: string };
}

export function requireCustomer(req: CustomerAuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentification requise" });
  }

  const token = authHeader.slice(7);
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("[auth] JWT_SECRET manquant");
    return res.status(500).json({ error: "Erreur de configuration serveur" });
  }

  try {
    const payload = jwt.verify(token, secret) as { id: string; email: string; type: string };
    if (payload.type !== "customer") {
      return res.status(401).json({ error: "Token invalide" });
    }
    req.customer = { id: payload.id, email: payload.email };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token invalide ou expiré" });
  }
}

export function optionalCustomer(req: CustomerAuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.slice(7);
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return next();
  }

  try {
    const payload = jwt.verify(token, secret) as { id: string; email: string; type: string };
    if (payload.type === "customer") {
      req.customer = { id: payload.id, email: payload.email };
    }
  } catch (err) {
    // Token invalide ou expiré : mode invité, pas d'erreur bloquante.
  }
  next();
}
