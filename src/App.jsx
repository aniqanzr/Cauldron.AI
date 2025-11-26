import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout"; 
import Dashboard from "./pages/Dashboard";

// We will uncomment these one by one to be safe, 
// but Dashboard should work immediately now.
import Inventory from "./pages/Inventory";
import AddItem from "./pages/AddItem";
import Recipes from "./pages/Recipes";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/add-item" element={<AddItem />} />
          <Route path="/recipes" element={<Recipes />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;