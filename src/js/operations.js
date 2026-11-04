import { state } from "./state.js";
import { calculateDisponibleCredit, convertMadToCen } from "./calculations.js";

function creerAchat({clientId, montant, libelle, date }) {
    const client = state.clients.find(
        client => client.id === clientId
    );

    if (!client) {
        throw new Error("Client introuvable");
    }

    const disponibleCredit = calculateDisponibleCredit(client, state.operations);

    if (convertMadToCen(montant) > disponibleCredit) {
        throw new Error("Crédit disponible insuffisant");
    }

    const newOperation = {
        id: "o-" + crypto.randomUUID(),
        clientId,
        type: "achat",
        montant: convertMadToCen(montant),
        libelle,
        date
    };

    state.operations.push(newOperation);

    return newOperation;
}

export {creerAchat}