import {delete_client_storage,return_client, loadData ,saveData} from './storage.js';
import { lireFile } from './import-export.js';
import { creerDemo } from './demo.js';
import { exportkarniData } from './import-export.js';
import { calculateSolde } from './calculations.js'; 
loadData()

const dialogConfirmation = document.getElementById("dialog-confirmation");

const confirmationTitre = document.getElementById("confirmation-titre");
const confirmationMessage = document.getElementById("confirmation-message");
const confirmationDetails = document.getElementById("confirmation-details");
const confirmationValider = document.getElementById("confirmation-valider");
const confirmationAnnuler = document.getElementById("confirmation-annuler");

//export
const export_btn = document.getElementById('exporter')
export_btn.addEventListener('click', exportkarniData)

//demo
const charger_demo = document.getElementById('charger-demo')
const vider_carnet = document.getElementById('vider-carnet')
charger_demo.addEventListener('click', ()=> {
    const demoTab = creerDemo()
    demanderConfirmation({titre: 'Charger les données de démonstration ?',message: 'Cette action remplacera toutes les données actuelles de votre carnet par des données de démonstration. Vos clients et leurs opérations actuels seront supprimés.\n Voulez-vous continuer ?'}, function(confirm) {
        if (!confirm) {
            return
        }
        saveData(demoTab)
    })
})
vider_carnet.addEventListener('click', ()=>{
    demanderConfirmation({titre: 'Vider le carnet ?', message: 'Êtes-vous sûr de vouloir vider votre carnet ? Cette action supprimera définitivement tous vos clients et toutes leurs opérations enregistrées. \nCette action est irréversible.'}, function(confirm)
{
    if (!confirm) {
        return
    }
    saveData({"app": "karni",
        "version": 1,
        clients: [],
        operations: [],})
})
})
let apresConfirmation = null;

dialogConfirmation.addEventListener("close", function() {
    const confirme = dialogConfirmation.returnValue === "valider";

    if (apresConfirmation) {
        const callback = apresConfirmation;
        apresConfirmation = null;

        callback(confirme);
    }
});

function demanderConfirmation(
    { titre, message, details = [], confirmerAutorise = true },
    callback
) {
    confirmationTitre.textContent = titre;
    confirmationMessage.textContent = message;

    confirmationDetails.replaceChildren();

    details.forEach(function(detail) {
        const li = document.createElement("li");
        li.textContent = detail;
        confirmationDetails.appendChild(li);
    });

    // Enable or disable the Confirm button
    confirmationValider.disabled = !confirmerAutorise;

    // Change Cancel to Close when confirmation isn't allowed
    confirmationAnnuler.textContent = confirmerAutorise
        ? "Annuler"
        : "Fermer";

    apresConfirmation = callback;

    dialogConfirmation.returnValue = "";
    dialogConfirmation.showModal();
}
//import
const inputFile = document.getElementById('import-fichier')
const importer_btn = document.getElementById('importer')
importer_btn.addEventListener('click', () => 
{
    inputFile.classList.remove('hidden')
})
inputFile.addEventListener('change', (event) => {
    const file = event.target.files[0]
    lireFile(file, function(resultat, importedData) {
    if (resultat.valide) {

        demanderConfirmation({
         titre: "Confirmer l'importation",
         message: `Ce fichier contient ${importedData.clients.length} clients et ${importedData.operations.length} opérations. Il remplacera les données actuelles.`
    }, function(confirme) {

        if (!confirme) {
            console.log("Importation annulée");
            return;
        }

        // Replace the current dataset
        saveData(importedData);
        
        // Refresh the interface
        // Call your rendering function here
    });

}
    else
    {

    demanderConfirmation({
        titre: "Importation impossible",
        message: "Le fichier contient des erreurs. Corrigez-les avant de réessayer.",
        details: resultat.errors,
        confirmerAutorise: false
    }, function() {
        // No action: the imported data is invalid.
    });

    return;
    }

    
    })
})

//clients
import {AjouterClient, AjouterClientDialog, Close_Ajouter_client_dialog, clientEnregistrer_click, initDialog_modifierClient} from './clients.js';
import { state } from './state.js';
const listeClients = document.getElementById("liste-clients")
function listeClientsEventListener(event)
{
    const btn = event.target.closest("[data-action='supprimer-client']") || event.target.closest("[data-action='modifier-client'")
    if (!btn) {
        return
    }

    if (btn.getAttribute('data-action') == 'supprimer-client') {
        deleteClient(btn.closest('li').getAttribute('data-client-id'))
    }
    else
    {
        initDialog_modifierClient(return_client(btn.closest('li').getAttribute('data-client-id')).client)
    }
}

listeClients.addEventListener('click', listeClientsEventListener)

const clientEnregistrer = document.querySelector("#client-enregistrer");
clientEnregistrer.addEventListener('click', clientEnregistrer_click )

const btnAnnuler = document.querySelector("#client-annuler")
btnAnnuler.addEventListener("click", Close_Ajouter_client_dialog)

const nouveauClient = document.getElementById("nouveau-client");
nouveauClient.addEventListener('click', AjouterClientDialog)


function deleteClient(clientID)
{
    if (calculateSolde(state.operations, clientID) != 0) {
        demanderConfirmation({titre: 'Supprimer le client', message: `Voulez-vous vraiment supprimer ${clientID} ?`, details: ["Impossible de supprimer ce client car il a une dette."], confirmerAutorise: false}, function (confirm) {})
        return
    }
    if (demanderConfirmation({titre: 'Supprimer le client', message:  `Voulez-vous vraiment supprimer ${clientID} ?`}, function(confirm) {
        if (!confirm) {
            console.log("suppression annule");
        }
        else
        {
            delete_client_storage(clientID)
        }
    })) {
        
    }
}


function afficherClients(state) {
    const liste = document.getElementById("liste-clients");
    const modele = document.getElementById("modele-client");
    const etatVide = document.getElementById("etat-vide");

    liste.innerHTML = "";

    // Check if there are no clients
    if (state.clients.length === 0) {
        etatVide.classList.remove("hidden");
        liste.classList.add("hidden");
        return;
    }

    etatVide.classList.add("hidden");
    liste.classList.remove("hidden");

    // Add each client
    state.clients.forEach(client => {
        const element = modele.content.cloneNode(true);

        const li = element.querySelector("li");
        li.dataset.clientId = client.id;

        li.querySelector(".client-nom").textContent = client.nom;
        li.querySelector(".client-telephone").textContent =
            client.telephone || "Téléphone non renseigné";

        liste.appendChild(element);
    });
}