import { siDataSetValide } from "./validations.js"
import { state } from "./state.js"
function lireFile(file, callback)
 {
    const reader = new FileReader()
    reader.onload = function() {
       try {
         const importedData = JSON.parse(reader.result)
         const resultat = siDataSetValide(importedData)

         callback(resultat, importedData)
       } catch (error) {
        callback({
            valide: false,
            errors: [
                "Impossible de lire le fichier JSON."
            ]
        }, null)
       }
        
    }
    reader.onerror = function() {
        callback({
            valide: false,
            errors: 
            ["Un erreur pendant la lecture du fichier"]
        }, null)
        
    }
    reader.readAsText(file)
 }
function exportkarniData()
{
    const data = {... state}
    
     
    data.exporteLe = new Date().toISOString()
    const json =  JSON.stringify(data, null, 2)

    const blob = new Blob( [json], {type: "application/json"})
    const url = URL.createObjectURL(blob)

    const nomFichier = data.app + "-" + data.exporteLe.slice(0, 10) + ".json"

    const lien = document.createElement('a')
    lien.href = url
    lien.download = nomFichier
    lien.click()

    URL.revokeObjectURL
}
 export {lireFile}
 export {exportkarniData}