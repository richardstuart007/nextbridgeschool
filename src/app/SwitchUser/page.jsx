'use client'
//
//  Libraries
//
import React, { useState, useEffect } from 'react'
import styles from './SwitchUser.module.css'
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
import RefreshIcon from '@mui/icons-material/Refresh'
import FilterListIcon from '@mui/icons-material/FilterList'
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount'
//
//  Controls
//
import MyButton from '@/components/Controls/MyButton'
import MyInput from '@/components/Controls/MyInput'
import MySelect from '@/components/Controls/MySelect'
import PageHeader from '@/components/Controls/PageHeader'
import useMyTable from '@/components/Controls/useMyTable'
//
//  Services
//
import apiRowCrud from '@/services/dbApi/apiRowCrud'
import sessionStorageSet from '@/services/sessionStorage/sessionStorageSet'
import sessionStorageGet from '@/services/sessionStorage/sessionStorageGet'
//
//  Routing
//
import { useRouter } from 'next/navigation'
//
//  Debug Settings
//
import debugSettings from '@/services/debug/debugSettings'
import consoleLogTime from '@/services/debug/consoleLogTime'
let debugLog
const debugModule = 'SwitchUser'
//
//  Table Heading
//
const headCells = [
  { id: 'u_uid', label: 'ID' },
  { id: 'u_user', label: 'User' },
  { id: 'u_email', label: 'Email' },
  { id: 'u_name', label: 'Name' },
  { id: 'u_fedid', label: 'Bridge ID' },
  { id: 'u_fedcountry', label: 'Country' },
  { id: 'u_dftmaxquestions', label: 'Max Questions' },
  { id: 'actions', label: 'Actions', disableSorting: true },
]
const searchTypeOptions = [
  { id: 'u_email', title: 'Email' },
  { id: 'u_user', title: 'User' },
  { id: 'u_uid', title: 'ID' },
  { id: 'u_name', title: 'Name' },
  { id: 'u_fedid', title: 'Bridge ID' },
]
//
//  Constants
//
import {
  BACKGROUNDCOLOR_TABLEPAPER,
  BACKGROUNDCOLOR_MYINPUT,
  BACKGROUNDCOLOR_TABLEBODY,
} from '@/services/appInit/AppConstants'
//...................................................................................
//.  Main Line
//...................................................................................
export default function SwitchUser() {
  const router = useRouter()
  //.............................................................................
  //
  //  State
  //
  const [records, setRecords] = useState([])
  const [filterFn, setFilterFn] = useState({
    fn: items => {
      return items
    },
  })
  const [searchType, setSearchType] = useState('u_name')
  const [searchValue, setSearchValue] = useState('')
  const [form_message, setForm_message] = useState('')
  //
  //  BackgroundColor
  //
  const [BackgroundColor_TABLEPAPER, SetBackgroundColor_TABLEPAPER] = useState(
    BACKGROUNDCOLOR_TABLEPAPER
  )
  const [BackgroundColor_MYINPUT, SetBackgroundColor_MYINPUT] = useState(BACKGROUNDCOLOR_MYINPUT)
  const [BackgroundColor_TABLEBODY, SetBackgroundColor_TABLEBODY] =
    useState(BACKGROUNDCOLOR_TABLEBODY)
  //
  //  First Time
  //
  useEffect(() => {
    clientFirstTime()
    // eslint-disable-next-line
  }, [])
  //
  //  Populate the Table
  //
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } = useMyTable(
    records,
    headCells,
    filterFn
  )
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
    //  Initial Data Load
    //
    getRowAllData()
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
    const AxString = `* from users order by u_uid`
    //
    //  Process promise
    //
    const rowCrudparams = {
      AxMethod: 'post',
      AxCaller: debugModule,
      AxTable: 'users',
      AxAction: 'SELECTSQL',
      AxString: AxString,
    }
    var myPromiseGet = apiRowCrud(rowCrudparams)
    //
    //  Resolve Status
    //
    myPromiseGet.then(function (rtnObj) {
      //
      //  No data returned
      //
      if (!rtnObj.rtnValue) return
      //
      //  Data
      //
      const data = rtnObj.rtnRows
      //
      //  Update Table
      //
      setForm_message('')
      setRecords(data)
      //
      //  Filter
      //
      handleSearch()
      return
    })
    return myPromiseGet
  }
  //.............................................................................
  //  Search/Filter
  //.............................................................................
  function handleSearch() {
    setFilterFn({
      fn: items => {
        //
        //  Nothing to search, return rows
        //
        if (searchValue === '') {
          return items
        }
        //
        //  Filter
        //
        let itemsFilter = items
        switch (searchType) {
          case 'u_email':
            itemsFilter = items.filter(x =>
              x.u_email.toLowerCase().includes(searchValue.toLowerCase())
            )
            break
          case 'u_name':
            itemsFilter = items.filter(x =>
              x.u_name.toLowerCase().includes(searchValue.toLowerCase())
            )
            break
          case 'u_user':
            itemsFilter = items.filter(x =>
              x.u_user.toLowerCase().includes(searchValue.toLowerCase())
            )
            break
          case 'u_uid':
            itemsFilter = items.filter(x => x.u_uid === parseInt(searchValue))
            break
          case 'u_fedid':
            itemsFilter = items.filter(x =>
              x.u_fedid.toLowerCase().includes(searchValue.toLowerCase())
            )
            break

          default:
        }
        return itemsFilter
      },
    })
  }
  //.............................................................................
  //  Switch User
  //.............................................................................
  function submitSwitchUser(row) {
    sessionStorageSet({
      caller: debugModule,
      itemName: 'User_User',
      itemValue: row,
    })
    sessionStorageSet({
      caller: debugModule,
      itemName: 'User_UserSwitch',
      itemValue: true,
    })
    //
    //  Force Rebuild History
    //
    sessionStorageSet({
      caller: debugModule,
      itemName: 'Page_History_Rebuild',
      itemValue: true,
    })
    router.push('/QuizHistory')
  }
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      <PageHeader title='Users' subTitle='Switch Users' />
      <Paper
        className={styles.pageContent}
        sx={{
          backgroundColor: BackgroundColor_TABLEPAPER,
        }}
      >
        <Toolbar>
          <MyInput
            label='Search'
            name='Search'
            value={searchValue}
            className={styles.searchInput}
            sx={{
              backgroundColor: BackgroundColor_MYINPUT,
              minWidth: '300px',
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
          <Box className={styles.searchInputTypeBox}>
            <MySelect
              name='SearchType'
              label='Search By'
              value={searchType}
              sx={{
                backgroundColor: BackgroundColor_MYINPUT,
                minWidth: '200px',
              }}
              onChange={e => setSearchType(e.target.value)}
              options={searchTypeOptions}
            />
          </Box>
          {/* .......................................................................................... */}
          <MyButton
            className={styles.buttonfilter}
            text='Filter'
            variant='outlined'
            startIcon={<FilterListIcon />}
            onClick={handleSearch}
          />
          {/* .......................................................................................... */}
          <MyButton
            className={styles.buttonfilter}
            text='Refresh'
            variant='outlined'
            startIcon={<RefreshIcon />}
            onClick={getRowAllData}
          />
          {/*.................................................................................................*/}
          <Box className={styles.messages}>
            <Typography style={{ color: 'red' }}>{form_message}</Typography>
          </Box>
          {/* .......................................................................................... */}
        </Toolbar>
        <TblContainer>
          <TblHead />
          <TableBody
            sx={{
              backgroundColor: BackgroundColor_TABLEBODY,
            }}
          >
            {recordsAfterPagingAndSorting().map(row => (
              <TableRow key={row.u_uid}>
                <TableCell>{row.u_uid}</TableCell>
                <TableCell>{row.u_user}</TableCell>
                <TableCell>{row.u_email}</TableCell>
                <TableCell>{row.u_name}</TableCell>
                <TableCell>{row.u_fedid}</TableCell>
                <TableCell>{row.u_fedcountry}</TableCell>
                <TableCell>{row.u_dftmaxquestions}</TableCell>
                <TableCell>
                  <MyButton
                    startIcon={<SwitchAccountIcon fontSize='small' />}
                    text='Switch'
                    color='warning'
                    onClick={() => submitSwitchUser(row)}
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
