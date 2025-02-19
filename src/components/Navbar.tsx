import { NavLink } from "react-router-dom";
import { navLinkClass } from "../styles/styles";
import { useAuth } from "../context";
// import { logoutMutation } from "../api/auth";

export default function Navbar() {
    const { user, isAuthenticated, setAuthUser } = useAuth();

    // const logout = logoutMutation();

    return (
        <div className="bg-[#18202f]  p-5 flex justify-between px-20">
            <p className="italic font-sans font-semibold text-xl">Task Manager</p>
            {user && <p className="text-white">Welcome, {user.firstName}</p>}
            <div className="flex gap-5">
                {isAuthenticated ? <div className="flex gap-4">
                    <NavLink to="/dashboard" className={navLinkClass}>
                        Dashboard
                    </NavLink>
                    <button onClick={() => setAuthUser(null)} className="cursor-pointer bg-[#282f3d] text-white px-4 py-2 ">
                        Logout
                    </button>
                </div> :
                    <div>
                        <NavLink to="/login" className={navLinkClass}>
                            Login
                        </NavLink>
                        <NavLink to="/register" className={navLinkClass}>
                            SignUp
                        </NavLink>
                    </div>
                }
            </div>
        </div>
    );
}
