import {creerDemo} from './demo.js';
const demoTab = creerDemo()
function siNomEstValide(nom, minLength=2, maxLength=40)
{
    const regex = /[^\p{L} -]/u
    const cp_nom= nom.trim()
    if (regex.test(cp_nom) || cp_nom.length > maxLength || cp_nom.length < minLength) {
        return false
    }
    else
    {
        return true;
    }
}

function siNomUnique(nom, tab)
{
    const NomUnique = tab.clients.some((client) => client.nom.toLowerCase() == nom.toLowerCase())
    return !NomUnique   
}


function siTelephoneValide(tel)
{
    const cp_tel = tel.trim()
    if (cp_tel === "") {
        return true;
    }
    const regex = /^0[567]\d{8}$/
    
    if (regex.test(cp_tel)) {
        return true
        
    }
    else    
    {
        return false
    }
}

function siClientIDUnique(clientID, tab)
{
    const clientExists = tab.clients.some((client) => client.id == clientID)
    return !clientExists
}

function siClientExiste_ID(clientID, tab)
{
    return !siClientIDUnique(clientID, tab)
}
function siPlafondValid(plafond_MAD, MinPlafond_MAD = 50, MaxPlafond_MAD = 10000)
{
    let plafond_toDecimal = parseFloat(plafond_MAD.replace(',', '.')).toFixed(2)
    
    if (Number.isNaN(plafond_toDecimal) || plafond_toDecimal < MinPlafond_MAD || plafond_toDecimal > MaxPlafond_MAD) {
        return false
    }
    return true
    
}
function siMontantValide(montant_MAD, minMontant_CEN=1, maxMontant_CEN=1000000 )
{
    if (Number.isNaN(parseFloat(montant_MAD))) {
        return false;
    }
    const montant_CEN =parseFloat(montant_MAD.replace(',', '.')).toFixed(2) * 100
    
    if (montant_CEN < minMontant_CEN || montant_CEN > maxMontant_CEN) {
        return false
    }
    else
    {
        return true
    }
}
function siPlafondValid_CEN(plafond_CEN, MinPlafond_CEN = 5000, MaxPlafond_CEN = 1000000)
{
    if (!Number.isInteger(plafond_CEN)) {
        return false
    }
    
    if ( plafond_CEN < MinPlafond_CEN || plafond_CEN > MaxPlafond_CEN) {
        return false
    }
    return true
    
}
function siMontantValide_CEN(montant_CEN, minMontant_CEN=1, maxMontant_CEN=1000000 )
{
    if (!Number.isInteger(montant_CEN)) {
        return false
    }
    
    if ( montant_CEN < minMontant_CEN || montant_CEN > maxMontant_CEN) {
        return false
    }
    return true
}

console.log(siMontantValide_CEN("123456"));
console.log(siMontantValide_CEN());
console.log(siMontantValide_CEN(0));


function siTypeValide(type)
{
    return type == "achat" ? true : (type == "remboursement" ? true:false)
}

function siLibelleValide(libelle, minLength=2, maxLength=60)
{
    const regex = /[^\p{L}0-9 -]/u
    const cp_libelle= libelle.trim()
    if (regex.test(cp_libelle) || cp_libelle.length > maxLength || cp_libelle.length < minLength) {
        return false
    }
    else
    {
        return true;
    }
}
function siGroupeLibellesValide(groupe_libelle)
{
    const libellesTab = groupe_libelle.split(',')
    for (let index = 0; index < libellesTab.length; index++) {
        if (!siLibelleValide(libellesTab[index])) {
            return false
        }
    }
    return true
}
function siDateValide(date_str)
{
    const inputDate = new Date(date_str + "T00:00:00")
    const todayDate = new Date()

    todayDate.setHours(0, 0, 0, 0)
    
    if (Number.isNaN(inputDate.getDate()) || inputDate > todayDate) {
        return false;
    }
    else
    {
        return true
    }
}

function siOperationIDUnique(Operatio_id, tab)
{
    const isOperationExists = tab.operations.some((operation) => operation.id == Operatio_id)
    return !isOperationExists
}

