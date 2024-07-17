export const blobToBase64DataUri = async (blob: Blob): Promise<string> =>  
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (event) => {
      const dataUrl = (event.target?.result || "") as string
      if (!dataUrl) { throw new Error(`invalid blob`) }
      resolve(dataUrl)
    };
      
    reader.readAsDataURL(blob)
  })
