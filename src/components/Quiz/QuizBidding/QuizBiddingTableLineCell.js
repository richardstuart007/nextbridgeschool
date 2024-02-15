import TableCell from '@mui/material/TableCell'
//
//  Libraries
//
import React from 'react'
import { Typography, Grid } from '@mui/material'
import Image from 'next/image'
import styles from './quizbiddingtablelinecell.module.css'
//...................................................................................
//.  Main Line
//...................................................................................
export default function QuizBiddingTableLineCell(props) {
  //
  //  Destructure props
  //
  const { bqid, suit, cell } = props

  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      {/* .......................................................................................... */}
      {/*  Bid & Suit                                                                               */}
      {/* .......................................................................................... */}
      <TableCell key={cell} sx={{ padding: '0px' }} style={{ width: 50 }}>
        <Grid container direction='row' justifyContent='center' alignItems='center'>
          {/* .......................................................................................... */}
          {/*  Bid                                                                               */}
          {/* .......................................................................................... */}
          <Grid item>
            <Typography variant='body2'>{bqid}</Typography>
          </Grid>
          {/* .......................................................................................... */}
          {/*  Suit Symbol                                                                               */}
          {/* .......................................................................................... */}
          {suit !== null && (
            <Grid item>
              {suit === 'S' ? (
                <Image
                  src='/spade.svg'
                  width={15}
                  height={15}
                  className={styles.icon}
                  alt='spade'
                />
              ) : suit === 'H' ? (
                <Image
                  src='/heart.svg'
                  width={15}
                  height={15}
                  className={styles.icon}
                  alt='heart'
                />
              ) : suit === 'D' ? (
                <Image
                  src='/diamond.svg'
                  width={15}
                  height={15}
                  className={styles.icon}
                  alt='diamond'
                />
              ) : suit === 'C' ? (
                <Image src='/club.svg' width={15} height={15} className={styles.icon} alt='club' />
              ) : null}
            </Grid>
          )}

          {/* .......................................................................................... */}
        </Grid>
      </TableCell>
      {/* .......................................................................................... */}
    </>
  )
}
