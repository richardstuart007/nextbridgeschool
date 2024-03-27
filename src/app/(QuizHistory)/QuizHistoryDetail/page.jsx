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
import QuizReviewAnswers from '@/components/Quiz/QuizReviewAnswers/QuizReviewAnswers'
import QuizHands from '@/components/Quiz/QuizHands/QuizHands'
import QuizBidding from '@/components/Quiz/QuizBidding/QuizBidding'
import QuizQuestion from '@/components/Quiz/QuizQuestion'
import sessionStorageGet from '@/services/sessionStorage/sessionStorageGet'
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
const debugModule = 'QuizHistoryDetail'

let User_User = null
let g_AnsIdx = 0
//...................................................................................
//.  Main Line
//...................................................................................
export default function QuizHistoryDetail() {
  const router = useRouter()
  //
  //  Counts
  //
  const [countPass, setCountPass] = useState(0)
  const [countAns, setCountAns] = useState(0)
  const [countReview, setCountReview] = useState(0)
  const [mark, setMark] = useState(0)
  const [quizRow, setQuizRow] = useState(null)
  //
  //  Arrays & Index
  //
  const [arrQuest, setArrQuest] = useState([])
  const [arrAns, setArrAns] = useState([])
  const [arrAnsNum, setArrAnsNum] = useState([])
  const [ansIdx, setAnsIdx] = useState(0)
  //
  //  Buttons
  //
  const [hideNextButton, sethideNextButton] = useState(true)
  const [hidePreviousButton, sethidePreviousButton] = useState(true)
  //
  //  First Time
  //
  useEffect(() => {
    clientFirstTime()
    // eslint-disable-next-line
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
    if (debugLog) console.log(consoleLogTime(debugModule, 'clientFirstTime'))
    //
    //  Signed in User
    //
    User_User = sessionStorageGet({ caller: debugModule, itemName: 'User_User' })
    //
    //  Get Row Values
    //
    const row = sessionStorageGet({ caller: debugModule, itemName: 'Page_Qd_Row' })
    updateSelection(row)
    //
    //  No data to review
    //
    if (!quizRow) {
      if (countAns === 0) {
        return (
          <>
            <Typography variant='subtitle1' sx={{ marginTop: '8px' }}>
              Waiting for data
            </Typography>
          </>
        )
      } else {
        return (
          <>
            <Typography variant='subtitle1' sx={{ marginTop: '8px' }}>
              Result ({mark}%) {countPass} out of {countAns}. WELL DONE !!
            </Typography>
          </>
        )
      }
    }
  }
  //...........................................................................
  // Client Code
  //...........................................................................
  function clientEveryTime() {
    if (debugLog) console.log(consoleLogTime(debugModule, 'clientEveryTime'))
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
  //.  Update Selection
  //...................................................................................
  function updateSelection(row) {
    //
    //  Get Stored Data
    //
    const Page_Quiz_Q_Flt = sessionStorageGet({ caller: debugModule, itemName: 'Page_Quiz_Q_Flt' })
    const Hist_r_ans = row.r_ans
    //
    //  Questions
    //
    let ArrQuestions = []
    Page_Quiz_Q_Flt.forEach(row => {
      const rowData = { ...row }
      ArrQuestions.push(rowData)
    })
    setArrQuest(ArrQuestions)
    //
    //  Answers
    //
    let Ans = []
    let AnsNum = []
    let AnsPass = 0
    let AnsCount = 0
    let AnsQuestIdx = -1
    let AnsReview = 0

    Hist_r_ans.forEach(id => {
      AnsCount++
      AnsQuestIdx++
      //
      //  Only show failed answers ?
      //
      let ReviewSkipPass = User_User.u_skipcorrect
      //
      //  BUGS!
      //
      ReviewSkipPass = false
      if (id !== 1 || !ReviewSkipPass) {
        Ans.push(id)
        AnsNum.push(AnsQuestIdx)
        AnsReview++
      }
      if (id === 1) AnsPass++
    })
    //
    //  Set State
    //
    setCountReview(AnsReview)
    setCountAns(AnsCount)
    setCountPass(AnsPass)
    setArrAns(Ans)
    setArrAnsNum(AnsNum)
    //
    //  Mark%
    //
    if (AnsCount > 0) setMark(Math.round((100 * AnsPass) / AnsCount))
    //
    //  Nothing to review
    //
    if (AnsReview === 0) return
    //
    // Start at Answer Row 0
    //
    g_AnsIdx = 0
    setAnsIdx(g_AnsIdx)
    const QuizIdx = AnsNum[g_AnsIdx]
    setQuizRow(ArrQuestions[QuizIdx])
  }
  //...................................................................................
  //.  Next Question
  //...................................................................................
  function nextQuestion() {
    //
    //  More rows
    //
    g_AnsIdx = ansIdx + 1
    if (g_AnsIdx < countReview) {
      const QuizIdx = arrAnsNum[g_AnsIdx]
      setAnsIdx(g_AnsIdx)
      setQuizRow(arrQuest[QuizIdx])
    }
  }
  //...................................................................................
  //.  Previous Question
  //...................................................................................
  function handlePrevious() {
    //
    //  More rows
    //
    if (ansIdx > 0) {
      g_AnsIdx = ansIdx - 1
      const QuizIdx = arrAnsNum[g_AnsIdx]
      setAnsIdx(g_AnsIdx)
      setQuizRow(arrQuest[QuizIdx])
    }
  }
  //...................................................................................
  //.  Render the form
  //...................................................................................
  if (quizRow === null) return null
  return (
    <>
      <QuizQuestion
        quizRow={quizRow}
        quizQuestion={arrAnsNum[ansIdx] + 1}
        quizTotal={countAns}
        QorA='A'
      />
      <Typography variant='subtitle2'>
        Result ({mark}%) {countPass} out of {countAns}
      </Typography>
      <QuizBidding qqid={quizRow.qqid} />
      <QuizHands qqid={quizRow.qqid} />
      <QuizReviewAnswers quizRow={quizRow} AnswerNum={arrAns[ansIdx]} />

      <Box sx={{ mt: 2, maxWidth: 600 }}>
        {hideNextButton ? null : (
          <MyButton
            text='Next'
            color='primary'
            variant='contained'
            onClick={() => nextQuestion()}
          />
        )}
        {/* .......................................................................................... */}
        {hidePreviousButton ? null : (
          <MyButton
            text='Previous'
            color='primary'
            variant='contained'
            onClick={() => handlePrevious()}
          />
        )}
        {/* .......................................................................................... */}
        <MyButton
          text='Back'
          color='warning'
          variant='contained'
          sx={{ float: 'right' }}
          onClick={() => {
            router.push('/QuizHistory')
          }}
        />
        {/* .......................................................................................... */}
      </Box>
    </>
  )
}
