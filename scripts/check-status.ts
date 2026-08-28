import { checkAchatStatus } from "../server/lib/nita";

const [requestId, adresseIp] = process.argv.slice(2);

checkAchatStatus({ requestId, adresseIp: adresseIp ?? "127.0.0.1" })
  .then((res) => console.log("Statut :", JSON.stringify(res, null, 2)))
  .catch((err) => console.error("Erreur :", err.message, err.raw));
