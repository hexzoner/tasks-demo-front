import { FC } from "react";
import { z } from 'zod';
import { useForm } from "react-hook-form";
import { addTaskMutation } from "../../api/tasks";
import { getUsersQuery, User } from "../../api/auth";
import { TaskStatus } from "../../api/tasks";
import { CreateTaskForm } from "./CreateTaskForm";
import { NewTask } from "../../api/tasks";

export const taskSchema = z.object({
    title: z.string(),
    description: z.string() || z.number(),
    dueDate: z.string().refine((date) => {
        return new Date(date) > new Date();
    },
        { message: "Due date must be in the future" }
    ),
    status: z.enum(['toDo', 'inProgress', 'done']),
    assignee: z.number(),
});

export function getUserNameFromUser(user: User) {
    return `${user.firstName ? user.firstName : ""} ${user.lastName ? user.lastName : ""} (${user.email})`
}

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

    if (isLoading) return <div className="min-h-screen text-center">Loading...</div>

    return (
        <div className="min-h-screen">
            <p className="text-center mt-6 text-2xl mb-4">Create Task</p>
            <CreateTaskForm
                mutation={addTask}
                register={register}
                errors={errors}
                handleSubmit={handleSubmit}
                handleCreateTask={handleCreateTask}
                taskStatusArray={taskStatusArray}
                usersData={usersData}
                isPending={isPending}
                readOnly={false}
            />
        </div>
    );
}


export default CreateTask;


