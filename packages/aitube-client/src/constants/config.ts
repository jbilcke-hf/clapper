import { defaultAitubeHostname } from "./defaultValues"

// we leave the opportunity to override this at runtime
export const aitubeUrl = `${
  process.env.AITUBE_HOSTNAME ||
  `https://${defaultAitubeHostname}`
}`

// note: let's keep it simple and only support one version at a time
export const aitubeApiVersion = "v1"

export const aitubeApiUrl = `${
  aitubeUrl
}${
  aitubeUrl.endsWith("/") ? "" : "/"
}api/${aitubeApiVersion}/`
