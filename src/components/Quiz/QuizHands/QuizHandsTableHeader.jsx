//
//  Libraries
//
import React from 'react'
import { TableCell, TableHead, TableRow } from '@mui/material'
import Image from 'next/image'
import styles from './quizhandstableheader.module.css'
//...................................................................................
//.  Main Line
//...................................................................................
export default function QuizHandsTableHeader() {
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      <TableHead style={{ backgroundColor: 'Gray' }}>
        <TableRow>
          <TableCell sx={{ padding: '0px' }} align='left' style={{ width: 100 }}></TableCell>
          <TableCell sx={{ padding: '0px' }} align='left' style={{ width: 100 }}>
            <Image src='/spade.svg' width={15} height={15} className={styles.icon} alt='spade' />
          </TableCell>
          <TableCell sx={{ padding: '0px' }} align='left' style={{ width: 100 }}>
            <Image src='/heart.svg' width={15} height={15} className={styles.icon} alt='heart' />
          </TableCell>
          <TableCell sx={{ padding: '0px' }} align='left' style={{ width: 100 }}>
            <Image
              src='/diamond.svg'
              width={15}
              height={15}
              className={styles.icon}
              alt='diamond'
            />
          </TableCell>
          <TableCell sx={{ padding: '0px' }} align='left' style={{ width: 100 }}>
            <Image src='/club.svg' width={15} height={15} className={styles.icon} alt='club' />
          </TableCell>
        </TableRow>
      </TableHead>
    </>
  )
}
