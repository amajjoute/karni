import { siDataSetValide } from "./validations.js"
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
            errors: {
                msg: "Impossible de lire le fichier JSON."
            }
        }, null)
       }
        
    }
    reader.onerror = function() {
        callback({
            valide: false,
            errors: 
            {msg: "Un erreur pendant la lecture du fichier",}
        }, null)
        
    }
    reader.readAsText(file)
 }

 export {lireFile}