//
//  Libraries
//
import React from 'react'
import { Paper, Card, Typography } from '@mui/material'

//=====================================================================================
export default function PageHeader(props) {
  //
  //  Deconstruct the props
  //
  const { title, subTitle, icon } = props
  //...................................................................................
  return (
    <Paper elevation={0} square>
      <div>
        <Card>{icon}</Card>
        <div>
          <Typography variant='h6'>{title}</Typography>
          <Typography variant='subtitle2'>{subTitle}</Typography>
        </div>
      </div>
    </Paper>
  )
}
