import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import "./shared/styles/index.css";

import App from "./app/App";

import { store } from "./app/store/store";

createRoot(
  document.getElementById("root")!
).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
);