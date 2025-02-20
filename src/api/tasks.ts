import { getAPIURL, tokenHeader } from './shared';
import { useQuery, useMutation } from '@tanstack/react-query'
import { queryClient } from '../App';
import axios from "axios";

const baseURL = getAPIURL() + "/tasks";

export enum TaskStatus {
    toDo = 'To Do',
    inProgress = 'In Progress',
    done = 'Done'
}

export interface Task {
    id: number;
    title: string;
    description: string;
    assignee: number;
    dueDate: string;
    status: string;
    createdBy: number;
}

export interface NewTask {
    title: string;
    description: string;
    assignee: number;
    dueDate: string;
    status: string;
}

export interface getTasksResponse {
    docs: Task[];
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    limit: number;
    nextPage: number;
    page: number;
    pagingCounter: number;
    prevPage: number;
    totalDocs: number;
    totalPages: number;
}

export function getTasksQuery() {
    return useQuery({
        queryKey: ['getTasks'],
        queryFn: async (): Promise<getTasksResponse> => {
            const response = await axios.get(`${baseURL}`, { headers: tokenHeader })
            return response.data
        }
    })
}

export function addTaskMutation() {
    return useMutation({
        mutationFn: (newTask: NewTask) => axios.post('/api/tasks', newTask, { headers: tokenHeader }),
        onSettled: async () => {
            return await queryClient.invalidateQueries({ queryKey: ['tasks'] })
        }
    })
}