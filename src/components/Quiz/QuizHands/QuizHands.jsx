'use client'
//
//  Libraries
//
import React from 'react'
import { Table, TableBody, Card } from '@mui/material'
//
//  services
//
import sessionStorageGet from '@/services/sessionStorage/sessionStorageGet'
//
//  Sub Components
//
import QuizHandsTableHeader from './QuizHandsTableHeader'
import QuizHandsTableLine from './QuizHandsTableLine'
//
//  Debug Settings
//
const debugModule = 'QuizHands'
//...................................................................................
//.  Main Line
//...................................................................................
export default function QuizHands({ qqid }) {
  let testingQid = qqid
  //
  //  Get hands
  //
  const Page_Quiz_Hands = sessionStorageGet({
    caller: debugModule,
    itemName: 'Page_Quiz_Hands',
  })
  //
  //  No data, return
  //
  if (!Page_Quiz_Hands) return null
  //
  //  Find the HandsRow for this ID
  //
  let HandsRow = Page_Quiz_Hands.find(element => element.hqid === testingQid)
  //
  //  Has HandsRow ?
  //
  let hasHands
  HandsRow === undefined ? (hasHands = false) : (hasHands = true)
  //
  //  No HandsRow, return
  //
  if (hasHands === false) return null
  //
  //  Build HandObj Array - N/E/S/W
  //
  let HandObjArray = []
  let RowCount = 0
  //
  //  North
  //
  if (HandsRow.hnorth) {
    RowCount++
    const handObj = {
      rowCount: 'RowCount' + RowCount.toString(),
      position: 'North',
      hand: [],
    }
    handObj.hand = [...HandsRow.hnorth]
    HandObjArray.push(handObj)
  }
  //
  //  East
  //
  if (HandsRow.heast) {
    RowCount++
    const handObj = {
      rowCount: 'RowCount' + RowCount.toString(),
      position: 'East',
      hand: [],
    }
    handObj.hand = [...HandsRow.heast]
    HandObjArray.push(handObj)
  }
  //
  //  South
  //
  if (HandsRow.hsouth) {
    RowCount++
    const handObj = {
      rowCount: 'RowCount' + RowCount.toString(),
      position: 'South',
      hand: [],
    }
    handObj.hand = [...HandsRow.hsouth]
    HandObjArray.push(handObj)
  }
  //
  //  West
  //
  if (HandsRow.hwest) {
    RowCount++
    const handObj = {
      rowCount: 'RowCount' + RowCount.toString(),
      position: 'West',
      hand: [],
    }
    handObj.hand = [...HandsRow.hwest]
    HandObjArray.push(handObj)
  }
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      <Card sx={{ maxWidth: 600, marginTop: '16px' }} style={{ backgroundColor: 'LightGray' }}>
        <Table>
          {/* .......................................................................................... */}
          <QuizHandsTableHeader />
          {/* .......................................................................................... */}
          <TableBody>
            {HandObjArray.map(handObj => (
              <QuizHandsTableLine
                key={handObj.rowCount}
                handObj={handObj}
                rowCount={handObj.rowCount}
              />
            ))}
          </TableBody>
          {/* .......................................................................................... */}
        </Table>
      </Card>
    </>
  )
}
