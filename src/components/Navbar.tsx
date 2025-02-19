import { Button } from "@radix-ui/themes";
import { sButton } from "../styles/styles";

export default function Navbar() {
    return (
        <div className="bg-[#1f3041]  p-5 flex justify-between px-20">
            <p className="italic font-sans font-semibold text-xl">Task Manager</p>
            <div className="flex gap-5">
                <Button style={sButton} > Login </Button>
                <Button style={sButton} > SignUp </Button>
            </div>
        </div>
    );
}
