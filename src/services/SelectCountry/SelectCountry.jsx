import React, { useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import Image from 'next/image'
//
//  Debug Settings
//
import debugSettings from '@/services/debug/debugSettings'
import consoleLogTime from '@/services/debug/consoleLogTime'
let debugLog
const debugModule = 'SelectCountry'
//...................................................................................
//.  Main Line
//...................................................................................
export default function SelectCountry(props) {
  //
  //  Debug Settings
  //
  debugLog = debugSettings()
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
  //
  //  Deconstruct
  //
  const { label, onChange, countryCode, disabled = false } = props
  //
  //  Countries
  //
  const { COUNTRIES } = require('@/services/SelectCountry/countries.js')
  let countryObj = COUNTRIES.find(country => country.code === countryCode)
  if (!countryObj) {
    countryObj = { code: 'ZZ', label: 'World', phone: '999' }
  }
  //
  //  State
  //
  const [selected, setSelected] = useState(countryObj)
  const [inputValue, setInputValue] = useState(countryObj.label)
  //...................................................................................
  //  Render
  //...................................................................................
  return (
    <Autocomplete
      disabled={disabled}
      value={selected}
      onChange={(event, newSelected) => {
        setSelected(newSelected)
        if (newSelected) {
          onChange(newSelected.code)
        }
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue)
      }}
      id='country-select'
      sx={{ width: 300 }}
      options={COUNTRIES}
      autoHighlight
      getOptionLabel={option => option.label}
      isOptionEqualToValue={(option, value) => option.label === value.label}
      noOptionsText={'No match'}
      renderOption={(props, option) => (
        <Box component='li' sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
          <Image
            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
            width={20}
            height={20}
            alt='flag'
            loading='lazy'
            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
          />
          {option.label} ({option.code}) +{option.phone}
        </Box>
      )}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password', // disable autocomplete and autofill
          }}
        />
      )}
    />
  )
}
