//
//  Utilities
//
import apiAxios from '../../utilities/apiAxios'
//
//  Debug Settings
//
import debugSettings from '../../debug/debugSettings'
import consoleLogTime from '../../debug/consoleLogTime'
const debugLog = debugSettings()
const debugModule = 'registerUser'
//--------------------------------------------------------------------
//-  Main Line
//--------------------------------------------------------------------
export default async function registerUser(props) {
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
  //
  //  Application Environment Variables
  //
  const App_Env = JSON.parse(sessionStorage.getItem('App_Env'))
  if (debugLog) console.log(consoleLogTime(debugModule, 'App_Env'), { ...App_Env })
  //
  //  Deconstruct props
  //
  const {
    AxCaller,
    user,
    email,
    password,
    name,
    fedid,
    fedcountry,
    dftmaxquestions,
    dftowner,
    showprogress,
    showscore,
    sortquestions,
    skipcorrect,
    admin,
    dev
  } = props
  let AxClient = `${debugModule}/${AxCaller}`
  //
  //  Get the URL
  //
  const App_URL = JSON.parse(sessionStorage.getItem('App_URL'))
  //
  // Fetch the data
  //
  let rtnObj = fetchItems()
  return rtnObj
  //--------------------------------------------------------------------
  //.  fetch data
  //--------------------------------------------------------------------
  async function fetchItems() {
    let body
    try {
      //
      //  Setup actions
      //
      body = {
        AxClient: AxClient,
        AxTable: 'users',
        user: user,
        email: email,
        password: password,
        name: name,
        fedid: fedid,
        fedcountry: fedcountry,
        dftmaxquestions: dftmaxquestions,
        dftowner: dftowner,
        showprogress: showprogress,
        showscore: showscore,
        sortquestions: sortquestions,
        skipcorrect: skipcorrect,
        admin: admin,
        dev: dev
      }
      const URL = App_URL + App_Env.URL_REGISTER
      //
      //  Info
      //
      const info = `Client(${AxClient}) Action(Register)`
      //
      //  SQL database
      //
      const apiAxiosProps = {
        AxUrl: URL,
        AxData: body,
        AxTimeout: 2500,
        AxInfo: info
      }
      rtnObj = await apiAxios(apiAxiosProps)
      return rtnObj
      //
      // Errors
      //
    } catch (err) {
      if (debugLog) console.log(consoleLogTime(debugModule, 'Catch err'), { ...err })
      const rtnObj = {
        rtnBodyParms: body,
        rtnValue: false,
        rtnMessage: '',
        rtnSqlFunction: debugModule,
        rtnCatchFunction: debugModule,
        rtnCatch: true,
        rtnCatchMsg: 'Catch calling apiAxios',
        rtnRows: []
      }
      return rtnObj
    }
  }
  //--------------------------------------------------------------------
}
