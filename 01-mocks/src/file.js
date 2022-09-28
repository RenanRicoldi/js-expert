const { join } = require('path')
const { readFile, access } = require('fs/promises')
const { error } = require('./constants')
const User = require('./user')

const DEFAULT_OPTION = {
  maxLines: 3,
  fields: ["id","name","profession","age"]
}

class File {
  static async csvToJson(filePath) {
    const content = await File.getFileContent(filePath)
    const validation = File.isValid(content, DEFAULT_OPTION)

    if(!validation.valid) throw new Error(validation.error)

    return File.parseCsvToJson(content)
  }

  static async getFileContent(filePath) {
    const fileName = join(__dirname, filePath)
    return (await readFile(fileName)).toString('utf8')
  }

  static isValid(csvString, options = DEFAULT_OPTION) {
    const [header, ...rows] = csvString.split('\n')

    const isHeaderValid = header === options.fields.join(",")
    if(!isHeaderValid) 
      return {
        error: error.FILE_FIELDS_ERROR_MESSAGE,
        valid: false
      }
    

    const isContentLengthValid = rows.length > 0 && rows.length <= options.maxLines

    if(!isContentLengthValid)
      return {
        error: error.FILE_LENGTH_ERROR_MESSAGE,
        valid: false
      }

    return { valid: true }
  }

  static parseCsvToJson(csvString) {
    const lines = csvString.split('\n')

    const firstLine = lines.shift()
    const header = firstLine.split(',')

    return lines.map(line => {
      const values = line.split(',')
      const user = {}

      header.forEach((column, index) => {
        user[column] = values[index]
      })

      return new User(user)
    })
  }
}

module.exports = File

// Hardcoded Testing
// -----------------

// (async () => {
//   // const filePath = join('..', 'mocks', 'emptyFile-Invalid.csv')
//   // const filePath = join('..','mocks','threeItems-valid.csv')
//   // const filePath = join('..','mocks','fourItems-invalid.csv')
//   const filePath = join('..','mocks','header-invalid.csv')

//   const result = await File.csvToJson(filePath)

//   console.log('result', result)
// })();