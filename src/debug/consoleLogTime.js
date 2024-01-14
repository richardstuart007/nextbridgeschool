const storeName = 'App_consoleLogTime'
//...................................................................................
//.  Try/Catch/Finally logging
//...................................................................................
export default function consoleLogTime(debugModule, message = '') {
  try {
    //
    //  Define Object
    //
    let storeObj = {
      prevModule: null,
      prevCounter: null,
      prevTime: null
    }
    //
    //  Default current values if no previous
    //
    let timeCurrent = new Date().getTime()
    let prevCounter = 0
    let prevTime = timeCurrent
    let prevModule = ''
    //
    //  Retrieve Previous
    //
    const storeObj_Prev = sessionStorage.getItem(storeName)
    if (storeObj_Prev) {
      storeObj = JSON.parse(storeObj_Prev)
      prevModule = storeObj.prevModule
      prevCounter = storeObj.prevCounter
      prevTime = storeObj.prevTime
    }
    //
    //  End log group
    //
    if (prevModule !== debugModule && prevModule !== '') console.groupEnd()
    //
    //  Start log group
    //
    if (prevModule !== debugModule) console.group(debugModule)
    //
    //  Calculate duration (current - previous)
    //
    const duration = timeCurrent - prevTime
    const durationString = ('   ' + duration).slice(-4)
    //
    //  Update stored values
    //
    storeObj.prevModule = debugModule
    prevCounter++
    storeObj.prevCounter = prevCounter
    storeObj.prevTime = timeCurrent
    sessionStorage.setItem(storeName, JSON.stringify(storeObj))
    //
    //  Build return string
    //
    let messageString = message
    if (message.length < 12) messageString = ('            ' + message).slice(-12)
    const consoleLogTimemessage = `${prevCounter} ${durationString} ${messageString}`
    return consoleLogTimemessage
  } catch (error) {
    console.log(error)
  }
}
