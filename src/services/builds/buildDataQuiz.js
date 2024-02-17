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
const debugModule = 'buildDataQuiz'
//
//  Global Variables
//
let User_User
let MaxQuestions
let Page_Quiz_Q_Flt = []
let Page_Quiz_Q_Flt_qqid = []
let Page_Quiz_Bid
let Page_Quiz_Hands
//...................................................................................
//.  Main Line
//...................................................................................
export default function buildDataQuiz(props) {
  //
  //  Debug Settings
  //
  debugLog = debugSettings()
  //
  //  Try
  //
  try {
    if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
    //
    //  Signed in User
    //
    User_User = sessionStorageGet({
      caller: debugModule,
      itemName: 'User_User',
    })
    MaxQuestions = User_User.u_dftmaxquestions
    //
    //  Deconstruct props
    //
    if (debugLog) console.log(consoleLogTime(debugModule, 'props'), props)
    const { p_owner, p_group } = props
    //
    //  Store Owner/group
    //
    sessionStorageSet({
      caller: debugModule,
      itemName: 'Page_Quiz_Owner',
      itemValue: p_owner,
    })
    sessionStorageSet({
      caller: debugModule,
      itemName: 'Page_Quiz_OwnerGroup',
      itemValue: p_group,
    })
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
      itemName: 'Page_Quiz_Reset',
      itemValue: true,
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

    sessionStorageSet({
      caller: debugModule,
      itemName: 'Page_Quiz_Q_Flt',
      itemValue: [],
    })

    sessionStorageSet({
      caller: debugModule,
      itemName: 'Page_Quiz_Q_Flt_Cnt',
      itemValue: [],
    })

    sessionStorageSet({
      caller: debugModule,
      itemName: 'Page_Quiz_Q_Flt_qqid',
      itemValue: [],
    })
    //
    //  Load data
    //
    LoadServerQuestions(p_owner, p_group)
  } catch (e) {
    if (debugLog) console.log(consoleLogTime(debugModule, 'Catch'))
    console.log(e)
  }
  //...................................................................................
  //.  Load Server - Questions
  //...................................................................................
  function LoadServerQuestions(p_owner, p_group) {
    if (debugLog) console.log(consoleLogTime(debugModule, 'LoadServerQuestions'))
    //
    //  Question Data
    //
    const User_Questions = sessionStorageGet({
      caller: debugModule,
      itemName: 'User_Questions',
    })
    //
    //  Filter Owner/group
    //
    const User_Questions_Flt = User_Questions.filter(
      x => x.qowner === p_owner && x.qgroup === p_group
    )
    //
    //  Output Page_Quiz_Q_Flt
    //
    QuestionsSortMax(User_Questions_Flt)
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
  }
  //...................................................................................
  //.  Output Page_Quiz_Q_Flt
  //...................................................................................
  function QuestionsSortMax(User_Questions_Flt) {
    if (debugLog) console.log(consoleLogTime(debugModule, 'QuestionsSortMax'))
    //
    //  Random sort questions
    //
    const SortQuestions = User_User.u_sortquestions
    SortQuestions
      ? (Page_Quiz_Q_Flt = User_Questions_Flt.sort(() => Math.random() - 0.5))
      : (Page_Quiz_Q_Flt = User_Questions_Flt)
    //
    //  Apply max number
    //
    if (Page_Quiz_Q_Flt.length > MaxQuestions) {
      let i = Page_Quiz_Q_Flt.length - 1
      for (i; i >= MaxQuestions; i--) {
        Page_Quiz_Q_Flt.pop()
      }
    }
    //
    //  Question IDs
    //
    Page_Quiz_Q_Flt_qqid = []
    for (let i = 0; i < Page_Quiz_Q_Flt.length; i++) {
      Page_Quiz_Q_Flt_qqid.push(Page_Quiz_Q_Flt[i].qqid)
    }
    //
    //  Order by question id
    //
    Page_Quiz_Q_Flt_qqid.sort()
    //
    //  Session Storage
    //

    sessionStorageSet({
      caller: debugModule,
      itemName: 'Page_Quiz_Q_Flt',
      itemValue: Page_Quiz_Q_Flt,
    })

    sessionStorageSet({
      caller: debugModule,
      itemName: 'Page_Quiz_Q_Flt_Cnt',
      itemValue: Page_Quiz_Q_Flt.length,
    })

    sessionStorageSet({
      caller: debugModule,
      itemName: 'Page_Quiz_Q_Flt_qqid',
      itemValue: Page_Quiz_Q_Flt_qqid,
    })
  }
  //...................................................................................
}
