import './App.css'
import Sticky from './Sticky'
import SelectedSticky from './SelectedSticky'

function App() {
  return (
    <div className="wrap">
      <div className="container">
        <Sticky />
        <div style={{ margin: '2em' }}></div>
        <SelectedSticky />
      </div>
    </div>
  )
}

export default App;
