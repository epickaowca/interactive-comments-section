import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UserProvider } from "../src/context/user";
import { CommentsProvider } from "../src/context/comment";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <UserProvider>
      <CommentsProvider>
        <App />
      </CommentsProvider>
    </UserProvider>
  </React.StrictMode>
);
