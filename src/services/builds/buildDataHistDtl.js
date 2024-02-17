//
//  services
//
import sessionStorageGet from '@/services/sessionStorage/sessionStorageGet'
import sessionStorageSet from '@/services/sessionStorage/sessionStorageSet'
//
//  Debug Settings
//
import debugSettings from '@/services/debug/debugSettings'
import consoleLogTime from '@/services/debug/consoleLogTime'
let debugLog
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
  debugLog = debugSettings()
  //
  //  Try
  //
  try {
    if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))

    //
    //  Reset the Data
    //
    sessionStorageSet({
      caller: debugModule,
      itemName: 'Page_Quiz_CatchMessage',
      itemValue: '',
    })
    sessionStorageSet({
      caller: debugModule,
      itemName: 'Page_Quiz_Q_Flt',
      itemValue: [],
    })
    sessionStorageSet({
      caller: debugModule,
      itemName: 'Page_Quiz_Bid',
      itemValue: [],
    })
    sessionStorageSet({
      caller: debugModule,
      itemName: 'Page_Quiz_Hands',
      itemValue: [],
    })
    //
    //  Question Data
    //
    const User_Questions = sessionStorageGet({
      caller: debugModule,
      itemName: 'User_Questions',
    })
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
    const User_Bid = sessionStorageGet({
      caller: debugModule,
      itemName: 'User_Bid',
    })
    Page_Quiz_Bid = User_Bid.filter(x => Page_Quiz_Q_Flt_qqid.includes(x.bqid))
    sessionStorageSet({
      caller: debugModule,
      itemName: 'Page_Quiz_Bid',
      itemValue: Page_Quiz_Bid,
    })
    //
    //  Load related Hands
    //
    const User_Hands = sessionStorageGet({
      caller: debugModule,
      itemName: 'User_Hands',
    })
    Page_Quiz_Hands = User_Hands.filter(x => Page_Quiz_Q_Flt_qqid.includes(x.hqid))
    sessionStorageSet({
      caller: debugModule,
      itemName: 'Page_Quiz_Hands',
      itemValue: Page_Quiz_Hands,
    })
    //
    //  Completion
    //

    sessionStorageSet({
      caller: debugModule,
      itemName: 'Page_Quiz_Q_Flt',
      itemValue: Page_Quiz_Q_Flt,
    })

    sessionStorageSet({
      caller: debugModule,
      itemName: 'Page_Quiz_Bid',
      itemValue: Page_Quiz_Bid,
    })

    sessionStorageSet({
      caller: debugModule,
      itemName: 'Page_Quiz_Hands',
      itemValue: Page_Quiz_Hands,
    })
  } catch (e) {
    if (debugLog) console.log(consoleLogTime(debugModule, 'Catch'))
    console.log(e)
  }
}
