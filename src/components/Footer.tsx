

export default function Footer() {
    return (
        <div className="bg-[#18202f] text-neutral-content p-5 ">
            <footer className="max-w-screen-xl m-auto flex justify-around">
                <aside>
                    <div className="text-lg items-center gap-4">
                        <p className="italic font-sans font-semibold text-xl">Task Manager</p>
                        <p className="font-sans font-semibold text-xl text-center">{new Date().getFullYear()}</p>
                    </div>
                </aside>
            </footer>
        </div>
    );
}
