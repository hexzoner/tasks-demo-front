import { getAPIURL, tokenHeader } from './shared';
import { useQuery } from '@tanstack/react-query'
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

export interface getTasksResponse {
    data: Task[];
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