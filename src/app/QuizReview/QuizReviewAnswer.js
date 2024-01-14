//
//  Libraries
//
import { Card, CardContent, CardActionArea, Typography, Grid } from '@mui/material'
import { green, red } from 'material-ui-colors'
//===================================================================================
export default function QuizAnswer(props) {
  //
  // Deconstruct Props
  //
  const { answer, points, AnswerNum, FieldNum } = props
  //
  //  Set Colour
  //
  //  .... Default white
  let backgroundColor = 'white'
  //  .... Correct Answer
  if (FieldNum === 1) backgroundColor = green.A100
  //  .... Bad Answer
  else if (AnswerNum === FieldNum) backgroundColor = red.A100
  //
  //  Display non-zero points
  //
  let showPoints
  points === 0 ? (showPoints = false) : (showPoints = true)
  //.............................................................................
  return (
    <>
      <Grid container sx={{ mt: 2, mb: 2, maxWidth: 600 }} alignItems='center'>
        <Grid item xs={11}>
          <Card elevation={1} style={{ backgroundColor: backgroundColor }}>
            <CardActionArea>
              <CardContent sx={{ padding: '4px' }}>
                <Typography variant='body2' color='textSecondary'>
                  {answer}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={1}>
          {showPoints ? (
            <Typography variant='body2' color='Green' align='center'>
              {points}
            </Typography>
          ) : null}
        </Grid>
      </Grid>
    </>
  )
}
