
import { state } from "./state.js";
import { calculateSolde } from "./calculations.js";

export function initSearch() {

    const clients = state.clients;
    const operations = state.operations;

    const searchInput = document.querySelector("#recherche");
    const filtre = document.querySelector("#filtre-statut");

    const resetButton = document.querySelector("#reinitialiser-filtres");

    const etatVide = document.querySelector("#etat-vide");
    const etatAucunResultat = document.querySelector("#etat-aucun-resultat");

    const listeClients = document.querySelector("#liste-clients");
    const modeleClient = document.querySelector("#modele-client");

    const tri = document.querySelector("#tri")

    // -------- NORMALISATION --------

    function normalizeText(text) {
        return text
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    // -------- AFFICHAGE --------

    function afficherClients(resultat) {

    listeClients.innerHTML = "";

    etatVide.classList.add("hidden");
    etatAucunResultat.classList.add("hidden");

    if (clients.length === 0) {

        etatVide.classList.remove("hidden");

    } else if (resultat.length === 0) {

        etatAucunResultat.classList.remove("hidden");

    } else {

        resultat.forEach(client => {

            const clone = modeleClient.content.cloneNode(true);

            clone.querySelector(".client-nom").textContent = client.nom;

            listeClients.appendChild(clone);
        });
    }
}

    // -------- RECHERCHE + FILTRE --------

    function filtrerClients() {

        const recherche = normalizeText(searchInput.value);

        let resultat = clients.filter(client =>
            normalizeText(client.nom).startsWith(recherche)
        );

        if (filtre.value === "en-dette") {

            resultat = resultat.filter(client =>
                calculateSolde(operations, client.id) > 0 &&
                operations.some(operation =>
                    operation.clientId === client.id &&
                    operation.type === "achat" &&
                    (new Date() - new Date(operation.date)) / 86400000 <= 30
                )
            );

        } else if (filtre.value === "a-jour") {

            resultat = resultat.filter(client =>
                calculateSolde(operations, client.id) === 0
            );

        } else if (filtre.value === "en-retard") {

            resultat = resultat.filter(client =>
                calculateSolde(operations, client.id) > 0 &&
                operations.some(operation =>
                    operation.clientId === client.id &&
                    operation.type === "achat" &&
                    (new Date() - new Date(operation.date)) / 86400000 > 30
                )
            );
        }

        afficherClients(resultat);


        // -------- SORT --------

        if (tri.value === "nom") {

            resultat.sort((a, b) =>
                a.nom.localeCompare(b.nom)
            );

        } else if (tri.value === "solde") {

            resultat.sort((a, b) =>
                calculateSolde(operations, b.id) -
                calculateSolde(operations, a.id)
            );

        } else if (tri.value === "recent") {

            resultat.sort((a, b) => {

                const operationA = operations
                    .filter(operation => operation.clientId === a.id)
                    .sort((x, y) =>
                        new Date(y.date) - new Date(x.date)
                    )[0];

                const operationB = operations
                    .filter(operation => operation.clientId === b.id)
                    .sort((x, y) =>
                        new Date(y.date) - new Date(x.date)
                    )[0];

                const dateA = operationA ? new Date(operationA.date) : 0;
                const dateB = operationB ? new Date(operationB.date) : 0;

                return dateB - dateA;
            });
        }

        afficherClients(resultat);
    }

// -------- EVENTS --------

searchInput.addEventListener("input", filtrerClients);
filtre.addEventListener("change", filtrerClients);
tri.addEventListener("change", filtrerClients);

resetButton.addEventListener("click", function() {
    searchInput.value = "";
    filtre.value = "tous";
    tri.value = "nom";

    filtrerClients();
});

// Affichage initial
filtrerClients();
}


