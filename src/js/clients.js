import {
siNomEstValide, 
siTelephoneValide, 
isClientIDUnique,
siNomUnique, 
siPlafondValid
} 
    from "./validations.js"

    import {  } from "./storage.js"
import { creerDemo } from "./demo.js"
const demoTab = creerDemo()
const Nom_client = document.getElementById("client-nom")
const Nom_client_error = document.getElementById("client-nom-erreur")


function validerNomClient() {
    if (!siNomEstValide(Nom_client.value)) {
        Nom_client_error.classList.remove('hidden')
        Nom_client_error.textContent = "Le nom n'est pas valide"
        return false;
    }
    if (!siNomUnique(Nom_client.value, demoTab)) {
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
    return true;
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
    &&
     validerPlafondClient() === false 
    && 
     validerTelephoneClient() === false) {
    throw new Error("Veuillez corriger les erreurs signalées avant de soumettre le formulaire.");
    } else {
        const newClient = {
            id: crypto.randomUUID(),
            nom: Nom_client.value,
            telephone: Telephone_client.value,
            PlaFond: convertMadToCen(parseFloat(plafond_client.value)),
            creeLe: new Date().setHours(0,0,0, 0)
        }
        console.log(newClient);
        
    }
})

