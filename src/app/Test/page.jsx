'use client'
//
//  Libraries
//
import React, { useEffect } from 'react'
import styles from './page.module.css'
import PageHeader from '@/components/Controls/PageHeader'
//
//  Debug Settings
//
import debugSettings from '@/services/debug/debugSettings'
import consoleLogTime from '@/services/debug/consoleLogTime'
let debugLog = false
const debugModule = 'Library'
//============================================================================
export default function Test() {
  //
  //  First Time
  //
  useEffect(() => {
    clientFirstTime()
  }, [])
  //...........................................................................
  // First Time
  //...........................................................................
  function clientFirstTime() {
    //
    //  Debug Settings
    //
    debugLog = debugSettings()
    if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
  }
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <div className={styles.container}>
      Heading
      <PageHeader title='Test title' subTitle='Test subTitle' />
      footer
    </div>
  )
}
