export const formatDate = (dateStr) => {
  // ***-------ADDITION LINES-----***/
 // Convertit la chaîne de caractères 'dateStr' en un objet Date
 const date = new Date(dateStr);  
 // Applique la méthode ‘toISOString’ pour obtenir une version ISO de la date
 const isoString = date.toISOString(); 
 // Utilise 'split' pour diviser la chaîne de caractères en deux à l'endroit où se trouve 'T'
 const party = isoString.split('T'); 
 // Retourne la première partie de la chaîne divisée, qui représente la date au format "AAAA-MM-JJ"
 return party[0];
}

 
export const formatStatus = (status) => {
  switch (status) {
    case "pending":
      return "En attente"
    case "accepted":
      return "Accepté"
    case "refused":
      return "Refused"
  }
}