import React from "react";
import { Outlet } from "react-router";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header/>
      <div className="flex-1">
        <Outlet></Outlet>
      </div>
      <Footer />
    </div>
  );
}
