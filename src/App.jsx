import {Routes, Route} from 'react-router-dom'  //HashRouter
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Books from './pages/Books'
import Authors from './pages/Authors'
import Categories from './pages/Categories'
import Publishers from './pages/Publishers'
import Borrows from './pages/Borrows'


function App() {
 

  return (
    <div className="container" >
      <h1>KİTAPHANE</h1> 
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />  
        <Route path="/books" element={<Books/>} />
        <Route path="/authors" element={<Authors />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/publishers" element={<Publishers />} />
        <Route path="/borrows" element={<Borrows />} />
      </Routes>
      <ToastContainer /> {/* Toast mesajlarını göstermek için */}

    </div>
  )
}

export default App
