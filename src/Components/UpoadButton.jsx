import { Button } from '@mui/material'
import React from 'react'

const UploadButton = ({disabled,onClick}) => {
    return (
       <Button disabled={disabled} onClick={onClick} variant='outlined' color='primary' >Upload</Button>
    )
}

export default UploadButton
