import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import Router from "./routes/Router.jsx";

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
