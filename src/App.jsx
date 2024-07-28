import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { SignIn, SignUp } from "./pages/auth";
import PrivateRoute from "./helpers/protect";
import { Provider } from "react-redux";
import { store } from "./redux/store";

function App() {
  return (
    <Provider store={store}>
    <Routes>
      <Route path="/" element={<SignUp />}/>
      <Route path="/dashboard/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </Provider>
  );
}

export default App;
