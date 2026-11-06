import { state } from "./state.js";
import { calculateSolde, calculateStatut } from "./calculations.js";


export function initSearch() {

    const state = state();
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

            clone.querySelector("li").dataset.clientId = client.id;

            clone.querySelector(".client-nom").textContent = client.nom

            clone.querySelector(".client-solde").textContent =
            calculateSolde(operations, client.id) + " DH"

            // statut client
            
            const badges = clone.querySelector(".client-badges")

            badges.textContent = calculateStatut(client, operations);

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



    //  filtrer par statut------------------

    if (filtre.value === "en-dette") {

        resultat = resultat.filter(client =>
            calculateStatut(client, operations) === "En dette"
        );

    } else if (filtre.value === "a-jour") {

        resultat = resultat.filter(client =>
            calculateStatut(client, operations) === "À jour"
        );

    } else if (filtre.value === "en-retard") {

        resultat = resultat.filter(client =>
            calculateStatut(client, operations) === "En retard"
        );

    } else if (filtre.value === "plafond-atteint") {

        resultat = resultat.filter(client =>
            calculateStatut(client, operations) === "Plafond atteint"
        );
    }

    // tri ------------------------

    if (tri.value === "nom") {
    resultat.sort((a, b) => a.nom.localeCompare(b.nom));
    } else if (tri.value === "solde") {
        resultat.sort((a, b) =>
            calculateSolde(operations, b.id) -
            calculateSolde(operations, a.id)
        );

    }else if (tri.value === "recent") {

    const clientsAvecDate = [];

   
    resultat.forEach(client => {

        const operationsClient = operations.filter(
            operation => operation.clientId === client.id
        )

        operationsClient.sort((a, b) =>
            new Date(b.date) - new Date(a.date)
        );

    
        const derniereOperation = operationsClient[0];

        if (derniereOperation) {
            clientsAvecDate.push({
                client: client,
                date: derniereOperation.date
            });
        }
    });

  
    clientsAvecDate.sort((a, b) =>
        new Date(b.date) - new Date(a.date)
    );

    resultat = clientsAvecDate.map(element => element.client);
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