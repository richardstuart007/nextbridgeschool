import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
//
//  Debug Settings
//
import debugSettings from '@/services/debug/debugSettings'
import consoleLogTime from '@/services/debug/consoleLogTime'
let debugLog
const debugModule = 'MyAutocomplete'
//...................................................................................
//.  Main Line
//...................................................................................
export default function MyAutocomplete(props) {
  //
  //  Debug Settings
  //
  debugLog = debugSettings()
  //
  //  Deconstruct
  //
  const { searchLable, onChange, fieldname, optionId, options, required, fullWidth, className } =
    props
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
  //
  //  Add empty element
  //
  let w_options = { ...options }
  if (!required) {
    const NoSelect = [{ id: '', title: '' }]
    w_options = NoSelect.concat(options)
  }
  //
  //  Object
  //
  let Obj = { id: '', title: '' }
  if (optionId) {
    Obj = w_options.find(obj => obj.id === optionId)
  }
  //
  //  State
  //
  const [selectedObj, setSelectedObj] = useState(Obj)
  const [inputValue, setInputValue] = useState(Obj.title)
  //
  //  On change of record, set State
  //
  useEffect(() => {
    setSelectedObj(Obj)
    setInputValue(Obj.title)
    // eslint-disable-next-line
  }, [optionId])
  //...................................................................................
  //  Render
  //...................................................................................
  return (
    <Autocomplete
      value={selectedObj}
      onChange={(event, newSelected) => {
        setSelectedObj(newSelected)
        if (newSelected) {
          onChange(newSelected.id, fieldname)
        }
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue)
      }}
      id='myAutocomplete'
      // sx={{ width: 300 }}
      options={w_options}
      autoHighlight
      fullWidth={fullWidth}
      getOptionLabel={option => option.title}
      isOptionEqualToValue={(option, value) => option.title === value.title}
      noOptionsText={'No match'}
      renderOption={(props, option) => (
        <Box component='li' {...props}>
          {option.title} ({option.id})
        </Box>
      )}
      renderInput={params => (
        <TextField
          {...params}
          label={searchLable}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password', // disable autocomplete and autofill
          }}
        />
      )}
    />
  )
}
