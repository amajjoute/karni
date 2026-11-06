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

    if (solde === 0) {
        return "À jour";
    }

    if (solde >= client.plafond) {
        return "Plafond atteint";
    }

    const clientOperation = operations.filter(
        operation => operation.clientId === client.id
    );

    const firstPurchase = clientOperation.find(
        purchase => purchase.type === "achat"
    )

    const lastRepayment = clientOperation.findLast(
        repayment => repayment.type === "remboursement"
    );
    const referenceOperation = lastRepayment || firstPurchase;
    let dayPassed;

    if (!referenceOperation) {
        return false;
    } else {
        dayPassed = Math.floor(
            (new Date() - new Date(referenceOperation.date)) / 
            (24 * 60 * 60 * 1000))
    }

    if (dayPassed > 30) {
        return "En retard"
    } else {
        return false
    }
}

export { calculateSolde, calculateDisponibleCredit, convertMadToCen, calculateStatut };