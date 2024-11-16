import { useState } from 'react'
import Piano from './components/Piano'
import Kalimba from './components/Kalimba'
import Xylophone from './components/Xylophone'
import { InstrumentType } from './types/types'
import './App.css'

function App() {
  const [selectedInstrument, setSelectedInstrument] = useState<InstrumentType>('piano')

  return (
    <div className="app">
      <h1>虛擬樂器</h1>
      <div className="instrument-selector">
        <button 
          className={selectedInstrument === 'piano' ? 'active' : ''}
          onClick={() => setSelectedInstrument('piano')}
        >
          鋼琴
        </button>
        <button 
          className={selectedInstrument === 'kalimba' ? 'active' : ''}
          onClick={() => setSelectedInstrument('kalimba')}
        >
          卡林巴琴
        </button>
        <button 
          className={selectedInstrument === 'xylophone' ? 'active' : ''}
          onClick={() => setSelectedInstrument('xylophone')}
        >
          木琴
        </button>
      </div>
      
      <div className="instrument-display">
        {selectedInstrument === 'piano' && <Piano />}
        {selectedInstrument === 'kalimba' && <Kalimba />}
        {selectedInstrument === 'xylophone' && <Xylophone />}
      </div>
    </div>
  )
}

export default App
