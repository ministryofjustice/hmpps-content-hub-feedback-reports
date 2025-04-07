import { convertToTitleCase, initialiseName, getStartDate, getEndDate, fromDatePicker } from './utils'

describe('convertToTitleCase()', () => {
  it.each([
    [null, null, ''],
    ['empty string', '', ''],
    ['Lower case', 'robert', 'Robert'],
    ['Upper case', 'ROBERT', 'Robert'],
    ['Mixed case', 'RoBErT', 'Robert'],
    ['Multiple words', 'RobeRT SMiTH', 'Robert Smith'],
    ['Leading spaces', '  RobeRT', '  Robert'],
    ['Trailing spaces', 'RobeRT  ', 'Robert  '],
    ['Hyphenated', 'Robert-John SmiTH-jONes-WILSON', 'Robert-John Smith-Jones-Wilson'],
  ])('%s convertToTitleCase(%s, %s)', (_: string, a: string, expected: string) => {
    expect(convertToTitleCase(a)).toEqual(expected)
  })
})

describe('initialiseName()', () => {
  it.each([
    [null, null, null],
    ['Empty string', '', null],
    ['One word', 'robert', 'r. robert'],
    ['Two words', 'Robert James', 'R. James'],
    ['Three words', 'Robert James Smith', 'R. Smith'],
    ['Double barrelled', 'Robert-John Smith-Jones-Wilson', 'R. Smith-Jones-Wilson'],
  ])('%s initialiseName(%s, %s)', (_: string, a: string, expected: string) => {
    expect(initialiseName(a)).toEqual(expected)
  })
})

describe('fromDatePicker()', () => {
  const currentDate = new Date(2024, 0, 10)

  it.each([
    ['Empty string', '', '10/1/2024'],
    ['Bad date 31st February 2024', '31/2/2024', '10/1/2024'],
    ['30th March 2024', '30/3/2024', '30/3/2024'],
  ])('%s getEndDate(%s, %s)', (_: string, a: string, expected: string) => {
    expect(fromDatePicker(a, currentDate)).toEqual(expected)
  })
})

describe('getStartDate()', () => {
  const currentDate = new Date(2024, 0)

  it.each([
    ['Empty string', '', '2024-01-01T00:00:00.000+00:00'],
    ['Bad date 31st February 2024', '31/2/2024', '2024-01-01T00:00:00.000+00:00'],
    ['30th March 2024', '30/3/2024', '2024-03-30T00:00:00.000+00:00'],
  ])('%s getStartDate(%s, %s)', (_: string, a: string, expected: string) => {
    expect(getStartDate(a, currentDate)).toEqual(expected)
  })
})

describe('getEndDate()', () => {
  const currentDate = new Date(2024, 0, 10)

  it.each([
    ['Empty string', '', '2024-01-10T23:59:59.000+00:00'],
    ['Bad date 31st February 2024', '31/2/2024', '2024-01-10T23:59:59.000+00:00'],
    ['30th March 2024', '30/3/2024', '2024-03-30T23:59:59.000+00:00'],
  ])('%s getEndDate(%s, %s)', (_: string, a: string, expected: string) => {
    expect(getEndDate(a, currentDate)).toEqual(expected)
  })
})
