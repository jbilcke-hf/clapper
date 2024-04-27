
// unfortunately, this doesn't work yet due to a redirection issue
// const defaultAitubeHostname = "aitube.at"

// so we have to use the direct space hostname instead
export const defaultAitubeHostname = "jbilcke-hf-ai-tube.hf.space"

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
