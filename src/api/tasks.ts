import { getAPIURL } from './shared';
import { useQuery, useMutation, keepPreviousData } from '@tanstack/react-query'
import { queryClient } from '../App';
import axios from "axios";
import { PaginationState } from '@tanstack/react-table';
import { getAuthHeader } from './shared';

const baseURL = getAPIURL() + "/tasks";

export enum TaskStatus {
    toDo = 'To Do',
    inProgress = 'In Progress',
    done = 'Done'
}

import { User } from './auth';

export interface Task {
    id?: number;
    title: string;
    description: string;
    assignee: User;
    dueDate: string;
    status: string;
    createdBy: User;
    createdAt: string;
}

export interface EditTask {
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

export function getTasksQuery(pagination: PaginationState, userId: string) {
    let query = `page=${pagination.pageIndex + 1}&limit=${pagination.pageSize}`

    return useQuery({
        queryKey: ['getTasks', pagination, userId],
        queryFn: async (): Promise<getTasksResponse> => {
            if (!query) query = ""
            const response = await axios.get(`${baseURL}?${query}`, {
                headers: getAuthHeader()
            })
            return response.data
        },
        placeholderData: keepPreviousData, // don't have 0 rows flash while changing pages

    })
}

export function getTaskByIdQuery(id: string) {
    return useQuery({
        queryKey: ['getTaskById', id],
        queryFn: async (): Promise<Task> => {
            const response = await axios.get(`${baseURL}/${id}`, {
                headers: getAuthHeader()
            })
            return response.data
        }
    })
}

export function addTaskMutation() {
    return useMutation({
        mutationFn: (newTask: NewTask) => axios.post(baseURL, newTask, {
            headers: getAuthHeader()
        }),
        onSettled: async () => {
            return await queryClient.invalidateQueries({ queryKey: ['tasks'] })
        },
        onError(error) {
            console.log(error)
        },
        mutationKey: ['addTask']
    })
}


export function editTaskMutation() {
    return useMutation({
        mutationFn: (task: Task) => axios.patch(`${baseURL}/${task.id}`, task, {
            headers: getAuthHeader()
        }),
        onSettled: async () => {
            return await queryClient.invalidateQueries({ queryKey: ['tasks'] })
        },
        onError(error) {
            console.log(error)
        },
    })
}

export function deleteTaskMutation() {
    return useMutation({
        mutationFn: (id: number) => axios.delete(`${baseURL}/${id}`, {
            headers: getAuthHeader()
        }),
        onSettled: async () => {
            return await queryClient.invalidateQueries({ queryKey: ['getTasks'] })
        },
        onError(error) {
            console.log(error)
        },
    })
}