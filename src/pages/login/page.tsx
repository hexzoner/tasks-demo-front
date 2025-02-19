import { FC } from 'react';
import { Flex, TextField, Section, Button } from "@radix-ui/themes"
import { sLoginSection, sLoginPage, sButtonSubmit } from "../../styles/styles"
import LoadingSpinner from '../../components/LoadingSpinner';
import { loginMutation } from '../../api/auth';

const loginData = {
    email: "aaa",
    password: "1234"
}

export const Page: FC = () => {
    const login = loginMutation()

    function handleLogin() {
        login.mutate(loginData)
    }

    if (login.isPending) return <LoadingSpinner />

    return <div className='min-h-screen ' style={sLoginPage}>
        <Section style={sLoginSection} className='w-full'>
            <p style={{ textAlign: "center", fontSize: "1.5rem", padding: "1rem" }}>Login</p>
            <Flex direction="column" gap="3" maxWidth="250px" style={{ margin: "auto" }}>
                <TextField.Root color="gray" variant="soft" placeholder="Email Address" />
                <TextField.Root color="gray" variant="soft" placeholder="Password" />
                <Button onClick={handleLogin} color="green" variant="soft" style={sButtonSubmit}>Submit</Button>
                <div className='text-center'>
                    {login.isError ? (<div className='text-red-400 font-thin text-sm'>{login.error.response.data.errors[0].name} - {login.error.response.data.errors[0].message}</div>) : null}
                    {login.isSuccess ? (<div className='text-green-400 font-thin text-sm'>Login successful</div>) : null}
                </div>
            </Flex>
        </Section>
    </div >
};

export default Page;
