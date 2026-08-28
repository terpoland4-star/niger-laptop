import { payAchat } from "../server/lib/nita";

const [codeAchat, requestId] = process.argv.slice(2);

payAchat({ codeAchat, requestId, adresseIp: "127.0.0.1" })
  .then((res) => console.log("Paiement simulé :", JSON.stringify(res, null, 2)))
  .catch((err) => console.error("Erreur :", err.message, err.raw));
