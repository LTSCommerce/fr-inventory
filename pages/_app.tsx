import '../styles/globals.css'
import type { AppProps } from 'next/app'
import * as React from 'react'
import CssBaseline from '@mui/material/CssBaseline'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <React.Fragment>
      <CssBaseline />
      <Component {...pageProps} />
    </React.Fragment>
  )
}
