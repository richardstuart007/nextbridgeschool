'use client'
//
//  Libraries
//
import React, { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import { Card } from '@mui/material'
//
//  Controls
//
import MyButton from '@/components/Controls/MyButton'
//
//  Sub Components
//
import QuizChoice from './QuizChoice'
import QuizHands from '@/components/Quiz/QuizHands/QuizHands'
import QuizBidding from '@/components/Quiz/QuizBidding/QuizBidding'
import QuizQuestion from '@/components/Quiz/QuizQuestion'
import QuizLinearProgress from '@/components/Quiz/QuizLinearProgress'
//
//  Services
//
import writeUsersHistory from '@/services/dbApi/writeUsersHistory'
import sessionStorageGet from '@/services/sessionStorage/sessionStorageGet'
import sessionStorageSet from '@/services/sessionStorage/sessionStorageSet'
//
//  Routing
//
import { useRouter } from 'next/navigation'
//
//  Debug Settings
//
import debugSettings from '@/services/debug/debugSettings'
import consoleLogTime from '@/services/debug/consoleLogTime'
let debugLog
const debugModule = 'Quiz'
//.............................................................................
//.  Initialisation
//.............................................................................
//
//  Global store variables
//
let g_Idx = 0
let g_quizQuest = []
let g_questCount = 0
let g_quizRow = {}
let g_quizAns = []
//...................................................................................
//.  Main Line
//...................................................................................
export default function Quiz() {
  const router = useRouter()
  //
  //  Define the State variables
  //
  const [ansPass, setAnsPass] = useState(0)
  const [ansCount, setAnsCount] = useState(0)
  const [value, setValue] = useState(0)
  const [id, setId] = useState(0)
  const [showSubmit, setShowSubmit] = useState(false)
  const [quizRow, setQuizRow] = useState(true)
  const [showLinearProgress, setshowLinearProgress] = useState(true)
  const [showLinearScore, setshowLinearScore] = useState(true)
  const [isData, setisData] = useState(false)
  //
  //  First Time
  //
  useEffect(() => {
    clientFirstTime()
  }, [])
  //
  //  Every Time
  //
  useEffect(() => {
    clientLoad()
  })
  //...........................................................................
  // First Time
  //...........................................................................
  function clientFirstTime() {
    //
    //  Debug Settings
    //
    debugLog = debugSettings()
    if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
    //
    //  Signed in User
    //
    const User_User = sessionStorageGet({
      caller: debugModule,
      itemName: 'User_User',
    })
    setshowLinearProgress(User_User.u_showprogress)
    setshowLinearScore(User_User.u_showscore)
    //
    //  Reset Quiz State
    //
    const Page_Quiz_Reset = sessionStorageGet({
      caller: debugModule,
      itemName: 'User_Page_Quiz_ResetUser',
    })
    if (Page_Quiz_Reset) handleQuizReset()
    //
    //  No data (Error)
    //
    if (g_questCount === 0) {
      return <p style={{ color: 'red' }}>No data</p>
    }
  }
  //...........................................................................
  // Client Code
  //...........................................................................
  function clientLoad() {
    try {
      if (debugLog) console.log(consoleLogTime(debugModule, 'quizRow'), quizRow)
    } catch (e) {
      if (debugLog) console.log(consoleLogTime(debugModule, 'Catch'))
      console.log(e)
    }
  }
  //...................................................................................
  //.  Reset the Quiz
  //...................................................................................
  function handleQuizReset() {
    //
    //  Reset flag
    //
    sessionStorageSet({
      caller: debugModule,
      itemName: 'Page_Quiz_Reset',
      itemValue: false,
    })
    //
    //  Get store data & copy to State
    //
    const Page_Quiz_Q_Flt = sessionStorageGet({
      caller: debugModule,
      itemName: 'Page_Quiz_Q_Flt',
    })
    let quest = []
    Page_Quiz_Q_Flt.forEach(row => {
      const rowData = { ...row }
      quest.push(rowData)
    })
    //
    // Update Questions from Store
    //
    g_quizQuest = quest
    g_questCount = quest.length
    g_Idx = 0
    g_quizRow = g_quizQuest[g_Idx]
    setQuizRow(g_quizRow)
    //
    // Reset Answers
    //
    g_quizAns = []
    sessionStorageSet({
      caller: debugModule,
      itemName: 'Page_Quiz_A',
      itemValue: g_quizAns,
    })
    setAnsPass(0)
    setAnsCount(0)
    setisData(true)
  }
  //...................................................................................
  //.  Form Submit
  //...................................................................................
  function handleSubmit() {
    //
    //  No selection
    //
    if (!id) {
      return
    }
    //
    //  Update count
    //
    if (id === 1) {
      const nextAnsPass = ansPass + 1
      setAnsPass(nextAnsPass)
    }
    //
    //   Write Answers
    //
    g_quizAns[g_Idx] = id
    sessionStorageSet({
      caller: debugModule,
      itemName: 'Page_Quiz_A',
      itemValue: g_quizAns,
    })
    const nextAnsCount = ansCount + 1
    setAnsCount(nextAnsCount)
    //
    //  End of data
    //
    if (g_Idx + 1 >= g_questCount) {
      writeUsersHistory()
      router.push('/QuizReview')
    }
    //
    //  Next row
    //
    g_Idx++
    g_quizRow = g_quizQuest[g_Idx]
    setQuizRow(g_quizRow)
  }
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      {isData ? (
        <QuizQuestion
          quizRow={quizRow}
          quizQuestion={g_Idx + 1}
          quizTotal={g_questCount}
          QorA='Q'
        />
      ) : null}

      {isData ? <QuizBidding qqid={quizRow.qqid} /> : null}
      {isData ? <QuizHands qqid={quizRow.qqid} /> : null}

      <Card sx={{ maxWidth: 600, marginTop: '16px' }} style={{ backgroundColor: 'LightGray' }}>
        {isData ? (
          <QuizChoice
            quizRow={quizRow}
            value={value}
            setValue={setValue}
            setId={setId}
            setShowSubmit={setShowSubmit}
          />
        ) : null}
        {/* .......................................................................................... */}
        <Box>
          {showSubmit ? (
            <MyButton
              text='Submit Answer'
              onClick={() => {
                handleSubmit()
              }}
            />
          ) : null}
        </Box>
      </Card>

      {/* .......................................................................................... */}
      {isData && showLinearProgress ? (
        <QuizLinearProgress count={ansCount} total={g_questCount} text={'Progress'} />
      ) : null}
      {/* .......................................................................................... */}
      {isData && showLinearScore ? (
        <QuizLinearProgress count={ansPass} total={ansCount} text={'Score'}></QuizLinearProgress>
      ) : null}
      {/* .......................................................................................... */}
      <Box sx={{ mt: 2, maxWidth: 600 }}>
        <MyButton
          text='Back'
          color='warning'
          variant='contained'
          onClick={() => {
            writeUsersHistory()
            router.back()
          }}
        />
        {/* .......................................................................................... */}
        {g_Idx > 0 ? (
          <MyButton
            text='End/Review'
            color='warning'
            variant='contained'
            sx={{ float: 'right' }}
            onClick={() => {
              writeUsersHistory()
              router.push('/QuizReview')
            }}
          />
        ) : null}
      </Box>
      {/* .......................................................................................... */}
    </>
  )
}
