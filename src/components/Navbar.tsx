import { NavLink } from "react-router-dom";
import { navLinkClass, buttonStyleDefault } from "../styles/styles";
import { useAuth } from "../context";
// import { logoutMutation } from "../api/auth";



export default function Navbar() {
    const { user, isAuthenticated, setAuthUser, authLoading } = useAuth();

    // const logout = logoutMutation();
    if (authLoading) return null;

    return (
        <div className="bg-[#18202f]  p-5 flex justify-between px-20 items-center">
            <p className="italic font-sans font-semibold text-xl">Task Manager</p>
            {user && <p className="text-white">{user && user.firstName ? `Welcome, ${user.firstName}! (${user.email})` : `You are logged in as: ${user.email}`}</p>}
            <div className="flex gap-5">
                {isAuthenticated ? <div className="flex gap-4">
                    <NavLink to="/create-task" className={navLinkClass}>
                        Create Task
                    </NavLink>
                    <NavLink to="/dashboard" className={navLinkClass}>
                        Dashboard
                    </NavLink>
                    <button onClick={() => setAuthUser(null)} className={buttonStyleDefault + " hover:underline"}>
                        Logout
                    </button>
                </div> :
                    <div>
                        <NavLink to="/login" className={navLinkClass}>
                            Login
                        </NavLink>
                        <NavLink to="/signup" className={navLinkClass}>
                            SignUp
                        </NavLink>
                    </div>
                }
            </div>
        </div>
    );
}
