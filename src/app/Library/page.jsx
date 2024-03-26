'use client'
//
//  Libraries
//
import React, { useState, useEffect } from 'react'
import styles from './Library.module.css'
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
const debugModule = 'Library'
//...........................................................................
// Global CONSTANTS
//...........................................................................
let recordsFiltered = null
//
//  Table Heading
//
const headCellsLarge = [
  { id: 'lrlid', label: 'ID' },
  { id: 'lrowner', label: 'Owner' },
  { id: 'lrgroup', label: 'Group' },
  { id: 'lrref', label: 'Reference' },
  { id: 'lrdesc', label: 'Description' },
  { id: 'lrwho', label: 'Who' },
  { id: 'lrtype', label: 'Type' },
  { id: 'learn', label: 'Learn', disableSorting: true },
  { id: 'ogcntquestions', label: 'Questions' },
  { id: 'quiz', label: 'Quiz', disableSorting: true },
]
const headCellsSmall = [
  { id: 'lrdesc', label: 'Description' },
  { id: 'learn', label: 'Learn', disableSorting: true },
  { id: 'quiz', label: 'Quiz', disableSorting: true },
]
const searchTypeOptionsLarge = [
  { id: 'lrlid', title: 'ID' },
  { id: 'lrowner', title: 'Owner' },
  { id: 'lrgroup', title: 'Group' },
  { id: 'lrref', title: 'Reference' },
  { id: 'lrdesc', title: 'Description' },
  { id: 'lrwho', title: 'Who' },
  { id: 'lrtype', title: 'Type' },
]
const searchTypeOptionsSmall = [{ id: 'lrdesc', title: 'Description' }]
//
//  Constants
//
import {
  BACKGROUNDCOLOR_TABLEPAPER,
  BACKGROUNDCOLOR_MYINPUT,
  BACKGROUNDCOLOR_TABLEBODY,
} from '/src//services/appInit/AppConstants'
//...................................................................................
//.  Main Line
//...................................................................................
export default function Library() {
  //
  //  State
  //
  const [records, setRecords] = useState([])
  const [filterFn, setFilterFn] = useState({
    fn: items => {
      return items
    },
  })
  const [searchType, setSearchType] = useState('lrdesc')
  const [searchValue, setSearchValue] = useState('')
  const [startPage0, setStartPage0] = useState(false)
  const [form_message, setForm_message] = useState('')
  const [ScreenSmall, setScreenSmall] = useState(false)
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
    if (debugLog) console.log(consoleLogTime(debugModule, 'w_ScreenSmall'), w_ScreenSmall)
    //
    //  Override if small
    //
    if (w_ScreenSmall) {
      headCells = headCellsSmall
      searchTypeOptions = searchTypeOptionsSmall
      buttonTextView = null
      buttonTextQuiz = null
      minWidth = '220px'
    }
    //
    //  Initial Data Load
    //
    loadData()
  }
  //.............................................................................
  //.  Load data from sessionStorage or Database
  //.............................................................................
  function loadData() {
    if (debugLog) console.log(consoleLogTime(debugModule, 'loadData'))
    //
    //  Do not refetch data if already exists
    //
    if (debugLog) console.log(consoleLogTime(debugModule, 'records'), [...records])
    if (records.length !== 0) return
    //
    //  Session Storage ?
    //
    const OwnersString = sessionStorageGet({ caller: debugModule, itemName: 'User_OwnersString' })
    const OwnersStringPrev = sessionStorageGet({
      caller: debugModule,
      itemName: 'User_OwnersString_Prev',
    })
    sessionStorageSet({
      caller: debugModule,
      itemName: 'User_OwnersString_Prev',
      itemValue: OwnersString,
    })
    //
    //  Change in owners string get from database, else store
    //
    OwnersString === OwnersStringPrev ? getStoreData() : getLibraryData()
  }
  //...................................................................................
  //.  Data from store
  //...................................................................................
  function getStoreData() {
    if (debugLog) console.log(consoleLogTime(debugModule, 'getStoreData'))
    //
    //  Update Table
    //
    const User_Data_Library = sessionStorageGet({
      caller: debugModule,
      itemName: 'User_Data_Library',
    })
    setRecords(User_Data_Library)
    //
    //  Form Saved Values - retrieve
    //
    const selection = sessionStorageGet({
      caller: debugModule,
      itemName: 'Page_Lib_Selection',
    })
    if (debugLog) console.log(consoleLogTime(debugModule, 'Page_Lib_Selection'), selection)
    //
    //  Filter
    //
    if (selection) {
      const searchType = selection.searchType
      const searchValue = selection.searchValue
      setSearchType(searchType)
      setSearchValue(searchValue)
      handleSearch(searchType, searchValue)
    }
  }
  //...................................................................................
  //.  Get Library data
  //...................................................................................
  function getLibraryData() {
    if (debugLog) console.log(consoleLogTime(debugModule, 'getLibraryData'))
    //
    //  User Message
    //
    setForm_message('Retrieving data from the database....')
    //
    //  Selection
    //
    const OwnersString = sessionStorageGet({
      caller: debugModule,
      itemName: 'User_OwnersString',
    })
    const AxString = `* from library join ownergroup on lrowner = ogowner and lrgroup = oggroup where lrowner in (${OwnersString}) order by lrlid`
    if (debugLog) console.log(consoleLogTime(debugModule, 'AxString'), AxString)
    //
    //  Process promise
    //
    const rowCrudparams = {
      AxMethod: 'post',
      AxCaller: debugModule,
      AxTable: 'library',
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
      const User_Data_Library = rtnObj.rtnRows
      //
      //  Session Storage
      //
      sessionStorageSet({
        caller: debugModule,
        itemName: 'User_Data_Library',
        itemValue: User_Data_Library,
      })
      //
      //  Update Table
      //
      setForm_message('')
      setRecords(User_Data_Library)
      //
      //  Filter
      //
      if (debugLog) console.log(consoleLogTime(debugModule, `User_Data_Library`), User_Data_Library)
      handleSearch()
      return
    })
    //
    //  Return Promise
    //
    return myPromiseGet
  }
  //...................................................................................
  //.  Prepare Row before switching to Quiz
  //...................................................................................
  function LibraryRow(row) {
    if (debugLog) console.log(consoleLogTime(debugModule, 'LibraryRow'), { ...row })
    //
    //  Store title
    //
    sessionStorageSet({
      caller: debugModule,
      itemName: 'Page_Quiz_ogtitle',
      itemValue: row.ogtitle,
    })
    //
    //  buildDataQuiz
    //
    const params = {
      p_owner: row.lrowner,
      p_group: row.lrgroup,
    }
    buildDataQuiz(params)
    router.push('/Quiz')
  }
  //.............................................................................
  //  Search/Filter
  //.............................................................................
  function handleSearch(p_searchType = searchType, p_searchValue = searchValue) {
    if (debugLog) console.log(consoleLogTime(debugModule, `Function: handleSearch`))
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
      itemName: 'Page_Lib_Selection',
      itemValue: selection,
    })
    if (debugLog) console.log(consoleLogTime(debugModule, `Page_Lib_Selection`), selection)
    //
    //  Filter
    //
    setFilterFn({
      fn: items => {
        //
        //  Nothing to search, return rows
        //
        if (p_searchValue === '') return items
        //
        //  Numeric
        //
        const p_searchValueInt = parseInt(p_searchValue)
        //
        //  Filter
        //
        let itemsFilter = items
        switch (p_searchType) {
          case 'lrlid':
            itemsFilter = items.filter(x => x.lrlid === p_searchValueInt)
            break
          case 'lrowner':
            itemsFilter = items.filter(x =>
              x.lrowner.toLowerCase().includes(p_searchValue.toLowerCase())
            )
            break
          case 'lrgroup':
            itemsFilter = items.filter(x =>
              x.lrgroup.toLowerCase().includes(p_searchValue.toLowerCase())
            )
            break
          case 'lrref':
            itemsFilter = items.filter(x =>
              x.lrref.toLowerCase().includes(p_searchValue.toLowerCase())
            )
            break
          case 'lrdesc':
            itemsFilter = items.filter(x =>
              x.lrdesc.toLowerCase().includes(p_searchValue.toLowerCase())
            )
            break
          case 'lrwho':
            itemsFilter = items.filter(x =>
              x.lrwho.toLowerCase().includes(p_searchValue.toLowerCase())
            )
            break
          case 'lrtype':
            itemsFilter = items.filter(x =>
              x.lrtype.toLowerCase().includes(p_searchValue.toLowerCase())
            )
            break
          default:
        }
        return itemsFilter
      },
    })
  }
  //.............................................................................
  //
  //  Hyperlink open
  //
  const openHyperlink = hyperlink => {
    if (debugLog) console.log(consoleLogTime(debugModule, `hyperlink`), hyperlink)
    window.open(hyperlink, '_blank')
  }
  //.............................................................................
  //
  //  Populate the Table
  //
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } = useMyTable(
    records,
    headCells,
    filterFn,
    startPage0,
    setStartPage0
  )
  recordsFiltered = recordsAfterPagingAndSorting()
  if (debugLog) console.log(consoleLogTime(debugModule, `recordsFiltered`), recordsFiltered)
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      {/* .......................................................................................... */}
      {ScreenSmall ? null : (
        <PageHeader
          title='Library of Teaching Material'
          subTitle='View Reference Material or Take a Quiz'
        />
      )}
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
              minWidth: minWidth,
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
          {/*.................................................................................................*/}
          <Box className={styles.messages}>
            <Typography style={{ color: 'red' }}>{form_message}</Typography>
          </Box>
          {/* .......................................................................................... */}
        </Toolbar>
        {/* .......................................................................................... */}

        <TblContainer>
          <TblHead />
          {recordsFiltered === undefined || recordsFiltered === null ? null : (
            <TableBody
              sx={{
                backgroundColor: BackgroundColor_TABLEBODY,
              }}
            >
              {recordsFiltered.map(row => (
                <TableRow key={row.lrlid}>
                  {ScreenSmall ? null : <TableCell>{row.lrlid}</TableCell>}
                  {ScreenSmall ? null : <TableCell>{row.lrowner}</TableCell>}
                  {ScreenSmall ? null : <TableCell>{row.lrgroup}</TableCell>}
                  {ScreenSmall ? null : <TableCell>{row.lrref}</TableCell>}
                  <TableCell>{row.lrdesc}</TableCell>
                  {ScreenSmall ? null : <TableCell>{row.lrwho}</TableCell>}
                  {ScreenSmall ? null : <TableCell>{row.lrtype}</TableCell>}
                  <TableCell>
                    <MyButton
                      className={styles.buttonview}
                      text={buttonTextView}
                      color='warning'
                      onClick={() => openHyperlink(row.lrlink)}
                    ></MyButton>
                  </TableCell>
                  {ScreenSmall ? null : <TableCell>{row.ogcntquestions}</TableCell>}
                  <TableCell>
                    {row.ogcntquestions > 0 ? (
                      <MyButton
                        className={styles.buttonquiz}
                        text={buttonTextQuiz}
                        color='warning'
                        onClick={() => LibraryRow(row)}
                      ></MyButton>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </TblContainer>
        <TblPagination />
        {/*.................................................................................................*/}
      </Paper>
    </>
  )
}
