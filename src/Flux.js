import Possession from './Possession';

export default class Flux extends Possession {
  constructor(possesseur, libelle, valeur, dateDebut, dateFin = null, tauxAmortissement, jour) {
    super(possesseur, libelle, valeur, dateDebut, dateFin, tauxAmortissement);
    this.jour = jour;
    this.valeurConstante = valeur;
  }

  getValeur(date) {
    const nombreDeMois = (debut, dateEvaluation, jourJ) => {
      let compteur = 0;

      if (debut.getDate() < jourJ) {
        compteur++;
      }

      if (dateEvaluation.getDate() >= jourJ && !(debut.getFullYear() === dateEvaluation.getFullYear() && debut.getMonth() === dateEvaluation.getMonth())) {
        compteur++;
      }

      let totalMois = (dateEvaluation.getFullYear() - debut.getFullYear()) * 12 + (dateEvaluation.getMonth() - debut.getMonth()) - 1;
      compteur += Math.max(0, totalMois);

      return compteur;
    };

    const totalMois = nombreDeMois(this.dateDebut, date, this.jour);
    const montantTotal = totalMois * this.valeurConstante;

    return montantTotal;
  }
}

