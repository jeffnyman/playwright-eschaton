function convertMillisecondsToMMSS(milliseconds: number): string {
  if (milliseconds <= 0) {
    return "00:00";
  }

  const min = Math.floor(milliseconds / 60000);
  const sec = Math.floor((milliseconds % 60000) / 1000);

  const minutes = pad(min);
  const seconds = pad(sec);

  return `${minutes}:${seconds}`;
}

function pad(value: number): string {
  return value < 10 ? `0${value}` : `${value}`;
}

export default convertMillisecondsToMMSS;
