import { Spinner } from "@radix-ui/themes";

export default function LoadingSpinner() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Spinner style={{ height: '3rem' }} />
        </div>
    )
}