export async function fetchContentToBase64(url: string) {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
    // we can also use this (see https://vercel.com/blog/vercel-cache-api-nextjs-cache)
    // next: { revalidate: 1 }
  })
  const blob = await res.blob()
  const buffer = Buffer.from(await blob.arrayBuffer())

  return 'data:' + blob.type + ';base64,' + buffer.toString('base64')
}
