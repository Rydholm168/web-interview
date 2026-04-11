import React from 'react'
import { Box } from '@mui/material'
import { TodoLists } from './todos/components/TodoLists'

const headerWrapperStyle = {
  alignItems: 'center',
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #e7e3dc',
  display: 'flex',
  height: '65px',
  justifyContent: 'center',
  padding: '0 1.5rem',
}

const headerContentStyle = {
  alignItems: 'center',
  display: 'flex',
  maxWidth: '80rem',
  width: '100%',
}

const logoStyle = {
  display: 'block',
  height: '54px',
  maxWidth: '100%',
  objectFit: 'contain',
  transform: 'translateY(10px)',
}

const MainHeader = () => {
  return (
    <header style={headerWrapperStyle}>
      <Box style={headerContentStyle}>
        <img alt='Things to do' src='/final-things-to-do-logo-black.png' style={logoStyle} />
      </Box>
    </header>
  )
}

const mainWrapperStyle = {
  backgroundColor: '#f5f5f2',
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
}
const centerContentWrapper = { display: 'flex', justifyContent: 'center' }
const contentWrapperStyle = {
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '80rem',
  flexGrow: 1,
  width: '100%',
}
const MainWrapper = ({ children }) => {
  return (
    <div style={mainWrapperStyle}>
      <MainHeader />
      <div style={centerContentWrapper}>
        <div style={contentWrapperStyle}>{children}</div>
      </div>
    </div>
  )
}

const App = () => {
  return (
    <MainWrapper>
      <TodoLists style={{ margin: '1rem' }} />
    </MainWrapper>
  )
}

export default App
