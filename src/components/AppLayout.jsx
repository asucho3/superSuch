import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function AppLayout() {
  return (
    <>
      <div className="flex w-screen h-screen">
        <div className="h-full max-w-[14rem]">
          <Sidebar />
        </div>
        <div className="flex-grow h-full">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default AppLayout;
