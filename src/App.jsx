import { BrowserRouter, Routes, Route } from "react-router-dom";
import VideoUpload from "./component/VideoUpload";
import Home from "./pages/Home";
import Navbar from "./component/Navbar";
import Gallery from "./pages/Gallery";
import OwnedColl from "./pages/OwnedColl";
import VideoPage from "./pages/VideoPage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Web3provider } from "./api/contextapi";

function App() {
  return (
    <>
      <Web3provider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/gallery" element={<Gallery />}></Route>
            <Route path="/upload" element={<VideoUpload />}></Route>
            <Route path="/collection" element={<OwnedColl />}></Route>
            <Route path="/video/:tid" element={<VideoPage />}></Route>
          </Routes>
          <ToastContainer />
        </BrowserRouter>
      </Web3provider>
    </>
  );
}

export default App;
