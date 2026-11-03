import {creerDemo} from './demo.js';
const demoTab = creerDemo()
function siNomEstValide(nom, minLength=2, maxLength=40)
{
    const regex = /[^\p{L}0-9 -]/u
    const cp_nom= nom.trim()
    if (regex.test(cp_nom) || cp_nom.length > maxLength || cp_nom.length < minLength) {
        return false
    }
    else
    {
        return true;
    }
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

function siMontantValid(montant)
{
    const cp_montant = montant.trim()
    if (Number.isInteger(cp_montant)) {
        return true
    }
    else
    {
        return false
    }
}

function isClientIDExists(clientID)
{
    
    const clientWithID = demoTab.clients.filter((client) => client.id == clientID)
    console.log(clientWithID);
    
    if (clientWithID.length== 0) {
        return false
    }
    else
    {
        return true
    }
}

function siPlafondValid(plafond, MinPlafond = 50, MaxPlafond = 10000)
{
    let plafond_toDecimal = parseFloat(plafond.replace(',', '.'))
    if (Number.isNaN(plafond_toDecimal) || plafond_toDecimal < MinPlafond || plafond_toDecimal > MaxPlafond) {
        return false
    }
    return true
    
}

function siMontantValide(montant_MAD, minMontant_CEN=1, maxMontant_CEN=1000000 )
{
    if (Number.isNaN(parseFloat(montant_MAD))) {
        return false;
    }
    const montant_CEN =parseFloat(montant_MAD.replace(',', '.')) * 100
    
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

function siLibelleValide(libelle)
{
   return siNomEstValide(libelle)
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

function isOperationIDUnique(Operatio_id)
{
    const OperationWithID = demoTab.operations.filter((operation) => operation.id == Operatio_id)
    if (OperationWithID.length != 0) {
        return false
    }
    return true
}