import {calculateSolde} from './calculations.js';
import { state } from "./state.js";
import {siClientValid, siOperationValide} from "./validations.js"

function loadData()
{
    let data = JSON.parse(localStorage.getItem('karni-v1')) || []
    if (data == []) {
        return
    }
    state.version = data.version
    state.app = data.app
    state.exporteLe = data.exporteLe
    state.clients = data.clients
    state.operations = data.operations
    
    
}
function addClient_storage(C_obj)
{
    if (siClientValid(C_obj, state).valide) {
        state.clients.push(C_obj)
        if (!saveData(state).success) {
            return false
        }
        else
        {
            return true
        }
    }
    else
    {
        return false;
    }
}

function return_client(clientID)
{

    const obj = {
        client: null,
        index: -1,
    }
    for (let i=0; i < state.clients.length; i++) {
            if (state.clients[i].id == clientID) {
            
                obj.client= state.clients[i]
                obj.index= i
                break
            }
        }
    return obj
}

function editClient(C_obj)
{
    let client = return_client(C_obj.id)
    if (client.index == -1) {
        return false;
    }

    state.clients[client.index].nom = C_obj.nom
    state.clients[client.index].telephone = C_obj.telephone
    state.clients[client.index].plafond = C_obj.plafond
    
    return saveData(state).success 
}

function deleteOperation_storage(operationID)
{
    const check = state.operations.some(
        op => op.id === operationID
    );
    
    if (check) {
        const newStateOp = state.operations.filter(
            op => op.id !== operationID
        );

        state.operations = newStateOp;

        return saveData(state);
    } else {
        return false;
    }
}
function addOperation_storage(OP_obj)
{
    if (siOperationValide(OP_obj, state).valide) {
        state.operations.push(OP_obj)
        if (!saveData(state).success) {
            return false
        }
        else
        {
            return true
        }
    }
    else
    {
        return false;
    }
}


function delete_client_operations_storage(clientID)
{
    for(const operation of state.operations)
    {
        if (operation.clientId == clientID) {
            deleteOperation_storage(operation.id)
        }
    }
}
function delete_client_storage(clientID)
{
    if (calculateSolde(state.operations, clientID) != 0) {
        return false;
    }
    else
    {
        
        state.clients = state.clients.filter((client) => client.id != clientID)
        delete_client_operations_storage(clientID)
        return saveData(state);
    }
}
function setData(data=state)
{
    localStorage.setItem('karni-v1', JSON.stringify(data))
}
export function saveData(data) {
    console.log("hello from save data");
    console.log(data);
    
    try {
        setData(data)
        loadData()
        console.log(state);
        
        return {
            success: true,
            error: null
        };

    } catch (error) {
        console.log(error);
        
        return {
            success: false,
            error: error.message
        };
    }
}


export {setData}
export {loadData}
export {delete_client_storage}
export {editClient}
export {addClient_storage}
export {addOperation_storage}
export {deleteOperation_storage}

