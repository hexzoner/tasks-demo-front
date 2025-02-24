
export const sLoginPage = {
    paddingTop: "12rem"
}

export const sLoginSection = {
    maxWidth: "640px", margin: "auto", backgroundColor: "var(--gray-a2)", borderRadius: "var(--radius-3)",
    paddingTop: "0rem", paddingBottom: "4rem", boxShadow: "var(--shadow-2)", border: "1px solid var(--gray-a4)",
}

export const sButtonSubmit = { cursor: "pointer", marginTop: "1rem", padding: "1rem 2rem" }
export const sButton = { cursor: "pointer" }
export const sFormContainer = { margin: "auto", maxWidth: "250px" }
export const sHeader = { textAlign: "center", fontSize: "1.5rem" }

export const activeColor = "#b63c3e"; export const navLinkClass = ({ isActive }: { isActive: boolean }) => `px-6 py-2 hover:underline ${isActive ? `bg-blue-800` : ""} `;
export const formTextError = "text-red-500 text-xs text-left mt-0 ml-2 absolute"
export const textError = "text-red-400 font-thin text-sm"
export const textSuccess = "text-green-400 font-thin text-sm"
export const inputClass = "Input bg-[#282f3d] px-3 py-2 text-sm font-light w-full my-1"
export const buttonStyleDefault = "cursor-pointer bg-[#282f3d] text-white px-4 py-2 hover:opacity-85";
export const centerScreenStyle = "flex justify-center items-center h-screen";
export const mainColorBg = "bg-[#18202f]"
export const secondaryColorBg = "bg-gray-900"
export const textColor = "text-gray-400"
