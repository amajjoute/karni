import { state } from "state.js";
import { calculateSolde, calculateDisponibleCredit } from "./calculations";

function  creerAchat({
    clientId,
    montant,
    liBelle,
    date
}) {
    const client = state.clients.find(
        client => client.id === clientId
    );

    
}