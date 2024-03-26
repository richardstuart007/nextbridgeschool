//
//  Libraries
//
import React, { useState, useEffect } from 'react'
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TablePagination,
  TableSortLabel,
} from '@mui/material'
//
//  Services
//
import sessionStorageGet from '/src//services/sessionStorage/sessionStorageGet'
//
//  Debug Settings
//
import debugSettings from '/src//services/debug/debugSettings'
import consoleLogTime from '/src//services/debug/consoleLogTime'
let debugLog = false
const debugModule = 'useMyTable'

let recordsLength = 0
//
//  Constants
//
import { BACKGROUNDCOLOR_TABLEHEAD } from '/src//services/appInit/AppConstants'
//=====================================================================================
export default function useMyTable(records, headCells, filterFn, startPage0, setStartPage0) {
  //
  //  State
  //
  const pages = [8, 100, 200]
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(pages[page])
  const [order, setOrder] = useState()
  const [orderBy, setOrderBy] = useState()
  //
  //  BackgroundColor
  //
  const [BackgroundColor_TABLEHEAD, SetBackgroundColor_TABLEHEAD] =
    useState(BACKGROUNDCOLOR_TABLEHEAD)
  //
  //  First Time
  //
  useEffect(() => {
    clientFirstTime()
    // eslint-disable-next-line
  }, [])

  records ? (recordsLength = records.length) : 0
  //
  //  Start at Page 0
  //
  if (startPage0) {
    setPage(0)
    setStartPage0(false)
  }
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
    SetBackgroundColor_TABLEHEAD(App_Env.BACKGROUNDCOLOR_TABLEHEAD)
  }
  //.....................................................................................
  //. Table Container
  //.....................................................................................
  const TblContainer = props => <Table>{props.children}</Table>
  //.....................................................................................
  //. Table Header
  //.....................................................................................
  const TblHead = props => {
    //
    //  Sort
    //
    const handleSortRequest = cellId => {
      const isAsc = orderBy === cellId && order === 'asc'
      setOrder(isAsc ? 'desc' : 'asc')
      setOrderBy(cellId)
    }
    //
    //  Table Header Row
    //
    return (
      <TableHead
        sx={{
          backgroundColor: BackgroundColor_TABLEHEAD,
        }}
      >
        <TableRow>
          {headCells.map(headCell => (
            <TableCell key={headCell.id} sortDirection={orderBy === headCell.id ? order : false}>
              {headCell.disableSorting ? (
                headCell.label
              ) : (
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : 'asc'}
                  onClick={() => {
                    handleSortRequest(headCell.id)
                  }}
                >
                  {headCell.label}
                </TableSortLabel>
              )}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    )
  }
  //.....................................................................................
  //.  Change Page
  //.....................................................................................
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }
  //.....................................................................................
  //.  Change Rows per page
  //.....................................................................................
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }
  //.....................................................................................
  //.  Pagination
  //.....................................................................................
  const TblPagination = () => (
    <TablePagination
      component='div'
      page={page}
      rowsPerPageOptions={pages}
      rowsPerPage={rowsPerPage}
      count={recordsLength}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      labelRowsPerPage='RPP'
    />
  )
  //.....................................................................................
  //.  Sort Functions
  //.....................................................................................
  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index])
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0])
      if (order !== 0) return order
      return a[1] - b[1]
    })
    return stabilizedThis.map(el => el[0])
  }

  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy)
  }

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1
    }
    if (b[orderBy] > a[orderBy]) {
      return 1
    }
    return 0
  }
  //.....................................................................................
  //.  Filter, Slice a page, sort
  //.....................................................................................
  const recordsAfterPagingAndSorting = () => {
    if (!records) return
    return stableSort(filterFn.fn(records), getComparator(order, orderBy)).slice(
      page * rowsPerPage,
      (page + 1) * rowsPerPage
    )
  }
  //.....................................................................................
  //.  Return Values
  //.....................................................................................
  return {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting,
  }
}
