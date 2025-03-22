// Formatuje datę do formatu DD.MM.YYYY HH:MM
export const formatDate = (dateString) => {
  //console.log("Funkcja formatDate została wywołana!");
  const date = new Date(dateString);
  
  // Dodajemy zera wiodące dla wartości < 10 (np. 01 zamiast 1)
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  // Format polski DD.MM.YYYY HH:MM
  return `${day}.${month}.${year} ${hours}:${minutes}`;
};