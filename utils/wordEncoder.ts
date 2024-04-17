import { letterTable } from "@/constants/letterTable"

/**
 * Encodes a word into a 16-character hexadecimal string.
 * @param text - The word to encode.
 * @returns {string} The encoded word.
 * @throws An error if the encoding fails.
 */
export const wordEncoder = (text: string): string => {
  let controlChar = (
    (4 +
      Object.keys(letterTable).findIndex((key) => key === text[0]) +
      text.length) *
    7
  )
    .toString(16)
    .toUpperCase()

  const paddingChars = () => {
    const paddingLength = 7 - text.length
    const numOfRealChars = text.length
    const firstChar = text[0]
    const index = Object.keys(letterTable).findIndex((key) => key === firstChar)
    let result = ""
    for (let i = 0; i < paddingLength; i++) {
      result += Object.keys(letterTable)[numOfRealChars + index + i]
    }
    return result
  }

  const paddedText = text.padEnd(7, paddingChars()).toUpperCase()

  let encodedText = ""

  for (let i = 0; i < paddedText.length; i++) {
    const char = paddedText[i]
    const hexValue = letterTable[char]
    encodedText += hexValue
  }

  encodedText += controlChar

  const formattedText = encodedText.match(/.{1,4}/g)?.join("-") || ""

  if (
    !/^[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}$/.test(formattedText)
  ) {
    throw new Error("Encoding failed")
  }

  return formattedText
}

/**
 * Decodes a 16-character hexadecimal string into a word.
 * @param text - The encoded word to decode.
 * @returns {string} The decoded word.
 * @throws An error if the decoding fails.
 */
export const wordDecoder = (text: string): string => {
  const letterTableReversed: { [key: string]: string } = Object.entries(
    letterTable
  ).reduce((acc, [key, value]) => ({ ...acc, [value]: key }), {})

  const encodedText = text.replace(/-/g, "")

  const firstChar = letterTableReversed[encodedText.slice(0, 2)]
  const index = Object.keys(letterTable).findIndex((key) => key === firstChar)
  const lastChar = encodedText.slice(-2)

  const numOfRealChars = parseInt(lastChar, 16) / 7 - 4 - index

  let decodedText = ""

  for (let i = 0; i < encodedText.length; i += 2) {
    const char = encodedText.slice(i, i + 2)
    const letter = letterTableReversed[char]
    decodedText += letter
  }

  const result = decodedText.slice(0, numOfRealChars)

  if (result.length === 0) {
    throw new Error("Decoding failed")
  }

  return result
}
