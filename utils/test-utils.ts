/**
 * Creates a File from a Blob.  Used for hack fix as PhantomJS does not have the File constructor
 * because PhantomJS is a bloated pain.
 * @param theBlob
 * @param fileName
 */
export const blobToFile = (blob: Blob, fileName: string): File => {
  const file: any = blob
  // A Blob() is almost a File() - it's just missing the two properties below which we will add
  file.lastModifiedDate = new Date()
  file.name = fileName

  // Cast to a File type
  return file as File
}

export const makeFile = (content, fileName: string) => blobToFile(new Blob([content]), fileName)
