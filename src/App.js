import "./App.css";
import CreatePlante from "./components/User/CreatePlante";
import ShowPlante from "./components/User/ShowPlante";
import ShowMyPlante from "./components/User/ShowMyPlante";
import { Route, Routes } from "react-router-dom";
import EditPlante from "./components/User/EditPlante";
import Header from "./components/Common/Header";
import Home from "./components/Layout/Home";
import Authentification from "./components/User/Authentification"
function App() {
  return (
    <div className="App">
      <header className="container">
        <div className="">
          <Header />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/edit-plante/:id" element={<EditPlante />} />
            <Route path="/create-plante" element={<CreatePlante />} />
            <Route path="/show-plante" element={<ShowPlante />} />
            <Route path="/show-my-plante" element={<ShowMyPlante />} />
            <Route path="/authentification" element={<Authentification />} />
          </Routes>

        </div>
      </header>
    </div>
  );
}

export default App;
