import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AddItem from "./pages/AddItem";
import ViewItems from "./pages/ViewItems";
import Navbar from "./layout/Navbar";
import {ToastContainer} from 'react-toastify'
function App() {
  return (
    <Router>
      <div className="fixed top-0 left-0 w-full z-50 ">

      <Navbar />
      </div>
      <div className="p-4 mt-16">
        <Routes>
          <Route path="/" element={<ViewItems />} />
          <Route path="/add" element={<AddItem />} />
        </Routes>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"/>
    </Router>
  );
}

export default App;
