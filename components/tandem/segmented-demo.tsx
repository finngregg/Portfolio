'use client'

import { useState } from 'react'
import { Segmented } from './segmented'

// The session page's Details / Map switch, with a stand-in for each view
export function SegmentedDemo() {
  const [view, setView] = useState<'details' | 'map'>('details')
  return (
    <div className="flex flex-col items-center gap-6">
      <Segmented
        label="Session view"
        options={[
          { id: 'details', label: 'Details' },
          { id: 'map', label: 'Map' },
        ]}
        value={view}
        onChange={setView}
      />
      <p key={view} className="pin-in font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
        {view === 'details' ? 'Sat 07:00 · 21 km · 5:30 /km' : 'Meet at the Tayelet, Gordon Beach'}
      </p>
    </div>
  )
}
