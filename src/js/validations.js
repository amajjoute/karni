function siNomEstValide(nom, minLength=2, maxLength=40)
{
    const regex = /[^\p{L}\p{M} '-’]/u;
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

function siTypeValide(type)
{
    return type == "achat" ? true : (type == "remboursement" ? true:false)
}

function siLibelleValide(libelle, minLength=2, maxLength=60)
{
    if (libelle == "") {
        return true
    }
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
        errors_string : ""
    }
    if (!siClientIDUnique(obj.id, tab)) {
        siValide.valide = false
        siValide.errors_string +="clientID n'est pas unique, "
    }
    if (!siNomEstValide(obj.nom)) {
        siValide.valide = false
        siValide.errors_string +="Client nom n'est pas valide, "
    }
    if (!siNomUnique(obj.nom, tab)) {
        siValide.valide = false
        siValide.errors_string +="client nom deja existe, "
    }
    if (!siTelephoneValide(obj.telephone)) {
        siValide.valide = false
        siValide.errors_string += "client telephone n'est pas valide, "
    }
    if (!siPlafondValid_CEN(obj.plafond)) {
        siValide.valide = false
        siValide.errors_string +="plafond n'est pas valide, "
    }
    if (!siDateValide(obj.creeLe)) {
        siValide.valide = false
        siValide.errors_string += "la date n'est pas valide, "
    }
    siValide.errors_string = siValide.errors_string == "" ? "" : obj.id + ": " + siValide.errors_string.slice(0, siValide.errors_string.length - 2)
    return siValide
}
function siOperationValide(obj, tab)
{
    const isValide = {
        valide: true,
        errors_string: "",
    }
    if (!siOperationIDUnique(obj.id, tab)) {
        isValide.valide = false
        isValide.errors_string +="L'operation id deja existe, "
    }if (!siClientExiste_ID(obj.clientId, tab)) {
        isValide.valide = false
        isValide.errors_string +="Le client n'existe pas, "
    }if (!siTypeValide(obj.type)) {
        isValide.valide = false
        isValide.errors_string +="le type n est pas valide, "
    }if (!siMontantValide_CEN(obj.montant)) {
        isValide.valide = false
        isValide.errors_string+= "le montant n'est pas valide, "
    }if (!siGroupeLibellesValide(obj.libelle)) {
        isValide.valide = false
        isValide.errors_string+="libelle champs n'est pas valide, "
    }
    isValide.errors_string = isValide.errors_string == "" ? "" : obj.id + ": " + isValide.errors_string.slice(0, isValide.errors_string.length - 2) + "."
    return isValide
}

function siDataSetValide(tab)
{
    const obj = {
        valide: true,
        errors: [],
        valideDataSet : {
        clients: [],
        operations: [],
    }
    }
    for (const client of tab.clients) {
        
        const client_isValide_obj = siClientValid(client, obj.valideDataSet)
        if (client_isValide_obj.valide == false) {
            obj.valide = false
            obj.errors.push(client_isValide_obj.errors_string)
        }
        else
        {
            obj.valideDataSet.clients.push(client)
        }
    }
    for (const operation of tab.operations)
    {
        let operation_isValide_obj = siOperationValide(operation, obj.valideDataSet)
        if (operation_isValide_obj.valide == false) {
            obj.valide = false
            obj.errors.push(operation_isValide_obj.errors_string)
        }
        else 
        {
            obj.valideDataSet.operations.push(operation)
        }
    }
    console.log(obj.errors);

    
    return obj
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
export {siClientValid}
export {siOperationValide}
export {siDataSetValide}