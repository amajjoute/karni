import { creerDemo } from "./demo.js";
import { initSearch } from "./search.js";

const demo = creerDemo();

const clients = demo.clients;
const operations = demo.operations;

initSearch(clients, operations);