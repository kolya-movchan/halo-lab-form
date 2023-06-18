function calculateAge(dateInput: string) {
  const inputDate = new Date(dateInput);
  const currentDate = new Date();

  const yearsDiff = currentDate.getFullYear() - inputDate.getFullYear();

  return {
    yearsDiff,
    currentMonth: currentDate.getMonth(),
    inputMonth: inputDate.getMonth(),
    currentDay: currentDate.getDate(),
    inputDay: inputDate.getDate()
  };
}

export function getCurrentAge(dateInput: string) {
  const { yearsDiff, currentMonth, inputMonth, currentDay, inputDay } = calculateAge(dateInput);

  // Check if the person has not had their birthday yet this year
  const hasBirthdayPassed =
    currentMonth > inputMonth || (currentMonth === inputMonth && currentDay >= inputDay);

  // Subtract 1 from the age if the person has not had their birthday yet this year
  const currentAge = hasBirthdayPassed ? yearsDiff : yearsDiff - 1;

  return currentAge;
}

export function isUnderage(dateInput: string) {
  return getCurrentAge(dateInput) < 18;
 }
