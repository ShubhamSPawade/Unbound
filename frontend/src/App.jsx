import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>Home</h1>} />
      <Route path="/about" element={<h1>About</h1>} />
      <Route path="/contact" element={<h1>Contact</h1>} />
      <Route path="/login" element={<h1>Login</h1>} />
      <Route path="/signup" element={<h1>Signup</h1>} />
      <Route path="/dashboard" element={<h1>Dashboard</h1>} />
    </Routes>
  );
}

export default App;