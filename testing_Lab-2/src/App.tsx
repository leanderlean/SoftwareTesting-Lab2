import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignUp from "./components/signup-page/signup-page";
import Login from "./components/login-page/login-page";
import AddNote from "./components/add-notes/add-notes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/add-notes" element={<AddNote />} />
      </Routes>
    </Router>
  );
}

export default App;
