import React from 'react'
import { createRoot } from 'react-dom/client'

import { Timeline } from '.'

const container = document.getElementById('root')
const root = createRoot(container!)

root.render(
  <React.StrictMode>
    <div>Hello</div>
    <div style={{ width: "100vw", height: "100vh", padding: 0, margin: 0 }}>
      <Timeline width={800} height={600} />
    </div>
  </React.StrictMode>
);