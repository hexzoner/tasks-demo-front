import { FC } from 'react';
import { useForm } from "react-hook-form";
import { Flex, Section, Button } from "@radix-ui/themes"
import { Form } from "radix-ui";
import { sLoginSection, sButtonSubmit } from "../../styles/styles"
import LoadingSpinner from '../../components/LoadingSpinner';
import { signUpMutation, SignUp } from '../../api/auth';
import { formTextError, textError, textSuccess, inputClass } from '../../styles/styles';
import { useNavigate } from 'react-router-dom';

export const Page: FC = () => {
    const nav = useNavigate()

    function onSuccess(data: any) {
        console.log(data.data.token)
        console.log(data.data.user)
        //redirect user to dashboard
        nav('/dashboard')
    }

    const signup = signUpMutation(onSuccess)

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<SignUp>();

    function handleSignup(data: SignUp) {
        if (data.password !== data.repeatPassword) {
            setError("repeatPassword", {
                type: "manual",
                message: "Passwords do not match",
            });
            return;
        }
        signup.mutate(data);
    }

    if (signup.isPending) return <LoadingSpinner />

    // if (signup.error.response.data.errors[0].data.errors[0])
    //     console.log(signup.error.response.data.errors[0].data.errors[0].message)

    return <div className='min-h-screen mt-12' >
        <Section style={sLoginSection} className='w-full mx-auto'>
            <p style={{ textAlign: "center", fontSize: "1.5rem", padding: "1rem" }}>Create Account</p>
            <Form.Root onSubmit={handleSubmit(handleSignup)} className="FormRoot">
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

                    <Form.Field className="FormField" name="firstName">
                        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", }}>
                            <Form.Label className="FormLabel">First Name (optional)</Form.Label>
                        </div>
                        <Form.Control asChild>
                            <input
                                {...register("firstName")}
                                className={inputClass} type="text" placeholder='Enter your first name' />
                        </Form.Control>
                        {errors.firstName && <p className={formTextError}>{errors.firstName.message?.toString()}</p>}
                    </Form.Field>

                    <Form.Field className="FormField" name="lastName">
                        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", }}>
                            <Form.Label className="FormLabel">Last Name (optional)</Form.Label>
                        </div>
                        <Form.Control asChild>
                            <input
                                {...register("lastName")}
                                className={inputClass} type="text" placeholder='Enter your last name' />
                        </Form.Control>
                        {errors.lastName && <p className={formTextError}>{errors.lastName.message?.toString()}</p>}
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

                    <Form.Field className="FormField" name="repeatPassword">
                        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", }}>
                            <Form.Label className="FormLabel">Repeat Password</Form.Label>
                        </div>
                        <Form.Control asChild>
                            <input
                                {...register("repeatPassword", {
                                    required: "Repeat password is required",
                                    minLength: {
                                        value: 4,
                                        message: "Password must be at least 4 characters",
                                    },
                                })}
                                className={inputClass} type="password" required placeholder='Enter your password' />
                        </Form.Control>
                        {errors.repeatPassword && <p className={formTextError}>{errors.repeatPassword.message?.toString()}</p>}
                    </Form.Field>

                    <Button type='submit' color="green" variant="soft" style={sButtonSubmit}>Submit</Button>
                    <div className='text-center'>
                        {signup.isError ? (<div className={textError}>Error: {
                            signup.error.response.data.errors[0].data.errors[0].message ? signup.error.response.data.errors[0].data.errors[0].message :
                                "Something went wrong..."
                        }</div>) : null}
                        {signup.isSuccess ? (<div className={textSuccess}>Login successful</div>) : null}
                    </div>
                </Flex>
            </Form.Root>
        </Section>
    </div >
};

export default Page;
