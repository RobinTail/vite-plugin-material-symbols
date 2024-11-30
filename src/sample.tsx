import React from "react";
import ReactDOM from "react-dom/client";

const Icon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span>{children}</span>
);

const Test = () => (
  <div>
    <Icon>home</Icon>
    <Icon>chevron_right</Icon>
    <Icon>comment</Icon>
  </div>
);

const root = document.getElementById("root");
if (root)
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Test />
    </React.StrictMode>,
  );
