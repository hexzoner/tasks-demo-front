

export default function Footer() {
    return (
        <div className="bg-[#1f3041] text-neutral-content p-10 ">
            <footer className="max-w-screen-xl m-auto flex justify-around">
                <aside>
                    <div className="text-lg">
                        <p>Task Management Demo</p>
                        <p className="font-semibold text-base">{new Date().getFullYear()}</p>
                    </div>
                </aside>
            </footer>
        </div>
    );
}
