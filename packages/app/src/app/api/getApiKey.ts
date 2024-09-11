import { clapperApiKeyToUseBuiltinCredentials } from './globalSettings'

export function getApiKey(
  providerApiKey: string,
  builtinProviderApiKey: string,
  clapperApiKey: string
) {
  if (!providerApiKey) {
    if (clapperApiKeyToUseBuiltinCredentials) {
      if (clapperApiKey !== clapperApiKeyToUseBuiltinCredentials) {
        throw new Error(`Missing API key`)
      } else {
        // user has a valid Clapper API key, so they are allowed to use the built-in credentials
        providerApiKey = builtinProviderApiKey
      }
    } else {
      // no Clapper API key is defined, so we give free access to the built-in credentials
      providerApiKey = builtinProviderApiKey
    }
  }
  return providerApiKey
}
