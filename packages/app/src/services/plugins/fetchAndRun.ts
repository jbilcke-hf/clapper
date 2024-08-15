/**
 * Fetch and execute arbitrary code
 *
 * Needless to say, this isn't safe (a plugin could steal credentials)
 * some evil people might lure users into installing evil plugins
 *
 * we are probably going to want to have some kind of validation process,
 * to "certifiate" plugins, although this could be difficult to do if they are minified and/or obfuscated
 * @param jsCodeUrl
 * @returns
 */
export async function fetchAndRun(jsCodeUrl: string) {
  const res = await fetch(jsCodeUrl)

  if (!res.ok) {
    return
  }
  const payload = await res.blob()
  const objectURL = URL.createObjectURL(payload)
  const sc = document.createElement('script')
  sc.setAttribute('src', objectURL)
  sc.setAttribute('type', 'text/javascript')
  document.head.appendChild(sc)
}
