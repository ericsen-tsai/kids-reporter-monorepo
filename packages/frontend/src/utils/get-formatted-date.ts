export const getFormattedDate = (
  date: string,
  separator: string = '.'
): string => {
  const dateObj = new Date(date)
  if (!date || !dateObj || isNaN(dateObj.getTime())) {
    return ''
  }
  const year = dateObj.getFullYear()
  const month = `${dateObj.getMonth() + 1}`.padStart(2, '0')
  const day = `${dateObj.getDate()}`.padStart(2, '0')
  return [year, month, day].join(separator)
}
