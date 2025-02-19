import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthContextProvider } from "../context";

const MainLayout = () => {
  return (
    <>
      <div className="font-nunito font-medium bg-[#f5f6fa]">
        <AuthContextProvider>
          <Navbar />
          <Outlet />
        </AuthContextProvider>
        <Footer />
        {/* <Toast /> */}
      </div>
    </>
  );
};
export default MainLayout;