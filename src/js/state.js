const ilYa = (jours) => {
  const date = new Date();
  date.setDate(date.getDate() - jours);
  const mois = String(date.getMonth() + 1).padStart(2, "0");
  const jour = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${mois}-${jour}`;
};



const state = {
    app: "karni",
    version: 1,
    clients: [{ id: "c-demo-1", nom: "Fatima Zahra Alaoui", telephone: "0612345678", plafond: 150000, creeLe: ilYa(60) }],
    operations: []
};

export { state };