function siClientValid(obj, tab)
{
    const siValide = {
        valide: true,
        errors : [
        ]
    }
    if (!siClientIDUnique(obj.id, tab)) {
        siValide.valide = false
        siValide.errors.push({
            msg: "clientID n'est pas unique."
        })
    }
    if (!siNomEstValide(obj.nom)) {
        siValide.valide = false
        siValide.errors.push({
            msg: "Client nom n'est pas valide"
        })
    }
    if (!siNomUnique(obj.nom, tab)) {
        siValide.valide = false
        siValide.errors.push({
            msg: "client nom deja existe."
        })
    }
    if (!siTelephoneValide(obj.telephone)) {
        siValide.valide = false
        siValide.errors.push({
            msg: "client telephone n'est pas valide."
        })
    }
    if (!siPlafondValid_CEN(obj.plafond)) {
        siValide.valide = false
        siValide.errors.push({
            msg: "plafond n'est pas valide."
        })
    }
    if (!siDateValide(obj.date)) {
        siValide.valide = false
        siValide.errors.push({
            msg: "la date n'est pas valide"
        })
    }
    return siValide
}
function siOperationValide(obj, tab)
{
    const isValide = {
        valide: true,
        errors: [],
    }
    if (!siOperationIDUnique(obj.id, tab)) {
        isValide.valide = false
        isValide.errors.push({msg: "L'operation id deja existe."})
    }if (!siClientExiste_ID(obj.clientId, tab)) {
        isValide.valide = false
        isValide.errors.push({msg: "Le client n'existe pas"})
    }if (!siTypeValide(obj.type)) {
        isValide.valide = false
        isValide.errors.push({msg: "le type n est pas valide"})
    }if (!siMontantValide_CEN(obj.montant)) {
        isValide.valide = false
        isValide.errors.push({msg: "le montant n'est pas valide"})
    }if (!siGroupeLibellesValide(obj.libelle)) {
        isValide.valide = false
        isValide.errors.push({msg: "libelle champs n'est pas valide"})
    }
        return isValide
}

//i need to add
function siDataSetValide(tab)
{
    const obj = {
        valide: true,
        clients_erreurs: [],
        operations_erreurs: [],
    }
    for (const client of tab.clients) {
        let client_isValide_obj = siClientValid(client, tab)
        if (client_isValide_obj.valide == false) {
            obj.valide = false
            obj.clients_erreurs.push(client_isValide_obj)
        }
    }
    for (const operation of tab.operations)
    {
        let operation_isValide_obj = siOperationValide(operation, tab)
        if (operation_isValide_obj.valide == false) {
            obj.valide = false
            obj.operations_erreurs.push(operation_isValide_obj)
        }
    }
    return obj
}

const demoTab2 = {
    app: "karni",
    version: 1,
    exporteLe: "2026-11-04T10:30:00.000Z",

    clients: [
        {
            id: "c-001",
            nom: "Fatima Zahra Alaoui",
            telephone: "0612345678",
            plafond: 150000,
            creeLe: "2026-10-01"
        },
        {
            id: "c-002",
            nom: "Youssef Benali",
            telephone: "0661234567",
            plafond: 80000,
            creeLe: "2026-10-05"
        },
        {
            id: "c-003",
            nom: "Khadija Lahcen",
            telephone: "",
            plafond: 50000,
            creeLe: "2026-10-10"
        },
        {
            id: "c-004",
            nom: "Omar El Idrissi",
            telephone: "0701020304",
            plafond: 30000,
            creeLe: "2026-10-15"
        },
        {
            id: "c-005",
            nom: "Salma Ouazzani",
            telephone: "0522334455",
            plafond: 100000,
            creeLe: "2026-10-20"
        }
    ],

    operations: [
        // Fatima
        {
            id: "o-001",
            clientId: "c-001",
            type: "achat",
            montant: 4550,
            libelle: "Lait et pain",
            date: "2026-10-22"
        },
        {
            id: "o-002",
            clientId: "c-001",
            type: "achat",
            montant: 5000,
            libelle: "Bonbonne de gaz",
            date: "2026-10-23"
        },
        {
            id: "o-003",
            clientId: "c-001",
            type: "remboursement",
            montant: 2000,
            libelle: "Paiement partiel",
            date: "2026-10-25"
        },

        // Youssef
        {
            id: "o-004",
            clientId: "c-002",
            type: "achat",
            montant: 3500,
            libelle: "Produits alimentaires",
            date: "2026-10-24"
        },
        {
            id: "o-005",
            clientId: "c-002",
            type: "remboursement",
            montant: 1500,
            libelle: "Remboursement",
            date: "2026-10-28"
        },

        // Khadija
        {
            id: "o-006",
            clientId: "c-003",
            type: "achat",
            montant: 7500,
            libelle: "Courses semaine",
            date: "2026-10-26"
        },

        // Omar
        {
            id: "o-007",
            clientId: "c-004",
            type: "achat",
            montant: 2500,
            libelle: "Pain et lait",
            date: "2026-10-27"
        },
        {
            id: "o-008",
            clientId: "c-004",
            type: "remboursement",
            montant: 2500,
            libelle: "Dette reglee",
            date: "2026-10-30"
        },

        // Salma
        {
            id: "o-009",
            clientId: "c-005",
            type: "achat",
            montant: 12000,
            libelle: "Produits menagers",
            date: "2026-10-29"
        },
        {
            id: "o-010",
            clientId: "c-005",
            type: "achat",
            montant: 3000,
            libelle: "Produits laitiers",
            date: "2026-11-01"
        }
    ]
};
console.log(siDataSetValide(demoTab));

console.log(siDataSetValide(demoTab2));
console.log(siDataSetValide(demoTab2).clients_erreurs);
console.log(siDataSetValide(demoTab2).operations_erreurs);




export {siNomEstValide}
export {siTelephoneValide}
export {siClientIDUnique as isClientIDUnique}
export {siPlafondValid}
export {siMontantValide}
export {siTypeValide}
export {siLibelleValide}
export {siDateValide}
export {siOperationIDUnique}
export {siNomUnique}