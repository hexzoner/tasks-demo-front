import { Flex, Section, Button } from "@radix-ui/themes"
import { formTextError, inputClass, sLoginSection, sButtonSubmit, textError, sButton } from '../../styles/styles';
import { Form } from "radix-ui";
import { Navigate } from "react-router-dom";
import { TaskStatus } from "../../api/tasks";
import { getUserNameFromUser } from "./page";
import { User } from "../../api/auth";
import DialogConfirm from "../../components/DialogConfirm";

export function CreateTaskForm({ mutation, register, errors, handleSubmit,
    handleCreateTask, taskStatusArray, usersData, isPending, readOnly, buttonText, handleDeleteTask
}: {
    mutation: any,
    register: any,
    handleSubmit: any,
    handleCreateTask: any,
    taskStatusArray: any,
    usersData: any,
    errors: any
    isPending: boolean
    readOnly: boolean
    buttonText?: string
    handleDeleteTask?: () => void
}) {
    return <Section style={sLoginSection} className='w-full mx-auto mb-12'>
        {/* <p style={{ textAlign: "center", fontSize: "1.5rem", padding: "1rem" }}>Login</p> */}
        {mutation.isSuccess ? <>
            <Navigate to="/dashboard" />
        </> : <Form.Root onSubmit={handleSubmit(handleCreateTask)} className="FormRoot pt-[2rem]">
            <Flex direction="column" gap="5" maxWidth="600px" style={{ margin: "auto" }}>

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
                            className={inputClass} type="text" required placeholder='Enter task title'
                            readOnly={readOnly}
                        />
                    </Form.Control>
                    {errors.title && <p className={formTextError}>{errors.title.message?.toString()}</p>}
                </Form.Field>

                {/* description */}
                <Form.Field className="FormField" name="description">
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                        <Form.Label className="FormLabel">Description</Form.Label>
                        <Form.Message className="FormMessage" match="valueMissing">
                            Please enter a question
                        </Form.Message>
                    </div>
                    <Form.Control asChild>
                        <textarea readOnly={readOnly} {...register("description")} className={`Textarea ${inputClass} h-36`} placeholder="Enter task description" />
                    </Form.Control>
                    {errors.description && <p className={formTextError}>{errors.description.message?.toString()}</p>}
                </Form.Field>

                {/* due date */}
                <Form.Field className="FormField" name="dueDate">
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", }}>
                        <Form.Label className="FormLabel">Due Date</Form.Label>
                    </div>
                    <Form.Control asChild>
                        <input readOnly={readOnly}
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
                        <select disabled={readOnly} {...register("status", {
                            required: "Status is required",
                        })} className={inputClass}>
                            {taskStatusArray.map((status: any) => (
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
                        <select disabled={readOnly} {...register("assignee", {
                            required: "Assignee is required",
                            valueAsNumber: true
                        })} className={inputClass} defaultValue="">
                            <option value="" disabled>Select assignee</option>
                            {usersData?.docs.map((user: User) => (
                                <option key={user.id} value={Number(user.id)}>{getUserNameFromUser(user)}</option>
                            ))}
                        </select>
                    </Form.Control>
                    {errors.assignee && <p className={formTextError}>{errors.assignee.message?.toString()}</p>}
                </Form.Field>


                {!isPending && !readOnly && <Button type='submit' color="green" variant="soft" style={sButtonSubmit}>{buttonText ? buttonText : "Submit"}</Button>}
                {handleDeleteTask && !readOnly && <>
                    <Button style={sButton} type='button' color="red" variant="soft" onClick={(e: any) => {
                        e.preventDefault();
                        const dialog = document.getElementById("confirmPopup") as HTMLDialogElement;
                        dialog.showModal();
                    }}>Delete Task</Button>
                    <div className="absolute">
                        <DialogConfirm deleteConfirmed={handleDeleteTask} confirmText="Are you sure you want to delete this task?" />
                    </div>
                </>}

                <div className='text-center'>
                    {mutation.isError ? (<div className={textError}>Error: Something went wrong...</div>) : null}
                    {/* {addTask.isSuccess ? (<div className={textSuccess}>Task successfully created!</div>) : null} */}
                </div>
            </Flex>
        </Form.Root>

        }
        {handleDeleteTask && <div className="absolute top-0 left-0 ">
            <DialogConfirm deleteConfirmed={handleDeleteTask} confirmText="Are you sure you want to delete this task?" />
        </div>}
    </Section>
}