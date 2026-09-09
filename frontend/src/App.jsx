import React from "react";
import { Outlet } from "react-router";
import "./App.css";

function App() {
  return (
    <div className="app-shell">
      <div className="page-frame">
        <header className="topbar">
          <div className="brand-wrap">
            <div className="brand-mark" aria-hidden="true">
              <span className="brand-eye" />
            </div>
            <div className="brand-text">
              <span className="brand-title">Train Item Checker</span>
            </div>
          </div>

          <span className="status-pill">Travel safety</span>
        </header>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;
