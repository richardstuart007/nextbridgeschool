//
//  SET Session Storage
//
const debugLog = false
export default function sessionStorageSet(props) {
  const { caller, itemName, itemValue } = props
  //
  //  Set the item
  //
  try {
    if (debugLog) console.log(`Caller(${caller} Item(${itemName}) itemValue `, itemValue)
    const stringifyValue = JSON.stringify(itemValue)
    sessionStorage.setItem(itemName, stringifyValue)
    //
    //  Return JSON string
    //
    if (debugLog)
      console.log(`Caller(${caller} itemName(${itemName}) stringifyValue `, stringifyValue)
    return stringifyValue
  } catch (error) {
    console.log(error)
    return null
  }
}
