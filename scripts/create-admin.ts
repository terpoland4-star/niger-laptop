import { db } from "../server/db/index";
import { admins } from "../server/db/schema";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import readline from "readline";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  const email = await ask("Email admin: ");
  const password = await ask("Mot de passe: ");
  rl.close();

  if (!email || !password || password.length < 8) {
    console.error("Email requis et mot de passe d'au moins 8 caractères requis.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await db.insert(admins).values({
    id: randomUUID(),
    email,
    passwordHash,
    role: "admin",
    createdAt: new Date().toISOString(),
  });

  console.log(`Compte admin créé avec succès pour ${email}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Erreur:", err);
  process.exit(1);
});
