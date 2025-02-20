import { FC } from 'react';
// import { Flex, TextField, Section, Button } from "@radix-ui/themes"
// import { sLoginSection, sLoginPage, sButtonSubmit } from "../../styles/styles"

import { getTasksQuery } from '../../api/tasks';

const centerScreenStyle = "flex justify-center items-center h-screen";

export const Page: FC = () => {
    const { data, isLoading, isError } = getTasksQuery();

    if (isError) return <div className={centerScreenStyle}>Error fetching tasks...</div>
    if (data) console.log(data);

    return <div className='min-h-screen '>
        <p className='text-2xl text-center mt-8'>Dashboard</p>
        <div className='flex justify-center items-center gap-4 mt-8'>
            {isLoading ? <p className='text-xl'>Loading tasks...</p> : <p className='text-xl'>Total Tasks: {data?.totalDocs}</p>}
        </div>
    </div>
};

export default Page;
