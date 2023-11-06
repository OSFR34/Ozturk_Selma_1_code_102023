export const formatDate = (dateIso) => {
  // ***-------MODIFICATIONS LINES-----***/
// EN :Converts the string 'dateStr' to a Date object
// FR:Convertit la chaîne de caractères 'dateStr' en un objet Date
 const date = new Date(dateIso);  
//  EN :"toISOString" allows you to obtain an ISO version of the date
// FR"toISOString" permet d'obtenir une version ISO de la date
 const isoString = date.toISOString(); 
// EN :"split" splits the string in two at the location of 'T'
//FR:  "split" divise la chaîne de caractères en deux à l'endroit où se trouve 'T'
 const party = isoString.split('T'); 
//  EN :Returns the first part of the split string, which represents the date in the format "YYYY-MM-DD".
// FR: Retourne la première partie de la chaîne divisée, qui représente la date au format "AAAA-MM-JJ"
 return party[0];
}
// ***------------END MODIFICATIONS---------***/
 
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
