
import {
siNomEstValide, 
siTelephoneValide, 
siNomUnique, 
siPlafondValid
} 
    from "./validations.js"

    import { addClient_storage, editClient } from "./storage.js";
    import { convertMadToCen } from "./calculations.js";
    import { state } from "./state.js";

const clients = state.clients;

const Nom_client = document.getElementById("client-nom")
const Nom_client_error = document.getElementById("client-nom-erreur")


const dialogClient = document.getElementById("dialog-client")
const dialogTitre = document.getElementById("dialog-client-titre")

const clientId = document.getElementById("client-id")

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



function clientEnregistrer_click(event)
{
    event.preventDefault()
    if (clientId.value === "") {
        AjouterClient()
    }
    else
    {
        ModifierClient()
    }
}
function AjouterClient()
{
    
    if(
     validerNomClient() === false 
    ||
     validerPlafondClient() === false 
    ||
     validerTelephoneClient() === false 
    ||siNomUnique(Nom_client.value, state) === false) {
        return
    } 
    const newClient = {
        id: "c-" + crypto.randomUUID(),
        nom: Nom_client.value,
        telephone: Telephone_client.value,
        plafond: convertMadToCen(plafond_client.value),
        creeLe: new Date().toISOString().slice(0, 10)
    }
    addClient_storage(newClient)
    dialogClient.close();
}

function ModifierClient()
{
    if(
     validerNomClient() === false 
    ||
     validerPlafondClient() === false 
    ||
     validerTelephoneClient() === false
    ) {
    
        return
    } 

    editClient({id: clientId.value,nom: Nom_client.value, telephone: Telephone_client.value, plafond: convertMadToCen(plafond_client.value)})
    dialogClient.close();
}

export{AjouterClient, initDialog_modifierClient}


function initDialog_modifierClient(client) {
    clientId.value = client.id
    Nom_client.value = client.nom
    Telephone_client.value = client.telephone
    plafond_client.value = (client.plafond / 100).toFixed(2)

    dialogTitre.textContent = "Modifier le client"

    dialogClient.showModal()

}

function AjouterClientDialog()
{
    clientId.value = "";
    Nom_client.value = "";
    Telephone_client.value = "";
    plafond_client.value = "";

    dialogTitre.textContent = "Nouveau client";

    dialogClient.showModal();
}
export {AjouterClientDialog, Close_Ajouter_client_dialog, clientEnregistrer_click}

function  Close_Ajouter_client_dialog() {
    dialogClient.close()
}


