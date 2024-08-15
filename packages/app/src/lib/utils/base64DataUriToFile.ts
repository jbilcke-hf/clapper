export function base64DataUriToFile(dataUrl: string, fileName: string) {
  var arr = `${dataUrl || ''}`.split(',')
  const st = `${arr[0] || ''}`
  const mime = `${st.match(/:(.*?);/)?.[1] || ''}`
  const bstr = atob(arr[arr.length - 1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], fileName, { type: mime })
}
