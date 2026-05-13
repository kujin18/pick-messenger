export function getCurrentTime() {
  const now = new Date()

  let hours = now.getHours()

  const minutes = now
    .getMinutes()
    .toString()
    .padStart(2, '0')

  const period =
    hours >= 12 ? '오후' : '오전'

  hours = hours % 12 || 12

  return `${period} ${hours}:${minutes}`
}