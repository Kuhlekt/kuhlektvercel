export const convertImageToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export const isImageFile = (file: File): boolean => {
  return file.type.startsWith("image/")
}

export const generateImagePlaceholder = (fileName: string, size: number): string => {
  // Create a placeholder URL for the pasted image
  const timestamp = Date.now()
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_")
  return `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(`Pasted Image: ${cleanFileName}`)}&id=${timestamp}`
}

export const processClipboardItems = async (clipboardItems: DataTransferItemList): Promise<File[]> => {
  const files: File[] = []

  for (let i = 0; i < clipboardItems.length; i++) {
    const item = clipboardItems[i]

    if (item.type.startsWith("image/")) {
      const file = item.getAsFile()
      if (file) {
        files.push(file)
      }
    }
  }

  return files
}
