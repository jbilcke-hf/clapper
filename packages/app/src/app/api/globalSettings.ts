import { ClapWorkflowProvider } from '@aitube/clap'

export const clapperApiKeyToUseBuiltinCredentials = `${process.env.CLAPPER_API_KEY_TO_USE_BUILTIN_CREDENTIALS || ''}`
export const disableProviderCredentialsInUserSettings: boolean =
  `${process.env.NEXT_PUBLIC_DISABLE_PROVIDER_CREDENTIALS_IN_USER_SETTINGS || ''}`.toLowerCase() ===
  'true'
export const builtinProviderCredentialsAitube = `${process.env.BUILTIN_PROVIDER_CREDENTIALS_AITUBE || ''}`
export const builtinProviderCredentialsAnthropic = `${process.env.BUILTIN_PROVIDER_CREDENTIALS_ANTHROPIC || ''}`
export const builtinProviderCredentialsBigmodel = `${process.env.BUILTIN_PROVIDER_CREDENTIALS_BIGMODEL || ''}`
export const builtinProviderCredentialsBuiltin = `${process.env.BUILTIN_PROVIDER_CREDENTIALS_BUILTIN || ''}`
export const builtinProviderCredentialsCivitai = `${process.env.BUILTIN_PROVIDER_CREDENTIALS_CIVITAI || ''}`
export const builtinProviderCredentialsCohere = `${process.env.BUILTIN_PROVIDER_CREDENTIALS_COHERE || ''}`
export const builtinProviderCredentialsComfydeploy = `${process.env.BUILTIN_PROVIDER_CREDENTIALS_COMFYDEPLOY || ''}`
export const builtinProviderCredentialsComfyicu = `${process.env.BUILTIN_PROVIDER_CREDENTIALS_COMFYICU || ''}`
export const builtinProviderCredentialsComfyui = `${process.env.BUILTIN_PROVIDER_CREDENTIALS_COMFYUI || ''}`
export const builtinProviderCredentialsCustom = `${process.env.BUILTIN_PROVIDER_CREDENTIALS_CUSTOM || ''}`
export const builtinProviderCredentialsElevenlabs = `${process.env.BUILTIN_PROVIDER_CREDENTIALS_ELEVENLABS || ''}`
export const builtinProviderCredentialsEverartai = `${process.env.BUILTIN_PROVIDER_CREDENTIALS_EVERARTAI || ''}`
export const builtinProviderCredentialsFalai = `${process.env.BUILTIN_PROVIDER_CREDENTIALS_FALAI || ''}`
export const builtinProviderCredentialsFireworksai = `${process.env.BUILTIN_PROVIDER_CREDENTIALS_FIREWORKSAI || ''}`
export const builtinProviderCredentialsGoogle = `${process.env.BUILTIN_PROVIDER_CREDENTIALS_GOOGLE || ''}`
export const builtinProviderCredentialsGroq = `${process.env.BUILTIN_PROVIDER_CREDENTIALS_GROQ || ''}`
export const builtinProviderCredentialsHedra = `${process.env.BUILTIN_PROVIDER_CREDENTIALS_HEDRA || ''}`
export const builtinProviderCredentialsHotshot = `${process.env.BUILTIN_PROVIDER_CREDENTIALS_HOTSHOT || ''}`
export const builtinProviderCredentialsHuggingface = `${process.env.BUILTIN_PROVIDER_CREDENTIALS_HUGGINGFACE || ''}`
export const builtinProviderCredentialsKitsai = `${process.env.BUILTIN_PROVIDER_CREDENTIALS_KITSAI || ''}`
export const builtinProviderCredentialsKuaishou = `${process.env.BUILTIN_PROVIDER_CREDENTIALS_KUAISHOU || ''}`
export const builtinProviderCredentialsLeonardoai = `${process.env.BUILTIN_PROVIDER_CREDENTIALS_LEONARDOAI || ''}`
export const builtinProviderCredentialsLetzai = `${process.env.BUILTIN_PROVIDER_CREDENTIALS_LETZAI || ''}`
export const builtinProviderCredentialsLumalabs = `${process.env.BUILTIN_PROVIDER_CREDENTIALS_LUMALABS || ''}`
export const builtinProviderCredentialsMidjourney = `${process.env.BUILTIN_PROVIDER_CREDENTIALS_MIDJOURNEY || ''}`
export const builtinProviderCredentialsMistralai = `${process.env.BUILTIN_PROVIDER_CREDENTIALS_MISTRALAI || ''}`
export const builtinProviderCredentialsModelslab = `${process.env.BUILTIN_PROVIDER_CREDENTIALS_MODELSLAB || ''}`
export const builtinProviderCredentialsOpenai = `${process.env.BUILTIN_PROVIDER_CREDENTIALS_OPENAI || ''}`
export const builtinProviderCredentialsPiapi = `${process.env.BUILTIN_PROVIDER_CREDENTIALS_PIAPI || ''}`
export const builtinProviderCredentialsReplicate = `${process.env.BUILTIN_PROVIDER_CREDENTIALS_REPLICATE || ''}`
export const builtinProviderCredentialsRunwayml = `${process.env.BUILTIN_PROVIDER_CREDENTIALS_RUNWAYML || ''}`
export const builtinProviderCredentialsStabilityai = `${process.env.BUILTIN_PROVIDER_CREDENTIALS_STABILITYAI || ''}`
export const builtinProviderCredentialsSuno = `${process.env.BUILTIN_PROVIDER_CREDENTIALS_SUNO || ''}`
export const builtinProviderCredentialsUdio = `${process.env.BUILTIN_PROVIDER_CREDENTIALS_UDIO || ''}`

