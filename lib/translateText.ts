import { Translate } from '@google-cloud/translate/build/src/v2'

let translateClient: Translate | null = null

function getTranslateClient() {
  if (!translateClient) {
    translateClient = new Translate({
      key: process.env.GOOGLE_TRANSLATE_API_KEY,
    })
  }
  return translateClient
}

export async function translateText(text: string, targetLanguage: string): Promise<string> {
  // Return original if English or empty
  if (!text || targetLanguage === 'en') {
    return text
  }

  try {
    const translate = getTranslateClient()
    const [translation] = await translate.translate(text, targetLanguage)
    return translation
  } catch (error) {
    console.error('Translation error:', error)
    return text // Return original on error
  }
}

export async function translateFields(
  data: any,
  fields: string[],
  targetLanguage: string
): Promise<any> {
  if (targetLanguage === 'en') {
    return data
  }

  const translated = { ...data }

  for (const field of fields) {
    if (translated[field]) {
      translated[field] = await translateText(translated[field], targetLanguage)
    }
  }

  return translated
}