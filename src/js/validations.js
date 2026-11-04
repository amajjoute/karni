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


function siPlafondValid(plafond_MAD, MinPlafond_MAD = 50, MaxPlafond_MAD = 10000)
{
    let plafond_toDecimal = parseFloat((plafond_MAD.replace(',', '.'))).toFixed(2)
    
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