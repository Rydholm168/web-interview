import React from 'react'
import { Box } from '@mui/material'
import { SaveStatus } from '../useDebouncedSave'

const iconStyle = {
  height: '12px',
  marginLeft: '4px',
  width: '12px',
}

const LABELS = {
  [SaveStatus.Saving]: 'Saving...',
  [SaveStatus.Error]: 'Error',
  [SaveStatus.Saved]: (
    <>
      Saved
      <Box component='img' alt='' src='/checkmark.svg' sx={iconStyle} />
    </>
  ),
}

export const SaveStatusLabel = ({ status }) => LABELS[status] ?? null
