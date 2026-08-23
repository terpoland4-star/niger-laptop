import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AgentRequest extends Request {
  agent?: { id: string; email: string; name: string };
}

export function requireAgent(req: AgentRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentification requise" });
  }

  const token = authHeader.slice(7);
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("[agentAuth] JWT_SECRET manquant");
    return res.status(500).json({ error: "Erreur de configuration serveur" });
  }

  try {
    const payload = jwt.verify(token, secret) as { id: string; email: string; name: string; kind: string };
    if (payload.kind !== "agent") {
      return res.status(401).json({ error: "Token invalide pour ce rôle" });
    }
    req.agent = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token invalide ou expiré" });
  }
}
