const { join } = require('path')
const { error } = require('./src/constants')
const File = require('./src/file')
const { rejects, deepStrictEqual } = require('assert')

const mockFolderPath = join('..', 'mocks')

;
(async () => {
  // you can separate contexts by involving it with brackets {}
  {
    const filePath = join(mockFolderPath, 'emptyFile-Invalid.csv')
    const rejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE)
    const result = File.csvToJson(filePath)

    // expects that the result returns the rejection
    await rejects(result, rejection)
  }
  {
    const filePath = join(mockFolderPath, 'fourItems-invalid.csv')
    const rejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE)
    const result = File.csvToJson(filePath)

    await rejects(result, rejection)
  }
  {
    const filePath = join(mockFolderPath, 'header-invalid.csv')
    const rejection = new Error(error.FILE_FIELDS_ERROR_MESSAGE)
    const result = File.csvToJson(filePath)

    await rejects(result, rejection)
  }
  {
    const filePath = join(mockFolderPath, 'threeItems-valid.csv')
    const result = await File.csvToJson(filePath)
    const expected = [
      {
        "id": 1,
        "name": "Renan",
        "profession": "Developer",
        "birthYear": 2001
      },
      {
        "id": 2,
        "name": "Giulia",
        "profession": "Student",
        "birthYear": 2001
      },
      {
        "id": 3,
        "name": "Silvano",
        "profession": "Sales Manager",
        "birthYear": 1967
      }
    ]

    await deepStrictEqual(JSON.stringify(result), JSON.stringify(expected))
  }
})()