import {Link} from "react-router-dom"

function Navbar() {
  return (
    <div className="navbar">
        <Link to= "/" className="option" >Ana Sayfa</Link>
        <Link to= "/books" className="option" >Kitaplar</Link>
        <Link to= "/authors" className="option" >Yazarlar</Link>
        <Link to= "/categories" className="option" >Kategoriler</Link>
        <Link to= "/publishers" className="option" >Yayıncılar</Link>
        <Link to= "/borrows" className="option" >Ödünç Alma</Link>

    </div>
  )
}

export default Navbar