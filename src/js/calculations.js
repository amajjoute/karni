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

function calculateStatut(client, operations) {
    const solde = calculateSolde(operations, client.id);
    const status = [];

    if (solde === 0) {
        return ["À jour"];
    }

    const disponibleCredit = calculateDisponibleCredit(client, operations);

    if (disponibleCredit <= 0) {
        status.push("Plafond atteint");
    }

    const clientOperation = operations.filter(
        operation => operation.clientId === client.id
    );

    clientOperation.sort((a, b) =>
        new Date(a.date) - new Date(b.date)
    );

    const firstPurchase = clientOperation.find(
        operation => operation.type === "achat"
    );

    const lastRepayment = clientOperation.findLast(
        operation => operation.type === "remboursement"
    );

    const referenceOperation = lastRepayment || firstPurchase;

    if (!referenceOperation) {
        status.push("En dette");
        return status;
    }

    const dayPassed = Math.floor(
        (new Date() - new Date(referenceOperation.date)) /
        (24 * 60 * 60 * 1000)
    );

    if (dayPassed > 30) {
        status.push("En retard");
    } else {
        status.push("En dette");
    }

    return status;
}

export { calculateSolde, calculateDisponibleCredit, convertMadToCen, calculateStatut };