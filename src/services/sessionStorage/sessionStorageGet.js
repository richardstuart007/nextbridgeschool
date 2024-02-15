const debugLog = false
//
//  Get Session Storage
//
export default function sessionStorageGet(props) {
  //
  //  Deconstruct props
  //
  const { caller, itemName } = props
  try {
    if (debugLog) console.log(`Caller(${caller}) itemName(${itemName})`)
    //
    //  Get the item
    //
    if (debugLog) console.log(`itemName`, itemName)
    const json = sessionStorage.getItem(itemName)
    if (debugLog) console.log(`Caller(${caller}) itemName(${itemName})`, json)
    //
    //  Does not exist - return null
    //
    if (!json) {
      if (debugLog) console.log(`Caller(${caller}) itemName(${itemName}) not found`)
      return null
    }
    //
    //  Parse Value
    //
    const parseValue = JSON.parse(json)
    if (debugLog) console.log(`Caller(${caller}) itemName(${itemName}) parseValue `, parseValue)
    //
    //  Return value
    //
    return parseValue
  } catch (error) {
    console.log(error)
    return null
  }
}
