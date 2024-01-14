//
//  Libraries
//
import { Avatar, TableCell, TableHead, TableRow } from '@mui/material'
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
export default function QuizHandsTableHeader() {
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      <TableHead style={{ backgroundColor: 'Gray' }}>
        <TableRow>
          <TableCell sx={{ padding: '0px' }} align='left' style={{ width: 100 }}></TableCell>
          <TableCell sx={{ padding: '0px' }} align='left' style={{ width: 100 }}>
            <Avatar src={spade} sx={{ height: '1rem', width: '1rem' }} />
          </TableCell>
          <TableCell sx={{ padding: '0px' }} align='left' style={{ width: 100 }}>
            <Avatar src={heart} sx={{ height: '1rem', width: '1rem' }} />
          </TableCell>
          <TableCell sx={{ padding: '0px' }} align='left' style={{ width: 100 }}>
            <Avatar src={diamond} sx={{ height: '1rem', width: '1rem' }} />
          </TableCell>
          <TableCell sx={{ padding: '0px' }} align='left' style={{ width: 100 }}>
            <Avatar src={club} sx={{ height: '1rem', width: '1rem' }} />
          </TableCell>
        </TableRow>
      </TableHead>
    </>
  )
}
