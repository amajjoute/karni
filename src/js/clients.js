
import {
siNomEstValide, 
siTelephoneValide, 
isClientIDUnique,
siNomUnique, 
siPlafondValid
} 
    from "./validations.js"

    import { addClient_storage } from "./storage.js"
    import { delete_client_storage } from "./storage.js";
    import { convertMadToCen } from "./calculations.js";
    import { state } from "./state.js";

const clients = state.clients;

const Nom_client = document.getElementById("client-nom")
const Nom_client_error = document.getElementById("client-nom-erreur")


const dialogClient = document.getElementById("dialog-client")
const dialogTitre = document.getElementById("dialog-client-titre")

const clientId = document.getElementById("client-id")

const dialogConfirmation = document.getElementById("dialog-confirmation");
const confirmationTitre = document.getElementById("confirmation-titre");
const confirmationMessage = document.getElementById("confirmation-message");
const confirmationValider = document.getElementById("confirmation-valider");
const confirmationAnnuler = document.getElementById("confirmation-annuler");

let clientASupprimer = null;


function validerNomClient() {
    if (!siNomEstValide(Nom_client.value)) {
        Nom_client_error.classList.remove('hidden')
        Nom_client_error.textContent = "Le nom n'est pas valide"
        return false;
    }


   const clientExiste = clients.some(client =>
    client.nom.trim().toLowerCase() === Nom_client.value.trim().toLowerCase()
    && client.id !== clientId.value
);

if (clientExiste) {
    Nom_client_error.classList.remove('hidden')
    Nom_client_error.textContent = "Le nom deja existe"
    return false;
}


        Nom_client_error.classList.add('hidden')
        Nom_client_error.textContent = ""
        return true;

} 
        Nom_client.addEventListener('focusout', validerNomClient)
    export {validerNomClient}

const Telephone_client = document.getElementById("client-telephone")
const Telephone_client_error = document.getElementById("client-telephone-erreur")

function validerTelephoneClient (){
    if (!siTelephoneValide(Telephone_client.value)){
        Telephone_client_error.classList.remove('hidden')
        Telephone_client_error.textContent = "Le numero de telephone n'est pas valide"
        return false;
    }
    Telephone_client_error.classList.add('hidden')
    Telephone_client_error.textContent = ""
    return true
}
    Telephone_client.addEventListener('focusout', validerTelephoneClient)


const plafond_client = document.getElementById("client-plafond")
const plafond_client_error = document.getElementById("client-plafond-erreur")


function validerPlafondClient(){
    if (!siPlafondValid(plafond_client.value)){
        plafond_client_error.classList.remove('hidden')
        plafond_client_error.textContent = "Le plafond de crédit n'est pas valide"
        return false;
    }
    plafond_client_error.classList.add('hidden')
    plafond_client_error.textContent = ""
    return true;
}
    plafond_client.addEventListener('focusout', validerPlafondClient)


    const clientEnregistrer = document.querySelector("#client-enregistrer");

    

clientEnregistrer.addEventListener("click", function(event) {
    event.preventDefault()
    if(
     validerNomClient() === false 
    ||
     validerPlafondClient() === false 
    ||
     validerTelephoneClient() === false) {
    
        return
    } 
    if (clientId.value === "") {
        const newClient = {
            id: crypto.randomUUID(),
            nom: Nom_client.value,
            telephone: Telephone_client.value,
            plafond: convertMadToCen(plafond_client.value),
            creeLe: new Date().setHours(0,0,0, 0)
        }
        clients.push(newClient)
        afficherClients();
        dialogClient.close();
        
    } else {
    const client = clients.find(c => c.id === clientId.value);

    client.nom = Nom_client.value;
    client.telephone = Telephone_client.value;
    client.plafond = convertMadToCen(plafond_client.value);

    afficherClients();
    dialogClient.close();
})




function modifierClient(client) {
    clientId.value = client.id
    Nom_client.value = client.nom
    Telephone_client.value = client.telephone
    plafond_client.value = (client.plafond / 100).toFixed(2)

    dialogTitre.textContent = "Modifier le client"

    dialogClient.showModal()

}
const listeClients = document.getElementById("liste-clients")
const btnAnnuler = document.querySelector("#client-annuler")

listeClients.addEventListener("click", function(event) {

    if (event.target.dataset.action === "modifier-client") {

        const clientElement = event.target.closest("[data-client-id]");
        const id = clientElement.dataset.clientId



// /////////////////////////////////////////////////////////////////////////////////////////////////////////////

        const client = clients.find(
    client => client.id === id
)

        modifierClient(client);
    }

})

const nouveauClient = document.getElementById("nouveau-client");

nouveauClient.addEventListener("click", function() {

    clientId.value = "";
    Nom_client.value = "";
    Telephone_client.value = "";
    plafond_client.value = "";

    dialogTitre.textContent = "Nouveau client";

    dialogClient.showModal();
})

btnAnnuler.addEventListener("click", () => {
    dialogClient.close();
})



function confirmerSuppression(client) {
    clientASupprimer = client;

    confirmationTitre.textContent = "Supprimer le client";
    confirmationMessage.textContent =
        `Voulez-vous vraiment supprimer ${client.nom} ?`;

    dialogConfirmation.showModal();
}


listeClients.addEventListener("click", function(event) {

    if (event.target.dataset.action === "supprimer-client") {

        const clientElement = event.target.closest("[data-client-id]");
        const id = clientElement.dataset.clientId;

        const client = clients.find(client => client.id === id);

        confirmerSuppression(client);
    }

});

confirmationValider.addEventListener("click", function() {

    if (!clientASupprimer) return;

    const resultat = delete_client_storage(clientASupprimer.id)

    if (resultat) {
        afficherClients();
        dialogConfirmation.close();
        clientASupprimer = null;
    } else {

        confirmationMessage.textContent =
            "Impossible de supprimer ce client car il a une dette.";
    }

})