'use client'
//
//  Libraries
//
import React, { useState, useEffect } from 'react'
import { Typography, Box } from '@mui/material'
//
//  Controls
//
import MyButton from '@/components/Controls/MyButton'
//
//  Sub Components
//
import QuizReviewAnswers from '@/components/Quiz/QuizReviewAnswers/QuizReviewAnswers'
import QuizHands from '@/components/Quiz/QuizHands/QuizHands'
import QuizBidding from '@/components/Quiz/QuizBidding/QuizBidding'
import QuizQuestion from '@/components/Quiz/QuizQuestion'
//
//  Routing
//
import { useRouter } from 'next/navigation'
//
//  services
//
import sessionStorageGet from '@/services/sessionStorage/sessionStorageGet'
import sessionStorageSet from '@/services/sessionStorage/sessionStorageSet'
//
//  Debug Settings
//
import debugSettings from '@/services/debug/debugSettings'
import consoleLogTime from '@/services/debug/consoleLogTime'
let debugLog = false
const debugModule = 'QuizReview'
//
//  Globals
//
let g_ArrQuestions = []
let g_ArrAns = []
let g_ArrAnsNum = []
let g_CountPass = 0
let g_CountAns = 0
let g_ArrAnsQuestIdx = -1
let g_CountReview = 0
//...................................................................................
//.  Main Line
//...................................................................................
export default function QuizReview() {
  const router = useRouter()
  //
  //  Counts
  //
  const [countPass, setCountPass] = useState(0)
  const [countAns, setCountAns] = useState(0)
  const [countReview, setCountReview] = useState(0)
  const [quizRow, setQuizRow] = useState(null)
  const [noData, setnoData] = useState(true)
  const [reviewMessage, setreviewMessage] = useState('')
  const [hidePreviousButton, sethidePreviousButton] = useState(true)
  const [hideNextButton, sethideNextButton] = useState(false)
  //
  //  Arrays & Index
  //
  const [arrQuest, setArrQuest] = useState([])
  const [arrAns, setArrAns] = useState([])
  const [arrAnsNum, setArrAnsNum] = useState([])
  const [ansIdx, setAnsIdx] = useState(0)
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
    clientEveryTime()
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
    //  Load the data array from the store
    //
    firstLoad()
    //
    //  Mark%
    //
    let mark = 0
    if (g_CountAns > 0) mark = Math.round((100 * g_CountPass) / g_CountAns)
    //
    //  No Questions to review
    //
    if (debugLog) console.log(consoleLogTime(debugModule, 'g_CountReview'), g_CountReview)
    if (g_CountReview === 0) {
      g_CountAns === 0
        ? setreviewMessage('No questions answered, nothing to review')
        : setreviewMessage(`Result (${mark}%) ${g_CountPass} out of ${g_CountAns}.  WELL DONE!!`)
    } else {
      //
      //  Quiz Message
      //
      setnoData(false)
      setreviewMessage(`Result (${mark}%) ${g_CountPass} out of ${g_CountAns}.`)
    }
  }
  //...........................................................................
  // Client Code
  //...........................................................................
  function clientEveryTime() {
    try {
      //
      //  Hide/Show Previous/Next Buttons
      //
      ansIdx + 1 === 1 ? sethidePreviousButton(true) : sethidePreviousButton(false)
      ansIdx + 1 === countReview ? sethideNextButton(true) : sethideNextButton(false)
    } catch (e) {
      if (debugLog) console.log(consoleLogTime(debugModule, 'Catch'))
      console.log(e)
    }
  }
  //...................................................................................
  //.  First time data received
  //...................................................................................
  const firstLoad = () => {
    //
    //  Get Store Values
    //
    //
    //  Signed in User
    //
    const User_User = sessionStorageGet({
      caller: debugModule,
      itemName: 'User_User',
    })
    const Page_Quiz_Q_Flt = sessionStorageGet({
      caller: debugModule,
      itemName: 'Page_Quiz_Q_Flt',
    })
    const Page_Quiz_A = sessionStorageGet({
      caller: debugModule,
      itemName: 'Page_Quiz_A',
    })
    //
    //  Questions
    //
    g_ArrQuestions = []
    Page_Quiz_Q_Flt.forEach(row => {
      const rowData = { ...row }
      g_ArrQuestions.push(rowData)
    })
    setArrQuest(g_ArrQuestions)

    g_ArrAns = []
    g_ArrAnsNum = []
    g_CountPass = 0
    g_CountAns = 0
    g_ArrAnsQuestIdx = -1
    g_CountReview = 0
    Page_Quiz_A.forEach(id => {
      g_CountAns++
      g_ArrAnsQuestIdx++
      //
      //  Only show failed answers ?
      //
      const ReviewSkipPass = User_User.u_skipcorrect
      if (id !== 1 || !ReviewSkipPass) {
        g_ArrAns.push(id)
        g_ArrAnsNum.push(g_ArrAnsQuestIdx)
        g_CountReview++
      }
      if (id === 1) g_CountPass++
    })
    //
    //  Set State
    //
    if (debugLog) console.log(consoleLogTime(debugModule, 'g_CountReview'), g_CountReview)
    if (debugLog) console.log(consoleLogTime(debugModule, 'g_CountAns'), g_CountAns)
    if (debugLog) console.log(consoleLogTime(debugModule, 'g_CountPass'), g_CountPass)
    setCountReview(g_CountReview)
    setCountAns(g_CountAns)
    setCountPass(g_CountPass)
    setArrAns(g_ArrAns)
    setArrAnsNum(g_ArrAnsNum)

    //
    //  Nothing to review
    //
    if (g_CountReview === 0) return
    //
    // Start at Answer Row 0
    //
    const AnsIdx = 0
    setAnsIdx(AnsIdx)
    const QuizIdx = g_ArrAnsNum[AnsIdx]
    setQuizRow(g_ArrQuestions[QuizIdx])
  }
  //...................................................................................
  //.  Next Question
  //...................................................................................
  const nextQuestion = () => {
    //
    //  More rows
    //
    const AnsIdx = ansIdx + 1
    if (AnsIdx < countReview) {
      const QuizIdx = arrAnsNum[AnsIdx]
      setAnsIdx(AnsIdx)
      setQuizRow(arrQuest[QuizIdx])
    }
  }
  //...................................................................................
  //.  Previous Question
  //...................................................................................
  const handlePrevious = () => {
    //
    //  More rows
    //
    if (ansIdx > 0) {
      const AnsIdx = ansIdx - 1
      const QuizIdx = arrAnsNum[AnsIdx]
      setAnsIdx(AnsIdx)
      setQuizRow(arrQuest[QuizIdx])
    }
  }

  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      <Box sx={{ mt: 2, maxWidth: 600 }}>
        <Typography variant='subtitle1' sx={{ marginTop: '8px' }}>
          {reviewMessage}
        </Typography>
      </Box>

      {noData ? null : (
        <QuizQuestion
          quizRow={quizRow}
          quizQuestion={arrAnsNum[ansIdx] + 1}
          quizTotal={countAns}
          QorA='A'
        />
      )}
      {noData ? null : <QuizBidding qqid={quizRow.qqid} />}
      {noData ? null : <QuizHands qqid={quizRow.qqid} />}
      {noData ? null : <QuizReviewAnswers quizRow={quizRow} AnswerNum={arrAns[ansIdx]} />}

      {/* .......................................................................................... */}
      <Box sx={{ mt: 2, maxWidth: 600 }}>
        {/*.................................................................................................*/}
        {noData || hideNextButton ? null : (
          <MyButton
            text='Next'
            color='primary'
            variant='contained'
            onClick={() => nextQuestion()}
          />
        )}
        {/* .......................................................................................... */}
        {noData || hidePreviousButton ? null : (
          <MyButton
            text='Previous'
            color='primary'
            variant='contained'
            onClick={() => handlePrevious()}
          />
        )}
        {/* .......................................................................................... */}
        <MyButton
          text='ReStart'
          color='warning'
          variant='contained'
          sx={{ float: 'right' }}
          onClick={() => {
            sessionStorageSet({
              caller: debugModule,
              itemName: 'Page_Quiz_Reset',
              itemValue: true,
            })
            router.back()
          }}
        />
        {/*.................................................................................................*/}
      </Box>
    </>
  )
}
