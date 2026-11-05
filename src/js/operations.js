import { state } from "./state.js";
import { calculateSolde ,calculateDisponibleCredit, convertMadToCen } from "./calculations.js";

function creerAchat({clientId, montant, libelle, date }) {
    const client = state.clients.find(
        client => client.id === clientId
    );

    if (!client) {
        throw new Error("Client introuvable");
    }

    const disponibleCredit = calculateDisponibleCredit(client, state.operations);

    if (convertMadToCen(montant) > disponibleCredit) {
        throw new Error("Le montant dépasse votre dette restante");
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

function creerRemboursement({clientId, montant, libelle, date }) {

    const client = state.clients.find(
        client => client.id === clientId
    );

    if (!client) {
        throw new Error("Client introuvable");
    }

    const soldeDebit = calculateSolde(state.operations, clientId);

    const montantInCen = convertMadToCen(montant);

    if (montantInCen > soldeDebit) {
        throw new Error("un remboursement supérieur au solde est refusé.");
    }

    const newOperation = {
        id: "o-" + crypto.randomUUID(),
        clientId,
        type: "remboursement",
        montant: montantInCen,
        libelle,
        date
    };

    state.operations.push(newOperation);

    return newOperation;
}

function supprimerOperation({clientId, montant, libelle, date }) {
    const client = state.clients.find(
        client => client.id === clientId
    );

    if (!client) {
        throw new Error("Client introuvable");
    }

    const removeClient = state.operations;

}

export {creerAchat, creerRemboursement}