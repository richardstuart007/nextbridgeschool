//
//  Debug Settings
//
import debugSettings from '../debug/debugSettings'
import consoleLogTime from '../debug/consoleLogTime'
const debugLog = debugSettings()
const debugModule = 'buildDataHistDtl'
//
//  Global Variables
//
let Page_Quiz_Q_Flt_qqid = []
let Page_Quiz_Bid = []
let Page_Quiz_Hands = []
//...................................................................................
//.  Main Line
//...................................................................................
export default function buildDataHistDtl(row) {
  //
  //  Try
  //
  try {
    if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
    //
    //  Reset the Data
    //
    sessionStorage.setItem('Page_Quiz_CatchMessage', '')
    sessionStorage.setItem('Page_Quiz_Q_Flt', [])
    sessionStorage.setItem('Page_Quiz_Bid', [])
    sessionStorage.setItem('Page_Quiz_Hands', [])
    //
    //  Question Data
    //
    const User_Questions = JSON.parse(sessionStorage.getItem('User_Questions'))
    //
    //  Filter QIDs
    //
    const p_qqid = row.r_qid
    const Page_Quiz_Q_Flt = User_Questions.filter(x => p_qqid.includes(x.qqid))
    //
    //  Question IDs
    //
    Page_Quiz_Q_Flt_qqid = []
    for (let i = 0; i < Page_Quiz_Q_Flt.length; i++) {
      Page_Quiz_Q_Flt_qqid.push(Page_Quiz_Q_Flt[i].qqid)
    }
    //
    //  Load related Bids
    //
    const User_Bid = JSON.parse(sessionStorage.getItem('User_Bid'))
    Page_Quiz_Bid = User_Bid.filter(x => Page_Quiz_Q_Flt_qqid.includes(x.bqid))
    sessionStorage.setItem('Page_Quiz_Bid', JSON.stringify(Page_Quiz_Bid))
    //
    //  Load related Hands
    //
    const User_Hands = JSON.parse(sessionStorage.getItem('User_Hands'))
    Page_Quiz_Hands = User_Hands.filter(x => Page_Quiz_Q_Flt_qqid.includes(x.hqid))
    sessionStorage.setItem('Page_Quiz_Hands', JSON.stringify(Page_Quiz_Hands))
    //
    //  Completion
    //
    sessionStorage.setItem('Page_Quiz_Q_Flt', JSON.stringify(Page_Quiz_Q_Flt))
    sessionStorage.setItem('Page_Quiz_Bid', JSON.stringify(Page_Quiz_Bid))
    sessionStorage.setItem('Page_Quiz_Hands', JSON.stringify(Page_Quiz_Hands))
  } catch (e) {
    if (debugLog) console.log(consoleLogTime(debugModule, 'Catch'))
    console.log(e)
  }
}
