import { getAPIURL, tokenHeader } from './shared';
import { useQuery, useMutation, keepPreviousData } from '@tanstack/react-query'
import { queryClient } from '../App';
import axios from "axios";
import { PaginationState } from '@tanstack/react-table';

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

export function getTasksQuery(pagination: PaginationState) {
    let query = `page=${pagination.pageIndex + 1}&limit=${pagination.pageSize}`
    return useQuery({
        queryKey: ['getTasks', pagination],
        queryFn: async (): Promise<getTasksResponse> => {
            if (!query) query = ""
            const response = await axios.get(`${baseURL}?${query}`, { headers: tokenHeader })
            return response.data
        },
        placeholderData: keepPreviousData, // don't have 0 rows flash while changing pages/
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