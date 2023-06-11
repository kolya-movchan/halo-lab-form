export function isUnderage(dateInput: string) {
  const inputDate = new Date(dateInput);
  const currentDate = new Date();
  
  const yearsDiff = currentDate.getFullYear() - inputDate.getFullYear();
  
  // Check if the person is less than 18 years old
  if (yearsDiff < 18) {
    return true;
  }
  
  // If the person is exactly 18 years old, check the month and day
  if (yearsDiff === 18) {
    const currentMonth = currentDate.getMonth();
    const inputMonth = inputDate.getMonth();
    const currentDay = currentDate.getDate();
    const inputDay = inputDate.getDate();
    
    // Check if the person's birth month is later or if it's the same month but the birth day is later
    if (currentMonth < inputMonth || (currentMonth === inputMonth && currentDay < inputDay)) {
      return true;
    }
  }
  
  // If none of the conditions above are met, the person is 18 years or older
  return false;
}

export function getCurrentAge(dateInput: string) {
  const inputDate = new Date(dateInput);
  const currentDate = new Date();
  
  const yearsDiff = currentDate.getFullYear() - inputDate.getFullYear();
  
  // Check if the person has not had their birthday yet this year
  const hasBirthdayPassed = (
    currentDate.getMonth() > inputDate.getMonth() ||
    (currentDate.getMonth() === inputDate.getMonth() && currentDate.getDate() >= inputDate.getDate())
  );
  
  // Subtract 1 from the age if the person has not had their birthday yet this year
  const currentAge = hasBirthdayPassed ? yearsDiff : yearsDiff - 1;
  
  return currentAge;
}
