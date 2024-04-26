
export const aitubeUrl = `${process.env.AI_TUBE_URL || "https://aitube.at" }`
export const aitubeApiUrl = aitubeUrl + (aitubeUrl.endsWith("/") ? "" : "/") + "api/"
