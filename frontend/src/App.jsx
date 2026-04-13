import React from 'react'
import { Box } from '@mui/material'
import { TodoLists } from './todos/components/TodoLists'
import { assetUrl } from './assetUrl'

const App = () => {
  return (
    <MainWrapper>
      <TodoLists />
    </MainWrapper>
  )
}

const MainWrapper = ({ children }) => {
  return (
    <div style={mainWrapperStyle}>
      <MainHeader />
      <main style={contentWrapperStyle}>{children}</main>
    </div>
  )
}

const MainHeader = () => {
  return (
    <header style={headerWrapperStyle}>
      <Box style={headerContentStyle}>
        <img
          alt='Things to do'
          src={assetUrl('final-things-to-do-logo-black.png')}
          style={logoStyle}
        />
      </Box>
    </header>
  )
}

const headerWrapperStyle = {
  alignItems: 'center',
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #e7e3dc',
  display: 'flex',
  height: '65px',
  justifyContent: 'flex-start',
  padding: '0 32px',
}

const headerContentStyle = {
  alignItems: 'center',
  display: 'flex',
}

const logoStyle = {
  display: 'block',
  height: '54px',
  marginLeft: '-10px',
  maxWidth: '100%',
  objectFit: 'contain',
  transform: 'translateY(10px)',
}

const mainWrapperStyle = {
  backgroundColor: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
}
const contentWrapperStyle = {
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  padding: '1.5rem 32px',
  width: '100%',
}

export default App
