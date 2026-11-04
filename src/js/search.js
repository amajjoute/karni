
import { creerDemo } from "./demo.js";
import { calculateSolde } from "./operations.js";

export function initSearch() {

    const demo = creerDemo();
    const clients = demo.clients;
    const operations = demo.operations;

    const searchInput = document.querySelector("#recherche");
    const filtre = document.querySelector("#filtre-statut");

    const listeClients = document.querySelector("#liste-clients");
    const modeleClient = document.querySelector("#modele-client");

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

        resultat.forEach(client => {

            const clone = modeleClient.content.cloneNode(true);

            clone.querySelector(".client-nom").textContent = client.nom;

            listeClients.appendChild(clone);
        });
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
    }

    // -------- EVENTS --------

    searchInput.addEventListener("input", filtrerClients);
    filtre.addEventListener("change", filtrerClients);

    // Affichage initial
    afficherClients(clients);
}
