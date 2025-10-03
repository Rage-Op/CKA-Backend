import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import Add from "./pages/Add";
import Update from "./pages/Update";
import Fees from "./pages/Fees";
import Delete from "./pages/Delete";
import Print from "./pages/Print";
import Settings from "./pages/Settings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/search"
          element={
            <Layout>
              <Search />
            </Layout>
          }
        />
        <Route
          path="/add"
          element={
            <Layout>
              <Add />
            </Layout>
          }
        />
        <Route
          path="/update"
          element={
            <Layout>
              <Update />
            </Layout>
          }
        />
        <Route
          path="/fees"
          element={
            <Layout>
              <Fees />
            </Layout>
          }
        />
        <Route
          path="/delete"
          element={
            <Layout>
              <Delete />
            </Layout>
          }
        />
        <Route
          path="/print"
          element={
            <Layout>
              <Print />
            </Layout>
          }
        />
        <Route
          path="/settings"
          element={
            <Layout>
              <Settings />
            </Layout>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
