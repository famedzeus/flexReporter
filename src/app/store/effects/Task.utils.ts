
/**
 * Dirty method to convert context Models string to an array of descriptive objects
 */
export const modelContextStringToArray = (contexts: string) => {
  try {
    const withoutBracks = contexts.substr(1, contexts.length - 2)

    if (withoutBracks.length === 0) {
      return []
    }

    const split = withoutBracks.split(', ')

    return split
      .map(contextStr => {
        const [entityName, params] = contextStr.split(' [')
        const primaryKeyString = params.substr(0, params.length - 1)
        const primaryKeys = primaryKeyString.split('/')
        return {
          entityName,
          primaryKeyString,
          primaryKeys
        }
      })
  } catch (e) {
    // console.error(`Error parsing Task model contexts: ${contexts}`)
    return []
  }
}
