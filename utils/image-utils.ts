export function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function pasteImageFromClipboard(event: ClipboardEvent): Promise<string | null> {
  return new Promise((resolve) => {
    const items = event.clipboardData?.items
    if (!items) {
      resolve(null)
      return
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile()
        if (file) {
          convertImageToBase64(file).then(resolve).catch(() => resolve(null))
          return
        }
      }
    }
    resolve(null)
  })
}

export function isValidImageUrl(url: string): boolean {
  try {
    new URL(url)
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url)
  } catch {
    return false
  }
}

export function extractImagesFromHtml(html: string): string[] {
  const imgRegex = /<img[^>]+src="([^">]+)"/g
  const images: string[] = []
  let match

  while ((match = imgRegex.exec(html)) !== null) {
    images.push(match[1])
  }

  return images
}
