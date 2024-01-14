import TableRow from '@mui/material/TableRow'
//
//  Sub Components
//
import QuizBiddingTableLineCell from './QuizBiddingTableLineCell'
//...................................................................................
//.  Main Line
//...................................................................................
export default function QuizBiddingTableLine(props) {
  //
  //  Destructure props
  //
  const { round, roundCount } = props
  //
  //  round into Object
  //
  const roundBid = {
    north: null,
    east: null,
    south: null,
    west: null
  }
  if (round[0]) roundBid.north = round[0].bqid
  if (round[1]) roundBid.east = round[1].bqid
  if (round[2]) roundBid.south = round[2].bqid
  if (round[3]) roundBid.west = round[3].bqid
  //
  //  round into Object
  //
  const roundSuit = {
    north: null,
    east: null,
    south: null,
    west: null
  }
  if (round[0]) roundSuit.north = round[0].suit
  if (round[1]) roundSuit.east = round[1].suit
  if (round[2]) roundSuit.south = round[2].suit
  if (round[3]) roundSuit.west = round[3].suit
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <TableRow key={roundCount}>
      <QuizBiddingTableLineCell
        key='north'
        cell='north'
        bqid={roundBid.north}
        suit={roundSuit.north}
      />
      <QuizBiddingTableLineCell key='east' cell='east' bqid={roundBid.east} suit={roundSuit.east} />
      <QuizBiddingTableLineCell
        key='south'
        cell='south'
        bqid={roundBid.south}
        suit={roundSuit.south}
      />
      <QuizBiddingTableLineCell key='west' cell='west' bqid={roundBid.west} suit={roundSuit.west} />
    </TableRow>
  )
}
