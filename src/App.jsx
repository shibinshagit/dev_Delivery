import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { SignUp } from "./pages/auth";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { PrivateRoute, IsAuthenticated } from "./helpers/protect";

function App() {
  return (
    <Provider store={store}>
    <Routes>
      <Route path="/" element={<IsAuthenticated><SignUp/></IsAuthenticated>}/>
      <Route path="/dashboard/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/auth/*" element={<isAuthenticated><Auth/></isAuthenticated>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </Provider>
  );
}

export default App;
