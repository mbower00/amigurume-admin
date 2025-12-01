export function formatDate(d) {
  const date = new Date(d)
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${getTime(date)}`
}

function getTime(date) {
  let hour = date.getHours()
  let minute = date.getMinutes()
  let suffix = 'AM'
  // convert from military time
  if (hour === 0) {
    hour = 12
  }
  if (hour > 11) {
    suffix = 'PM'
  }
  if (hour > 12) {
    hour -= 12
  }
  // zero padding on minute
  if (minute < 10) {
    minute = `0${minute}`
  }
  return `${hour}:${minute} ${suffix}`
}
