import Blog from 'pages/blog'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <div className='App'>
      <ToastContainer />
      <Blog />
    </div>
  )
}

export default App
