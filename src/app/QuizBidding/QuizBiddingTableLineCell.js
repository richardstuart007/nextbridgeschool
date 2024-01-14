import TableCell from '@mui/material/TableCell'
//
//  Libraries
//
import { Avatar, Typography, Grid } from '@mui/material'
//
//  Sub Components
//
import spade from '../../assets/images/spade.svg'
import heart from '../../assets/images/heart.svg'
import diamond from '../../assets/images/diamond.svg'
import club from '../../assets/images/club.svg'
//...................................................................................
//.  Main Line
//...................................................................................
export default function QuizBiddingTableLineCell(props) {
  //
  //  Destructure props
  //
  const { bqid, suit, cell } = props
  //
  //  Source svg
  //
  let src
  switch (suit) {
    case 'C':
      src = club
      break
    case 'D':
      src = diamond
      break
    case 'H':
      src = heart
      break
    case 'S':
      src = spade
      break
    default:
      src = null
      break
  }
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      {/* .......................................................................................... */}
      {/*  Bid & Suit                                                                               */}
      {/* .......................................................................................... */}
      <TableCell key={cell} sx={{ padding: '0px' }} style={{ width: 50 }}>
        <Grid container direction='row' justifyContent='center' alignItems='center'>
          {/* .......................................................................................... */}
          {/*  Bid                                                                               */}
          {/* .......................................................................................... */}
          <Grid item>
            <Typography variant='body2'>{bqid}</Typography>
          </Grid>
          {/* .......................................................................................... */}
          {/*  Suit Symbol                                                                               */}
          {/* .......................................................................................... */}
          {suit !== null && (
            <Grid item>
              <Avatar src={src} sx={{ height: '1rem', width: '1rem' }} />
            </Grid>
          )}

          {/* .......................................................................................... */}
        </Grid>
      </TableCell>
      {/* .......................................................................................... */}
    </>
  )
}
