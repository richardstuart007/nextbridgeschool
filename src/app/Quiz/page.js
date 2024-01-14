'use client'
//
//  Libraries
//
import { useState } from 'react'
import { Box } from '@mui/material'
import { Card } from '@mui/material'
//
//  Controls
//
import MyButton from '../../components/controls/MyButton'
//
//  Sub Components
//
import QuizPanel from './QuizPanel'
import QuizHands from '../QuizHands/page'
import QuizBidding from '../QuizBidding/page'
import QuizQuestion from './QuizQuestion'
import QuizLinearProgress from './QuizLinearProgress'
//
//  Routing
//
import { useRouter } from 'next/navigation'
//
//  Debug Settings
//
import debugSettings from '../../debug/debugSettings'
import consoleLogTime from '../../debug/consoleLogTime'
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
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
  const router = useRouter()
  //
  //  Debug Settings
  //
  debugLog = debugSettings()
  //
  //  Signed in User
  //
  const User_User = JSON.parse(sessionStorage.getItem('User_User'))
  //
  //  Show Linear Bars ?
  //
  const showLinearProgress = User_User.u_showprogress
  const showLinearScore = User_User.u_showscore
  //
  //  Define the State variables
  //
  const [ansPass, setAnsPass] = useState(0)
  const [ansCount, setAnsCount] = useState(0)
  const [value, setValue] = useState(0)
  const [id, setId] = useState(0)
  const [showSubmit, setShowSubmit] = useState(false)
  const [quizRow, setQuizRow] = useState(true)
  //
  //  Reset Quiz State
  //
  const Page_Quiz_Reset = JSON.parse(sessionStorage.getItem('Page_Quiz_Reset'))
  if (Page_Quiz_Reset) handleQuizReset()
  //
  //  No data (Error)
  //
  if (g_questCount === 0) {
    return <p style={{ color: 'red' }}>No data</p>
  }
  //...................................................................................
  //.  Reset the Quiz
  //...................................................................................
  function handleQuizReset() {
    //
    //  Reset flag
    //
    sessionStorage.setItem('Page_Quiz_Reset', false)
    //
    //  Get store data & copy to State
    //
    const Page_Quiz_Q_FltJSON = sessionStorage.getItem('Page_Quiz_Q_Flt')
    const Page_Quiz_Q_Flt = JSON.parse(Page_Quiz_Q_FltJSON)
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
    sessionStorage.setItem('Page_Quiz_A', JSON.stringify(g_quizAns))
    setAnsPass(0)
    setAnsCount(0)
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
    sessionStorage.setItem('Page_Quiz_A', JSON.stringify(g_quizAns))
    const nextAnsCount = ansCount + 1
    setAnsCount(nextAnsCount)
    //
    //  End of data
    //
    if (g_Idx + 1 >= g_questCount) {
      router?.push('/QuizReview')
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
      <QuizQuestion quizRow={quizRow} quizQuestion={g_Idx + 1} quizTotal={g_questCount} QorA='Q' />
      <QuizBidding qqid={quizRow.qqid} />
      <QuizHands qqid={quizRow.qqid} />
      <Card sx={{ maxWidth: 600, marginTop: '16px' }} style={{ backgroundColor: 'LightGray' }}>
        <QuizPanel
          quizRow={quizRow}
          value={value}
          setValue={setValue}
          setId={setId}
          setShowSubmit={setShowSubmit}
        />
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
      {showLinearProgress ? (
        <QuizLinearProgress count={ansCount} total={g_questCount} text={'Progress'} />
      ) : null}
      {/* .......................................................................................... */}
      {showLinearScore ? (
        <QuizLinearProgress count={ansPass} total={ansCount} text={'Score'}></QuizLinearProgress>
      ) : null}
      {/* .......................................................................................... */}
      <Box sx={{ mt: 2, maxWidth: 600 }}>
        <MyButton
          type='submit'
          text='Back'
          color='warning'
          variant='contained'
          onClick={() => router?.push('/Library')}
        />
        {/* .......................................................................................... */}
        {g_Idx > 0 ? (
          <MyButton
            type='submit'
            text='End/Review'
            color='warning'
            variant='contained'
            sx={{ float: 'right' }}
            onClick={() => router?.push('/QuizReview')}
          />
        ) : null}
      </Box>
      {/* .......................................................................................... */}
    </>
  )
}
