'use client'
//
//  Libraries
//
import React, { useState, useEffect } from 'react'
import styles from './QuizHistory.module.css'
import {
  Paper,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
  Box,
  Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { format, parseISO } from 'date-fns'
//
//  Controls
//
import MyButton from '/src//components/Controls/MyButton'
import MyInput from '/src//components/Controls/MyInput'
import MySelect from '/src//components/Controls/MySelect'
import PageHeader from '/src//components/Controls/PageHeader'
import useMyTable from '/src//components/Controls/useMyTable'
//
//  Services
//
import apiRowCrud from '/src//services/dbApi/apiRowCrud'
import buildDataQuiz from '/src//services/builds/buildDataQuiz'
import buildDataHistDtl from '/src//services/builds/buildDataHistDtl'
import sessionStorageGet from '/src//services/sessionStorage/sessionStorageGet'
import sessionStorageSet from '/src//services/sessionStorage/sessionStorageSet'
//
//  Routing
//
import { useRouter } from 'next/navigation'
//
//  Debug Settings
//
import debugSettings from '/src//services/debug/debugSettings'
import consoleLogTime from '/src//services/debug/consoleLogTime'
let debugLog = false
const debugModule = 'QuizHistory'
//...........................................................................
// Global CONSTANTS
//...........................................................................
//
//  Table Heading
//
const headCellsLarge = [
  { id: 'r_hid', label: 'ID' },
  { id: 'yymmdd', label: 'Date' },
  { id: 'r_uid', label: 'User Id' },
  { id: 'u_name', label: 'User Name' },
  { id: 'r_owner', label: 'Owner' },
  { id: 'ogtitle', label: 'Group' },
  { id: 'r_questions', label: 'Questions' },
  { id: 'r_totalpoints', label: 'Score' },
  { id: 'r_maxpoints', label: 'Maximum' },
  { id: 'r_correctpercent', label: 'Score %' },
  { id: 'review', label: 'Review', disableSorting: true },
  { id: 'quiz', label: 'Quiz', disableSorting: true },
]
const headCellsSmall = [
  { id: 'ogtitle', label: 'Group' },
  { id: 'review', label: 'Review', disableSorting: true },
  { id: 'quiz', label: 'Quiz', disableSorting: true },
]
const searchTypeOptionsLarge = [
  { id: 'r_hid', title: 'ID' },
  { id: 'yymmdd', title: 'Date' },
  { id: 'r_owner', title: 'Owner' },
  { id: 'ogtitle', title: 'Group' },
]
const searchTypeOptionsSmall = [{ id: 'ogtitle', title: 'Group' }]

let g_allUsers = false
let g_allUsersText = 'ALL'
//
//  Constants
//
import {
  BACKGROUNDCOLOR_TABLEPAPER,
  BACKGROUNDCOLOR_MYINPUT,
  BACKGROUNDCOLOR_TABLEBODY,
} from '/src//services/appInit/AppConstants'
//============================================================================
//= Exported Module
//============================================================================
export default function QuizHistory() {
  //...........................................................................
  // Module STATE
  //...........................................................................
  //
  //  State
  //
  const [records, setRecords] = useState([])
  const [filterFn, setFilterFn] = useState({
    fn: items => {
      return items
    },
  })
  const [searchType, setSearchType] = useState('ogtitle')
  const [searchValue, setSearchValue] = useState('')
  const [startPage0, setStartPage0] = useState(false)
  const [allUsersText, setAllUsersText] = useState('ALL')
  const [subtitle, setSubtitle] = useState('')
  const [form_message, setForm_message] = useState('')
  const [ScreenSmall, setScreenSmall] = useState(false)
  const [User_Admin, setUser_Admin] = useState(false)
  //
  //  BackgroundColor
  //
  const [BackgroundColor_TABLEPAPER, SetBackgroundColor_TABLEPAPER] = useState(
    BACKGROUNDCOLOR_TABLEPAPER
  )
  const [BackgroundColor_MYINPUT, SetBackgroundColor_MYINPUT] = useState(BACKGROUNDCOLOR_MYINPUT)
  const [BackgroundColor_TABLEBODY, SetBackgroundColor_TABLEBODY] =
    useState(BACKGROUNDCOLOR_TABLEBODY)
  const router = useRouter()
  let g_User_name = ''
  let g_User_uid = 0
  //
  //  Default to large
  //
  let headCells = headCellsLarge
  let searchTypeOptions = searchTypeOptionsLarge
  let buttonTextView = 'View'
  let buttonTextQuiz = 'Quiz'
  let minWidth = '300px'
  //...........................................................................
  // Module Main Line
  //...........................................................................
  //
  //  First Time
  //
  useEffect(() => {
    clientFirstTime()
    // eslint-disable-next-line
  }, [])
  //
  //  Every Time
  //
  useEffect(() => {
    clientEveryTime()
  })
  //...........................................................................
  // First Time
  //...........................................................................
  function clientFirstTime() {
    //
    //  Debug Settings
    //
    debugLog = debugSettings()
    if (debugLog) console.log(consoleLogTime(debugModule, 'clientFirstTime'))
    //
    //  Application Environment Variables
    //
    const App_Env = sessionStorageGet({ caller: debugModule, itemName: 'App_Env' })
    if (debugLog) console.log(consoleLogTime(debugModule, 'App_Env '), App_Env)
    //
    //  BackgroundColor
    //
    SetBackgroundColor_TABLEPAPER(App_Env.BACKGROUNDCOLOR_TABLEPAPER)
    SetBackgroundColor_MYINPUT(App_Env.BACKGROUNDCOLOR_MYINPUT)
    SetBackgroundColor_TABLEBODY(App_Env.BACKGROUNDCOLOR_TABLEBODY)
    //
    //  Small Screen overrides
    //
    const w_ScreenSmall = sessionStorageGet({ caller: debugModule, itemName: 'App_ScreenSmall' })
    setScreenSmall(w_ScreenSmall)
    //
    //  Override if small
    //
    if (ScreenSmall) {
      headCells = headCellsSmall
      searchTypeOptions = searchTypeOptionsSmall
      buttonTextView = null
      buttonTextQuiz = null
      minWidth = '220px'
    }
    //
    //  Get User
    //
    const User_User = sessionStorageGet({ caller: debugModule, itemName: 'User_User' })
    g_User_name = User_User.u_name
    g_User_uid = User_User.u_uid
    setUser_Admin(User_User.u_admin)
    //
    //  Rebuild Data (switched user)
    //
    let Page_History_Rebuild = sessionStorageGet({
      caller: debugModule,
      itemName: 'Page_History_Rebuild',
    })
    if (!Page_History_Rebuild) Page_History_Rebuild = false
    if (Page_History_Rebuild) {
      sessionStorageSet({
        caller: debugModule,
        itemName: 'Page_History_Rebuild',
        itemValue: false,
      })
      sessionStorage.removeItem('User_Data_History')
      setRecords([])
      loadData()
    }
    //
    //  Initial Data Load
    //
    loadData()
  }
  //...........................................................................
  // Client Code
  //...........................................................................
  function clientEveryTime() {
    try {
    } catch (e) {
      if (debugLog) console.log(consoleLogTime(debugModule, 'Catch'))
      console.log(e)
    }
  }
  //...................................................................................
  //.  Reset the Data
  //...................................................................................
  function loadData() {
    //
    //  Do not refetch data if already exists
    //
    if (debugLog) console.log(consoleLogTime(debugModule, 'records'), [...records])
    if (records.length !== 0) return
    //
    //  Restore saved search values
    //
    const selection = sessionStorageGet({ caller: debugModule, itemName: 'Page_History_Selection' })
    if (debugLog)
      console.log(consoleLogTime(debugModule, 'Page_History_Selection'), { ...selection })
    if (selection) {
      const searchType = selection.searchType
      const searchValue = selection.searchValue
      setSearchType(searchType)
      setSearchValue(searchValue)
    }
    //
    //  Session Storage ?
    //
    const User_Data_History = sessionStorageGet({
      caller: debugModule,
      itemName: 'User_Data_History',
    })
    if (debugLog) console.log(consoleLogTime(debugModule, 'User_Data_History'), User_Data_History)
    if (User_Data_History) {
      setForm_message('Loading Data ....')
      setRecords(User_Data_History)
      handleSearch(searchType, searchValue)
      setForm_message('')
    }
    //
    //  Get Data
    //
    if (!User_Data_History) getRowAllData()
  }
  //.............................................................................
  //.  GET ALL
  //.............................................................................
  function getRowAllData() {
    //
    //  User Message
    //
    setForm_message('Retrieving data from the database....')
    //
    //  Selection
    //
    let AxString = `r_hid, r_uid, coalesce(u_name, '${g_User_name}') as u_name, r_datetime, r_owner, r_group, ogtitle, r_qid, r_ans, r_questions, r_totalpoints, r_maxpoints, r_correctpercent from usershistory`
    AxString = AxString + ` join ownergroup on r_owner = ogowner and r_group = oggroup`
    AxString = AxString + ` join users on r_uid = u_uid`
    //
    //  Select User (if not ALL)
    //
    if (!g_allUsers) AxString = AxString + ` where r_uid = ${g_User_uid}`
    AxString = AxString + ` order by r_hid desc`
    if (debugLog) console.log(consoleLogTime(debugModule, 'AxString'), AxString)
    //
    //  Process promise
    //
    const rowCrudparams = {
      AxMethod: 'post',
      AxCaller: debugModule,
      AxTable: 'usershistory',
      AxAction: 'SELECTSQL',
      AxString: AxString,
    }
    const myPromiseGet = apiRowCrud(rowCrudparams)
    //
    //  Resolve Status
    //
    myPromiseGet.then(function (rtnObj) {
      if (debugLog) console.log(consoleLogTime(debugModule, 'rtnObj'), { ...rtnObj })
      //
      //  No data returned
      //
      if (!rtnObj.rtnValue) return
      //
      //  Data
      //
      const User_Data_History = rtnObj.rtnRows
      //
      //  Data History add time stamp
      //
      const User_Data_History_Update = User_Data_History.map(record => ({
        ...record,
        yymmdd: format(parseISO(record.r_datetime), 'yy-MM-dd'),
      }))
      //
      //  Session Storage
      //
      sessionStorageSet({
        caller: debugModule,
        itemName: 'User_Data_History',
        itemValue: User_Data_History_Update,
      })
      //
      //  Update Table
      //
      setForm_message('')
      if (debugLog)
        console.log(
          consoleLogTime(debugModule, 'User_Data_History_Update'),
          User_Data_History_Update
        )

      setRecords(User_Data_History_Update)
      //
      //  Filter
      //
      handleSearch()
      return
    })
    //
    //  Return Promise
    //
    return myPromiseGet
  }
  //...................................................................................
  //.  Prepare Row before switching to QuizHistoryDetail
  //...................................................................................
  function QuizHistoryRow(row) {
    //
    //  Store Row
    //
    sessionStorageSet({
      caller: debugModule,
      itemName: 'Page_Qd_Row',
      itemValue: row,
    })
    //
    //  Get data
    //
    buildDataHistDtl(row)
    router.push('/QuizHistoryDetail')
  }
  //...................................................................................
  //.  Prepare Row before switching to Quiz
  //...................................................................................
  function QuizBuild(row) {
    //
    //  Store Row
    //
    sessionStorageSet({
      caller: debugModule,
      itemName: 'Page_Qd_Row',
      itemValue: row,
    })
    sessionStorageSet({
      caller: debugModule,
      itemName: 'Page_Quiz_ogtitle',
      itemValue: row.ogtitle,
    })
    //
    //  buildDataQuiz
    //
    const params = {
      p_owner: row.r_owner,
      p_group: row.r_group,
    }
    buildDataQuiz(params)
    router.push('/Quiz')
  }

  //.............................................................................
  //  Search/Filter
  //.............................................................................
  function handleSearch(p_searchType = searchType, p_searchValue = searchValue) {
    //
    //  Start at first page (0)
    //
    setStartPage0(true)
    //
    //  Save search values
    //
    const selection = {
      searchType: p_searchType,
      searchValue: p_searchValue,
    }
    sessionStorageSet({
      caller: debugModule,
      itemName: 'Page_History_Selection',
      itemValue: selection,
    })
    //
    //  Subtitle
    //
    g_allUsers ? setSubtitle('ALL USERS') : setSubtitle(`${g_User_name} (${g_User_uid})`)
    //
    //  Filter
    //
    setFilterFn({
      fn: items => {
        //
        //  Filter by user ?
        //
        let userFilter = items
        if (!g_allUsers) {
          userFilter = items.filter(x => x.r_uid === g_User_uid)
        }
        //
        //  Nothing to search, return rows
        //
        if (p_searchValue === '') {
          if (debugLog)
            console.log(consoleLogTime(debugModule, 'setFilterFn userFilter'), userFilter)
          return userFilter
        }
        //
        //  Numeric
        //
        const p_searchValueInt = parseInt(p_searchValue)
        //
        //  Filter
        //
        let itemsFilter = userFilter
        switch (p_searchType) {
          case 'r_hid':
            itemsFilter = userFilter.filter(x => x.r_hid === p_searchValueInt)
            break
          case 'yymmdd':
            itemsFilter = userFilter.filter(x => x.yymmdd === p_searchValue)
            break
          case 'r_owner':
            itemsFilter = userFilter.filter(x =>
              x.r_owner.toLowerCase().includes(p_searchValue.toLowerCase())
            )
            break
          case 'ogtitle':
            itemsFilter = userFilter.filter(x =>
              x.ogtitle.toLowerCase().includes(p_searchValue.toLowerCase())
            )
            break
          default:
        }
        if (debugLog)
          console.log(consoleLogTime(debugModule, 'setFilterFn itemsFilter'), itemsFilter)
        return itemsFilter
      },
    })
  }
  //.............................................................................
  //  Switch to All/Users
  //.............................................................................
  function handleAllUsers() {
    //
    //  Switch All/Selected User
    //
    if (g_allUsers) {
      g_allUsers = false
      g_allUsersText = 'ALL'
    } else {
      g_allUsers = true
      g_allUsersText = 'Users'
    }
    //
    //  Button Text
    //
    setAllUsersText(g_allUsersText)
    //
    //  Subtitle
    //
    g_allUsers ? setSubtitle('ALL USERS') : setSubtitle(`${g_User_name} (${g_User_uid})`)
    //
    //  Refresh data
    //
    getRowAllData()
  }
  //.............................................................................
  //
  //  Populate the Table
  //
  if (debugLog) console.log(consoleLogTime(debugModule, 'records'), records)
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } = useMyTable(
    records,
    headCells,
    filterFn,
    startPage0,
    setStartPage0
  )
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      {/* .......................................................................................... */}
      {ScreenSmall ? null : <PageHeader title='Quiz History' subTitle={subtitle} />}
      {/* .......................................................................................... */}
      <Paper
        className={styles.pageContent}
        sx={{
          backgroundColor: BackgroundColor_TABLEPAPER,
        }}
      >
        <Toolbar>
          {/* .......................................................................................... */}
          <MyInput
            label='Search'
            name='Search'
            value={searchValue}
            className={styles.searchInput}
            sx={{
              backgroundColor: BackgroundColor_MYINPUT,
              minWidth: { minWidth },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onChange={e => setSearchValue(e.target.value)}
          />
          {/* .......................................................................................... */}
          {ScreenSmall ? null : (
            <Box className={styles.searchInputTypeBox}>
              <MySelect
                sx={{
                  backgroundColor: BackgroundColor_MYINPUT,
                  minWidth: '200px',
                }}
                name='SearchType'
                label='Search By'
                value={searchType}
                onChange={e => setSearchType(e.target.value)}
                options={searchTypeOptions}
              />
            </Box>
          )}
          {/* .......................................................................................... */}
          <MyButton
            className={styles.buttonfilter}
            text='Filter'
            onClick={() => handleSearch()}
          ></MyButton>
          {/* .......................................................................................... */}
          {User_Admin & !ScreenSmall ? (
            <MyButton
              text={allUsersText}
              className={styles.buttonfilter}
              onClick={handleAllUsers}
            />
          ) : null}
          {/* .......................................................................................... */}
          {User_Admin & !ScreenSmall ? (
            <MyButton
              text='Refresh'
              className={styles.buttonfilter}
              onClick={() => getRowAllData()}
            />
          ) : null}
          {/*.................................................................................................*/}
          <Box>
            <Typography style={{ color: 'red' }}>{form_message}</Typography>
          </Box>

          {/* .......................................................................................... */}
        </Toolbar>
        {/* .......................................................................................... */}
        <TblContainer>
          <TblHead />
          <TableBody
            sx={{
              backgroundColor: BackgroundColor_TABLEBODY,
            }}
          >
            {recordsAfterPagingAndSorting().map(row => (
              <TableRow key={row.r_hid}>
                {ScreenSmall ? null : <TableCell>{row.r_hid}</TableCell>}
                {ScreenSmall ? null : <TableCell>{row.yymmdd}</TableCell>}
                {ScreenSmall ? null : <TableCell>{row.r_uid}</TableCell>}
                {ScreenSmall ? null : <TableCell>{row.u_name}</TableCell>}
                {ScreenSmall ? null : <TableCell>{row.r_owner}</TableCell>}
                <TableCell>{row.ogtitle}</TableCell>
                {ScreenSmall ? null : <TableCell>{row.r_questions}</TableCell>}
                {ScreenSmall ? null : <TableCell>{row.r_totalpoints}</TableCell>}
                {ScreenSmall ? null : <TableCell>{row.r_maxpoints}</TableCell>}
                {ScreenSmall ? null : <TableCell>{row.r_correctpercent}</TableCell>}
                <TableCell>
                  <MyButton
                    className={styles.buttonview}
                    text={buttonTextView}
                    color='warning'
                    onClick={() => QuizHistoryRow(row)}
                  ></MyButton>
                </TableCell>
                <TableCell>
                  <MyButton
                    className={styles.buttonquiz}
                    text={buttonTextQuiz}
                    color='warning'
                    onClick={() => QuizBuild(row)}
                  ></MyButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TblContainer>
        <TblPagination />
      </Paper>
    </>
  )
}
