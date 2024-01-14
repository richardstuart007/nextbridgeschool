//
//  Libraries
//
import { Typography } from '@mui/material'
import { teal } from 'material-ui-colors'
//
//  Components
//
import MyButton from '../../components/controls/MyButton'
//===================================================================================
export default function QuizQuestion(params) {
  //...................................................................................
  //.  Main Line
  //...................................................................................
  //
  //  Deconstruct params
  //
  const { quizRow, quizQuestion, quizTotal = 0, QorA = 'Q' } = params
  //
  //  Deconstruct row
  //
  const { qowner, qgroup, qqid, qdetail } = quizRow
  let hyperLink
  qdetail.substring(0, 8) === 'https://' ? (hyperLink = true) : (hyperLink = false)
  //
  //  Hyperlink Question
  //
  let buttonLink
  let buttonText
  if (hyperLink) {
    buttonLink = qdetail
    buttonText = 'Click to view the Question'
    //
    //  Hyperlink get Answer from Library
    //
    if (QorA === 'A') {
      const Page_Lib_Data_JSON = sessionStorage.getItem('Page_Lib_Data')
      const Page_Lib_Data = JSON.parse(Page_Lib_Data_JSON)
      const libRow = Page_Lib_Data.find(e => (e.lrowner === qowner) & (e.lrgroup === qgroup))
      buttonLink = libRow.lrlink
      buttonText = 'Click to view the Answer'
    }
  }
  //
  //  Hyperlink open
  //
  const openTab = hyperlink => () => {
    window.open(hyperlink, '_blank')
  }
  //
  //  Question Info
  //
  let QuestionInfo = `${qowner}/${qgroup} ${quizQuestion}/${quizTotal} (${qqid})`
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      {/* .......................................................................................... */}
      {/* Question number and ID */}
      {/* .......................................................................................... */}
      <Typography variant='subtitle2' style={{ color: teal['A700'] }} sx={{ marginTop: '8px' }}>
        {QuestionInfo}
      </Typography>
      {/* .......................................................................................... */}
      {/* Hyperlink Button */}
      {/* .......................................................................................... */}
      {hyperLink && (
        <MyButton
          onClick={openTab(buttonLink)}
          type='submit'
          style={{ color: 'white' }}
          size='small'
          text={buttonText}
        ></MyButton>
      )}
      {/* .......................................................................................... */}
    </>
  )
}
