import TableRow from '@mui/material/TableRow'
//
//  Sub Components
//
import QuizHandsTableLineCell from './QuizHandsTableLineCell'
//.............................................................................
//.  Initialisation
//.............................................................................
export default function QuizHandsTableLine(props) {
  //...................................................................................
  //.  Main Line
  //...................................................................................
  //
  //  Destructure props
  //
  const { handObj, rowCount } = props
  const { position, hand } = handObj
  //
  //  Strip 'n' and replace with null
  //
  for (let i = 0; i < 4; i++) {
    if (hand[i] === 'n' || hand[i] === 'N') hand[i] = null
  }
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <TableRow key={rowCount}>
      <QuizHandsTableLineCell cell='position' cellValue={position} />
      <QuizHandsTableLineCell cell='spades' cellValue={hand[0]} />
      <QuizHandsTableLineCell cell='hearts' cellValue={hand[1]} />
      <QuizHandsTableLineCell cell='diamonds' cellValue={hand[2]} />
      <QuizHandsTableLineCell cell='clubs' cellValue={hand[3]} />
    </TableRow>
  )
}
