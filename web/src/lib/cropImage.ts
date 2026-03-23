export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
    image.src = url
  })

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0
): Promise<File | null> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return null
  }

  // Set canvas size to match the bounding box
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  // translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.translate(-canvas.width / 2, -canvas.height / 2)

  // draw rotated image
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  // As a blob
  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      resolve(file ? new File([file], "cropped.jpg", { type: "image/jpeg" }) : null)
    }, 'image/jpeg')
  })
}
