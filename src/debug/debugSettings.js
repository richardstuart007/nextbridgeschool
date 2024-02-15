'use client'
//
//  Default values & Environment values combined
//
let DEBUG_LOG_OVERRIDE = false
let DEBUG_LOG = false
let g_firstTime = true
export default function debugSettings(debug = false) {
  //
  //  Environment Variables
  //
  if (g_firstTime) {
    g_firstTime = false
    if (process.env.NEXT_PUBLIC_DEBUG_LOG_OVERRIDE) {
      process.env.NEXT_PUBLIC_DEBUG_LOG_OVERRIDE === 'true'
        ? (DEBUG_LOG_OVERRIDE = true)
        : (DEBUG_LOG_OVERRIDE = false)
    }
    if (process.env.NEXT_PUBLIC_DEBUG_LOG) {
      process.env.NEXT_PUBLIC_DEBUG_LOG === 'true' ? (DEBUG_LOG = true) : (DEBUG_LOG = false)
    }
    console.log('DEBUG_LOG_OVERRIDE ', DEBUG_LOG_OVERRIDE)
    console.log('DEBUG_LOG ', DEBUG_LOG)
  }
  //
  //  Override set at environment level ?
  //
  if (DEBUG_LOG_OVERRIDE) return DEBUG_LOG
  //
  // No Override - return incomming parameter
  //
  return debug
}
