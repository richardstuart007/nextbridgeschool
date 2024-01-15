//
//  Libraries
//
import { TableCell, TableHead, TableRow } from '@mui/material'
//...................................................................................
//.  Main Line
//...................................................................................
export default function QuizBiddingTableHeader() {
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      <TableHead style={{ backgroundColor: 'Gray' }}>
        <TableRow key={'TableHeader'}>
          {/* .......................................................................................... */}
          <TableCell
            key='North'
            sx={{ padding: '0px' }}
            align='center'
            style={{ width: 50, color: 'white' }}
          >
            N
          </TableCell>
          {/* .......................................................................................... */}
          <TableCell
            key='East'
            sx={{ padding: '0px' }}
            align='center'
            style={{ width: 50, color: 'white' }}
          >
            E
          </TableCell>
          {/* .......................................................................................... */}
          <TableCell
            key='South'
            sx={{ padding: '0px' }}
            align='center'
            style={{ width: 50, color: 'white' }}
          >
            S
          </TableCell>
          {/* .......................................................................................... */}
          <TableCell
            key='West'
            sx={{ padding: '0px' }}
            align='center'
            style={{ width: 50, color: 'white' }}
          >
            W
          </TableCell>
          {/* .......................................................................................... */}
        </TableRow>
      </TableHead>
    </>
  )
}