export const sharedCredentials: Record<ClapWorkflowProvider, string> = {
  [ClapWorkflowProvider.NONE]: '',
  [ClapWorkflowProvider.AITUBE]: builtinProviderCredentialsAitube,
  [ClapWorkflowProvider.ANTHROPIC]: builtinProviderCredentialsAnthropic,
  [ClapWorkflowProvider.BIGMODEL]: builtinProviderCredentialsBigmodel,
  [ClapWorkflowProvider.BUILTIN]: builtinProviderCredentialsBuiltin,
  [ClapWorkflowProvider.CIVITAI]: builtinProviderCredentialsCivitai,
  [ClapWorkflowProvider.COHERE]: builtinProviderCredentialsCohere,
  [ClapWorkflowProvider.COMFYDEPLOY]: builtinProviderCredentialsComfydeploy,
  [ClapWorkflowProvider.COMFYICU]: builtinProviderCredentialsComfyicu,
  [ClapWorkflowProvider.COMFYUI]: builtinProviderCredentialsComfyui,
  [ClapWorkflowProvider.CUSTOM]: builtinProviderCredentialsCustom,
  [ClapWorkflowProvider.ELEVENLABS]: builtinProviderCredentialsElevenlabs,
  [ClapWorkflowProvider.EVERARTAI]: builtinProviderCredentialsEverartai,
  [ClapWorkflowProvider.FALAI]: builtinProviderCredentialsFalai,
  [ClapWorkflowProvider.FIREWORKSAI]: builtinProviderCredentialsFireworksai,
  [ClapWorkflowProvider.GOOGLE]: builtinProviderCredentialsGoogle,
  [ClapWorkflowProvider.GROQ]: builtinProviderCredentialsGroq,
  [ClapWorkflowProvider.HEDRA]: builtinProviderCredentialsHedra,
  [ClapWorkflowProvider.HOTSHOT]: builtinProviderCredentialsHotshot,
  [ClapWorkflowProvider.HUGGINGFACE]: builtinProviderCredentialsHuggingface,
  [ClapWorkflowProvider.KITSAI]: builtinProviderCredentialsKitsai,
  [ClapWorkflowProvider.KUAISHOU]: builtinProviderCredentialsKuaishou,
  [ClapWorkflowProvider.LEONARDOAI]: builtinProviderCredentialsLeonardoai,
  [ClapWorkflowProvider.LETZAI]: builtinProviderCredentialsLetzai,
  [ClapWorkflowProvider.LUMALABS]: builtinProviderCredentialsLumalabs,
  [ClapWorkflowProvider.MIDJOURNEY]: builtinProviderCredentialsMidjourney,
  [ClapWorkflowProvider.MISTRALAI]: builtinProviderCredentialsMistralai,
  [ClapWorkflowProvider.MODELSLAB]: builtinProviderCredentialsModelslab,
  [ClapWorkflowProvider.OPENAI]: builtinProviderCredentialsOpenai,
  [ClapWorkflowProvider.PIAPI]: builtinProviderCredentialsPiapi,
  [ClapWorkflowProvider.REPLICATE]: builtinProviderCredentialsReplicate,
  [ClapWorkflowProvider.RUNWAYML]: builtinProviderCredentialsRunwayml,
  [ClapWorkflowProvider.STABILITYAI]: builtinProviderCredentialsStabilityai,
  [ClapWorkflowProvider.SUNO]: builtinProviderCredentialsSuno,
  [ClapWorkflowProvider.UDIO]: builtinProviderCredentialsUdio,
}
