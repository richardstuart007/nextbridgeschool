import TableCell from '@mui/material/TableCell'
//
//  Libraries
//
import { Typography, Grid } from '@mui/material'
//...................................................................................
//.  Main Line
//...................................................................................
const QuizHandsTableLineCell = props => {
  //
  //  Destructure props
  //
  const { cell, cellValue } = props
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      {/* .......................................................................................... */}
      {/*  Suit                                                                               */}
      {/* .......................................................................................... */}
      <TableCell key={cell} sx={{ padding: '0px' }}>
        <Grid container direction='row' justifyContent='flex-start' alignItems='center'>
          <Grid item>
            <Typography variant='body2'>{cellValue}</Typography>
          </Grid>

          {/* .......................................................................................... */}
        </Grid>
      </TableCell>
      {/* .......................................................................................... */}
    </>
  )
}

export default QuizHandsTableLineCell
