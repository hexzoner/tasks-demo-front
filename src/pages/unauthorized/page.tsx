import { FC } from 'react';

export const Page: FC = () => {
    return (
        <div className="h-screen flex justify-center items-center w-full">
            <h1 className="text-4xl">Unauthorized: no permissions to access this page</h1>
        </div>
    );
};

export default Page;
