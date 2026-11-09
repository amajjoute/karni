import { calculateDashboardStats } from "./calculations.js";
// import { initSearch } from "./search.js";
import { state } from "./state.js"
import { events, afficherClients } from "./search.js";

const totalDu = document.querySelector("#total-du");
const nbClients = document.querySelector("#nb-clients");
const nbEnDette = document.querySelector("#nb-en-dette");
const nbEnRetard = document.querySelector("#nb-en-retard");

function renderDashboard() {
    const today = new Date().toISOString().slice(0, 10);
    const getDashboardStats = calculateDashboardStats(state.clients, state.operations, today);

    totalDu.textContent = getDashboardStats.totalOwed + " MAD";
    nbClients.textContent = getDashboardStats.totalClients;
    nbEnDette.textContent = getDashboardStats.clientsInDebt;
    nbEnRetard.textContent = getDashboardStats.clientsEnRetard;

}

function renderSearch() {
    events();
    afficherClients();
}

export { renderDashboard, renderSearch };