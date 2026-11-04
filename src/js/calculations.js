function calculateSolde(operations, clientId) {
    return operations.reduce((solde, operation) => {
        if(operation.clientId !== clientId) {
            return solde;
        }

        if (operation.type === "achat") {
            return solde + operation.montant;
        }

        if (operation.type === "remboursement") {
            return solde - operation.montant;
        }

        return solde;
    }, 0);
}

function calculateDisponibleCredit(client, operations) {
    const solde = calculateSolde(operations, client.id);

    return client.plafond - solde;
}

function convertMadToCen(montant_MAD) {
    const montant_CEN = parseFloat(montant_MAD.replace(',', '.')).toFixed(2) * 100;

    return montant_CEN;
}

export { calculateSolde, calculateDisponibleCredit, convertMadToCen };