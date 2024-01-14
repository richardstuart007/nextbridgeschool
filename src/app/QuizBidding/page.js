'use client'
//
//  Libraries
//
import { Table, TableBody, Card } from '@mui/material'
//
//  Sub Components
//
import QuizBiddingTableHeader from './QuizBiddingTableHeader'
import QuizBiddingTableLine from './QuizBiddingTableLine'
//===================================================================================
export default function QuizBidding({ qqid }) {
  //...................................................................................
  //.  Main Line
  //...................................................................................
  let testingQid = qqid
  //
  //  Get Bidding
  //
  const Page_Quiz_BidJSON = sessionStorage.getItem('Page_Quiz_Bid')
  //
  //  No Bidding, return
  //
  if (Page_Quiz_BidJSON === []) return null
  //
  //  Parse data
  //
  const Page_Quiz_Bid = JSON.parse(Page_Quiz_BidJSON)
  //
  //  Find the BiddingRow
  //
  let BiddingRow = Page_Quiz_Bid.find(element => element.bqid === testingQid)
  //
  //  Has BiddingRow ?
  //
  let hasBidding
  BiddingRow === undefined ? (hasBidding = false) : (hasBidding = true)
  //
  //  No BiddingRow, return
  //
  if (hasBidding === false) return null
  //
  //  Build Bidding Arrays
  //
  let Rounds = [...BiddingRow.brounds]
  //
  //  Process each Round
  //
  let RoundCount = 0
  let roundsbidObjArray = []
  Rounds.forEach(round => {
    //
    //  Process each bqid for a round - Create roundBidsArray
    //
    let bidObjArray = []
    round.forEach(bqid => {
      //
      //  Fill bidObj (bqid/suit)
      //
      const bidObj = {
        bqid: '',
        suit: ''
      }
      const level = bqid.substr(0, 1)
      switch (level) {
        // Pass
        case 'P':
          bidObj.bqid = 'Pass'
          bidObj.suit = null
          break
        // Question
        case '?':
          bidObj.bqid = bqid
          bidObj.suit = null
          break
        // Double
        case 'X':
          bidObj.bqid = bqid
          bidObj.suit = null
          break
        //  Nothing
        case ' ':
          bidObj.bqid = null
          bidObj.suit = null
          break
        //  Nothing
        case 'n':
          bidObj.bqid = null
          bidObj.suit = null
          break
        //  Nothing
        case 'N':
          bidObj.bqid = null
          bidObj.suit = null
          break
        default:
          //  No Trump
          if (bqid.substr(1, 1) === 'N') {
            bidObj.bqid = bqid
            bidObj.suit = null
          }
          //  Suit
          else {
            bidObj.bqid = level
            bidObj.suit = bqid.substr(1, 1)
          }
          break
      }
      //
      //  Load bidObj to bidObjArray
      //
      bidObjArray.push(bidObj)
    })
    //
    //  Prefix bidObj with round number
    //
    const objTemp = {
      roundCount: '',
      innerArray: []
    }
    RoundCount++
    objTemp.roundCount = 'Round' + RoundCount.toString()
    objTemp.innerArray = bidObjArray
    //
    //  Load to all rounds (bidObj)
    //
    roundsbidObjArray.push(objTemp)
  })
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      <Card sx={{ maxWidth: 200, marginTop: '16px' }} style={{ backgroundColor: 'LightGray' }}>
        <Table>
          {/* .......................................................................................... */}
          <QuizBiddingTableHeader />
          {/* .......................................................................................... */}
          <TableBody>
            {roundsbidObjArray.map(objTemp => (
              <QuizBiddingTableLine
                key={objTemp.roundCount}
                roundCount={objTemp.roundCount}
                round={objTemp.innerArray}
              />
            ))}
          </TableBody>
          {/* .......................................................................................... */}
        </Table>
      </Card>
    </>
  )
}
