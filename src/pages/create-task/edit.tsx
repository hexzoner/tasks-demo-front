import React, { FC } from "react";
import { useForm } from "react-hook-form";
import { getUsersQuery } from "../../api/auth";
import { TaskStatus, getTaskByIdQuery, editTaskMutation, Task, deleteTaskMutation } from "../../api/tasks";
import { CreateTaskForm } from "./CreateTaskForm";
// import { NewTask } from "../../api/tasks";
import { taskSchema } from "./page";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context";



export const EditTask: FC = () => {
    const { user } = useAuth();
    const nav = useNavigate()
    const { id } = useParams<{ id: string }>();
    const { data: taskData,
        // isLoading: taskIsLoading 
    } = id ? getTaskByIdQuery(id) : {
        data: null,
        // isLoading: false
    };
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },

    } = useForm<Omit<Task, 'assignee'> & { assignee: number | "" }>({ // Omit assignee from Task and add assignee as number or empty string
        defaultValues: { assignee: "" }
    });


    React.useEffect(() => {
        if (taskData) {
            reset({
                ...taskData,
                dueDate: taskData.dueDate ? taskData.dueDate.split("T")[0] : "", // Extract YYYY-MM-DD
                assignee: taskData.assignee?.id // Convert User ID to string
            });
        }
    }, [taskData, reset]);


    const taskStatusArray = Object.keys(TaskStatus);
    const { data: usersData, isLoading } = getUsersQuery();
    const { isPending } = editTaskMutation();
    const editTask = editTaskMutation();

    const deleteTask = deleteTaskMutation();

    function handleDeleteTask() {
        if (taskData && taskData.id !== undefined) deleteTask.mutate(taskData.id)
        nav('/dashboard')
    }

    function handleEditTask(data: Task) {
        // console.log(data)
        try {
            if (taskSchema.parse(data)) {
                console.log("Validation successful")
                editTask.mutate(data)
            }
        } catch (error) {
            console.log("Validation error:", error);
        }
    }

    if (isLoading) return <div className="min-h-screen text-center">Loading...</div>
    const readOnly = taskData?.createdBy?.id !== user.id && !user.roles.includes("admin")

    return (
        <div className="min-h-screen">
            {taskData ? <div className="flex flex-col items-center">
                <p className="text-center mt-6 text-2xl mb-4">{`${readOnly ? `View Task` : `Edit Task`}`} #{taskData?.id}</p>
                {taskData.createdBy && <p className="mb-2">Created By: {taskData.createdBy.firstName} {taskData.createdBy.lastName} {taskData.createdBy.email}</p>}
                <CreateTaskForm
                    mutation={editTask}
                    register={register}
                    errors={errors}
                    handleSubmit={handleSubmit}
                    handleCreateTask={handleEditTask}
                    taskStatusArray={taskStatusArray}
                    usersData={usersData}
                    isPending={isPending}
                    readOnly={readOnly}
                    buttonText="Update Task"
                    handleDeleteTask={handleDeleteTask}
                />

            </div> :
                <div className="text-center flex items-center justify-center min-h-screen text-3xl">Task not found</div>}

        </div>
    );
}


export default EditTask;


