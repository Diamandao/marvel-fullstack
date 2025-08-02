import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Characters from "./pages/Characters";
import Comics from "./pages/Comics";
import Favorites from "./pages/Favorites";
import CharacterDetails from "./pages/CharacterDetails";
import ComicDetails from "./pages/ComicDetails";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Characters />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/comics" element={<Comics />} />{" "}
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/character/:id" element={<CharacterDetails />} />
        <Route path="/comic/:id" element={<ComicDetails />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

export default App;
