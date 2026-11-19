import { Outlet } from "react-router";
import "./TestLayout.css";
import Header from "@/app/layouts/HeaderLayout.jsx";
import StepSidebar from "@/app/layouts/StepSidebar.jsx";

function TestLayout() {
  return (
    <>
      <Header />
      <div className="TestLayout_main">
        <StepSidebar />
        <main className="TestLayout_main_content">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default TestLayout;
