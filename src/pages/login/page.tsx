import { FC } from 'react';
import { useForm } from "react-hook-form";
import { Flex, Section, Button } from "@radix-ui/themes"
import { Form } from "radix-ui";
import { sLoginSection, sButtonSubmit } from "../../styles/styles"
import LoadingSpinner from '../../components/LoadingSpinner';
import { loginMutation } from '../../api/auth';
import { formTextError, textError, textSuccess, inputClass } from '../../styles/styles';
import { useNavigate } from 'react-router-dom';

interface Login {
    email: string;
    password: string;
}

export const Page: FC = () => {

    const nav = useNavigate()

    async function onSuccess() {
        // console.log(data.data.token)
        // console.log(data.data.user)
        //redirect user to dashboard
        nav('/dashboard')
    }

    const login = loginMutation(onSuccess)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Login>();

    function handleLogin(data: Login) {
        // console.log(data)
        login.mutate(data)
    }

    if (login.isPending) return <LoadingSpinner />

    return <div className='min-h-screen mt-36'>
        <Section style={sLoginSection} className='w-full mx-auto'>
            <p style={{ textAlign: "center", fontSize: "1.5rem", padding: "1rem" }}>Login</p>
            <Form.Root onSubmit={handleSubmit(handleLogin)} className="FormRoot">
                <Flex direction="column" gap="5" maxWidth="250px" style={{ margin: "auto" }}>

                    <Form.Field className="FormField" name="email">
                        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", }}>
                            <Form.Label className="FormLabel">Email</Form.Label>
                        </div>
                        <Form.Control asChild>
                            <input
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^\S+@\S+$/i,
                                        message: "Invalid email address",
                                    },
                                })}
                                className={inputClass} type="email" required placeholder='Enter your email' />
                        </Form.Control>
                        {errors.email && <p className={formTextError}>{errors.email.message?.toString()}</p>}
                    </Form.Field>

                    <Form.Field className="FormField" name="password">
                        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", }}>
                            <Form.Label className="FormLabel">Password</Form.Label>
                        </div>
                        <Form.Control asChild>
                            <input
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 4,
                                        message: "Password must be at least 4 characters",
                                    },
                                })}
                                className={inputClass} type="password" required placeholder='Enter your password' />
                        </Form.Control>
                        {errors.password && <p className={formTextError}>{errors.password.message?.toString()}</p>}
                    </Form.Field>

                    <Button type='submit' color="green" variant="soft" style={sButtonSubmit}>Submit</Button>
                    <div className='text-center'>
                        {login.isError ? (<div className={textError}>Error: {login.error.response.data.errors[0].message}</div>) : null}
                        {login.isSuccess ? (<div className={textSuccess}>Login successful</div>) : null}
                    </div>
                </Flex>
            </Form.Root>
        </Section>
    </div >
};

export default Page;
