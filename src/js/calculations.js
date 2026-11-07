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

function convertCenToMad(montant_Cen) {
    const montant_Mad = montant_Cen / 100;
    return montant_Mad.toFixed(2);
}

function calculateStatut(client, operations, today) {
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
        (new Date(today) - new Date(referenceOperation.date)) /
        (24 * 60 * 60 * 1000)
    );

    if (dayPassed > 30) {
        status.push("En retard");
    } else {
        status.push("En dette");
    }

    return status;
}

function calculateDashboardStats(clients, operations, today) {
    const arrIds = [];

    for (let i = 0; i < clients.length; i++) {
        arrIds.push(clients[i].id);
    }

    const arrSoldes = [];

    for (let i = 0; i < arrIds.length; i++) {
        const solde = calculateSolde(operations, arrIds[i]);
        arrSoldes.push(solde);
    }

    const total = arrSoldes.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const totalOwed = Number(convertCenToMad(total));

    const totalClients = clients.length;

    const clientsInDebtLength = arrSoldes.filter(
            solde => solde > 0
    );

    const clientsInDebt = clientsInDebtLength.length;

    const clientsRetardLength = [];
    for (let i = 0; i < arrIds.length; i++) {
        const clientsRetard = calculateStatut(clients[i], operations, today).filter(
            client => client === "En retard"
        );

        if (clientsRetard.includes("En retard") === true) {
            clientsRetardLength.push(clientsRetard);
        }
    }

    const clientsEnRetard = clientsRetardLength.length;

    return {
        totalOwed,
        totalClients,
        clientsInDebt,
        clientsEnRetard
    };
}

export { calculateSolde, calculateDisponibleCredit, convertMadToCen, calculateStatut, calculateDashboardStats };