export default function debugSettings(debug = false) {
  //
  //  Default values
  //
  let DEBUG_LOG_OVERRIDE = true
  let DEBUG_LOG = true
  //
  //  Application Environment Variables
  //
  const jsonApp_Env = sessionStorage.getItem('App_Env')
  if (jsonApp_Env) {
    const App_Env = JSON.parse(jsonApp_Env)
    DEBUG_LOG_OVERRIDE = App_Env.DEBUG_LOG_OVERRIDE
    DEBUG_LOG = App_Env.DEBUG_LOG
  }
  if (DEBUG_LOG_OVERRIDE) return DEBUG_LOG
  //
  // No Override - return incomming parameter (or default of false)
  //
  return debug
}
