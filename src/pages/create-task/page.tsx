import { FC } from "react";
import { z } from 'zod';
import { useForm } from "react-hook-form";
import { Flex, Section, Button } from "@radix-ui/themes"
import { formTextError, inputClass, sLoginSection, sButtonSubmit, textError } from '../../styles/styles';
import { Form } from "radix-ui";
import { addTaskMutation, Task } from "../../api/tasks";
import { getUsersQuery, User } from "../../api/auth";
import { TaskStatus } from "../../api/tasks";
import { Navigate } from "react-router-dom";


import { NewTask } from "../../api/tasks";

const taskSchema = z.object({
    title: z.string(),
    description: z.string(),
    dueDate: z.string().refine((date) => {
        return new Date(date) > new Date();
    },
        { message: "Due date must be in the future" }
    ),
    status: z.enum(['toDo', 'inProgress', 'done']),
    assignee: z.number(),
});

export const CreateTask: FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<NewTask>();

    const taskStatusArray = Object.keys(TaskStatus);
    const { data: usersData, isLoading } = getUsersQuery();
    const { isPending } = addTaskMutation();
    const addTask = addTaskMutation();

    // React.useEffect(() => {
    //     if (usersData) console.log(usersData.docs)
    // }
    //     , [usersData])

    function getUserNameFromUser(user: User) {
        return `${user.firstName ? user.firstName : ""} ${user.lastName ? user.lastName : ""} (${user.email})`
    }

    function handleCreateTask(data: NewTask) {
        console.log(data)
        try {
            if (taskSchema.parse(data)) {
                console.log("Validation successful")
                addTask.mutate(data)
            }
        } catch (error) {
            console.log("Validation error:", error);
        }
    }

    return (
        <div className="min-h-screen">
            <p className="text-center mt-6 text-2xl mb-4">Create Task</p>
            <Section style={sLoginSection} className='w-full '>
                {/* <p style={{ textAlign: "center", fontSize: "1.5rem", padding: "1rem" }}>Login</p> */}
                {addTask.isSuccess ? <>
                    <Navigate to="/dashboard" />
                </> : <Form.Root onSubmit={handleSubmit(handleCreateTask)} className="FormRoot pt-[2rem]">
                    <Flex direction="column" gap="5" maxWidth="400px" style={{ margin: "auto" }}>

                        {/* title */}
                        <Form.Field className="FormField" name="email">
                            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", }}>
                                <Form.Label className="FormLabel">Title</Form.Label>
                            </div>
                            <Form.Control asChild>
                                <input
                                    {...register("title", {
                                        required: "Title is required",
                                    })}
                                    className={inputClass} type="text" required placeholder='Enter task title' />
                            </Form.Control>
                            {errors.title && <p className={formTextError}>{errors.title.message?.toString()}</p>}
                        </Form.Field>

                        {/* description */}
                        <Form.Field className="FormField" name="description">
                            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", }}>
                                <Form.Label className="FormLabel">Description</Form.Label>
                                <Form.Message className="FormMessage" match="valueMissing">
                                    Please enter a question
                                </Form.Message>
                            </div>
                            <Form.Control asChild>
                                <textarea {...register("description")} className={`Textarea ${inputClass}`} placeholder="Enter task description" />
                            </Form.Control>
                            {errors.description && <p className={formTextError}>{errors.description.message?.toString()}</p>}
                        </Form.Field>

                        {/* due date */}
                        <Form.Field className="FormField" name="dueDate">
                            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", }}>
                                <Form.Label className="FormLabel">Due Date</Form.Label>
                            </div>
                            <Form.Control asChild>
                                <input
                                    {...register("dueDate", {
                                        required: "Due date is required",

                                    })}
                                    className={inputClass} type="date" required
                                    min={new Date().toISOString().split("T")[0]} //Restricts past dates
                                />
                            </Form.Control>
                            {errors.dueDate && <p className={formTextError}>{errors.dueDate.message?.toString()}</p>}
                        </Form.Field>

                        {/* status */}
                        <Form.Field className="FormField" name="status">
                            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", }}>
                                <Form.Label className="FormLabel">Status</Form.Label>
                            </div>
                            <Form.Control asChild>
                                <select {...register("status", {
                                    required: "Status is required",
                                })} className={inputClass}>
                                    {taskStatusArray.map((status) => (
                                        <option key={status} value={status}>{
                                            TaskStatus[status as keyof typeof TaskStatus]
                                        }</option>
                                    ))}
                                </select>
                            </Form.Control>
                            {errors.status && <p className={formTextError}>{errors.status.message?.toString()}</p>}
                        </Form.Field>


                        {/* assignee */}
                        <Form.Field className="FormField" name="assignee">
                            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", }}>
                                <Form.Label className="FormLabel">Assignee</Form.Label>
                            </div>
                            <Form.Control asChild>
                                <select {...register("assignee", {
                                    required: "Assignee is required",
                                    valueAsNumber: true
                                })} className={inputClass} defaultValue="">
                                    <option value="" disabled>Select assignee</option>
                                    {usersData?.docs.map((user) => (
                                        <option key={user.id} value={Number(user.id)}>{getUserNameFromUser(user)}</option>
                                    ))}
                                </select>
                            </Form.Control>
                            {errors.assignee && <p className={formTextError}>{errors.assignee.message?.toString()}</p>}
                        </Form.Field>

                        {!isPending && <Button type='submit' color="green" variant="soft" style={sButtonSubmit}>Submit</Button>}

                        <div className='text-center'>
                            {addTask.isError ? (<div className={textError}>Error: Something went wrong...</div>) : null}
                            {/* {addTask.isSuccess ? (<div className={textSuccess}>Task successfully created!</div>) : null} */}
                        </div>
                    </Flex>
                </Form.Root>}
            </Section>
        </div>
    );
}


export default CreateTask;