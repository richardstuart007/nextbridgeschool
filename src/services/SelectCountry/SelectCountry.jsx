import React, { useState, useEffect } from 'react'
import { Box, TextField, Autocomplete } from '@mui/material'
import Image from 'next/image'
//
//  services
//
import sessionStorageGet from '@/services/sessionStorage/sessionStorageGet'
//
//  Debug Settings
//
import debugSettings from '@/services/debug/debugSettings'
import consoleLogTime from '@/services/debug/consoleLogTime'
let debugLog
const debugModule = 'SelectCountry'
//
//  Constants
//
import { BACKGROUNDCOLOR_MYINPUT } from '@/services/appInit/AppConstants'
//...................................................................................
//.  Main Line
//...................................................................................
export default function SelectCountry(props) {
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
  //
  //  BackgroundColor
  //
  const [BackgroundColor_MYINPUT, SetBackgroundColor_MYINPUT] = useState(BACKGROUNDCOLOR_MYINPUT)
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
    SetBackgroundColor_MYINPUT(App_Env.BACKGROUNDCOLOR_MYINPUT)
  }
  //...................................................................................
  //  Render
  //...................................................................................
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
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
        sx={{ backgroundColor: BackgroundColor_MYINPUT, width: 300 }}
        options={COUNTRIES}
        autoHighlight
        getOptionLabel={option => option.label}
        isOptionEqualToValue={(option, value) => option.label === value.label}
        noOptionsText={'No match'}
        renderOption={(props, option) => (
          <Box component='li' sx={{ '& > img': { mr: 2 } }} {...props}>
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
              autoComplete: 'new-password',
            }}
          />
        )}
      />
    </div>
  )
}
