import { NavLink } from "react-router-dom";
import { navLinkClass } from "../styles/styles";

export default function Navbar() {


    return (
        <div className="bg-[#1f3041]  p-5 flex justify-between px-20">
            <p className="italic font-sans font-semibold text-xl">Task Manager</p>
            <div className="flex gap-5">
                <NavLink to="/login" className={navLinkClass}>
                    Login
                </NavLink>
                <NavLink to="/signup" className={navLinkClass}>
                    Signup
                </NavLink>
            </div>
        </div>
    );
}
