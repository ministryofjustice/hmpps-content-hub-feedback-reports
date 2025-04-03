// eslint-disable-next-line import/no-extraneous-dependencies
import { DateTime } from 'luxon'

const properCase = (word: string): string =>
  word.length >= 1 ? word[0].toUpperCase() + word.toLowerCase().slice(1) : word

const isBlank = (str: string): boolean => !str || /^\s*$/.test(str)

/**
 * Converts a name (first name, last name, middle name, etc.) to proper case equivalent, handling double-barreled names
 * correctly (i.e. each part in a double-barreled is converted to proper case).
 * @param name name to be converted.
 * @returns name converted to proper case.
 */
const properCaseName = (name: string): string => (isBlank(name) ? '' : name.split('-').map(properCase).join('-'))

export const convertToTitleCase = (sentence: string): string =>
  isBlank(sentence) ? '' : sentence.split(' ').map(properCaseName).join(' ')

export const initialiseName = (fullName?: string): string | null => {
  // this check is for the authError page
  if (!fullName) return null

  const array = fullName.split(' ')
  return `${array[0][0]}. ${array.reverse()[0]}`
}

export const fromDatePicker = (datePickerDate: string, currentDate: Date = new Date()): string => {
  const parsedDate = DateTime.fromFormat(datePickerDate, 'd/L/y', { locale: 'en-GB' })

  if (parsedDate.isValid) {
    return parsedDate.toFormat('d/L/yyyy')
  }

  return DateTime.fromJSDate(
    new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate()),
  ).toFormat('d/L/yyyy')
}

export const getStartDate = (startDate: string, currentDate: Date = new Date()): string => {
  const parsedDate = DateTime.fromFormat(startDate, 'd/L/y', { locale: 'en-GB' })

  if (parsedDate.isValid) {
    return parsedDate
      .set({
        hour: 0,
        minute: 0,
        second: 0,
      })
      .toISO()
  }

  return DateTime.fromJSDate(
    new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate()),
  ).toISO()
}

export const getEndDate = (endDate: string, currentDate: Date = new Date()): string => {
  const parsedDate = DateTime.fromFormat(endDate, 'd/L/y', { locale: 'en-GB' })

  if (parsedDate.isValid) {
    return parsedDate
      .set({
        hour: 23,
        minute: 59,
        second: 59,
      })
      .toISO()
  }

  return DateTime.fromJSDate(
    new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate()),
  )
    .set({
      hour: 23,
      minute: 59,
      second: 59,
    })
    .toISO()
}
