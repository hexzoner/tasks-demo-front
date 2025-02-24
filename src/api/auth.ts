import { useMutation, useQuery } from '@tanstack/react-query'
import axios from "axios";
import { storeToken } from '../utils/storage';
import { useAuth } from '../context';
import { getAPIURL, getAuthHeader } from './shared';

const baseURL = getAPIURL() + "/users";

export function loginMutation(onSuccess: (data: any) => void) {
    const { setAuthUser } = useAuth()
    return useMutation({
        mutationFn: (loginData: any) => {
            return axios.post(`${baseURL}/login`, loginData)
        },
        onError: (error: any) => {
            console.log(error.response.data.errors[0].name, error.response.data.errors[0].message)
        },
        onSuccess: (data) => {
            // console.log(data.data.token)
            // console.log(data.data.user)
            storeToken(data.data.token)
            setAuthUser(data.data.user)
            onSuccess(data)

        },
        // onSettled: (data, error, variables, context?: { id: string }) => {
        //     // Error or success... doesn't matter!
        // },
    })
}

export function signUpMutation(onSuccess: (data: any) => void) {
    const login = loginMutation(onSuccess)

    return useMutation({
        mutationFn: async (data: any) => {
            await axios.post(`${baseURL}`, data);
            login.mutate({ email: data.email, password: data.password });
        },
        onError: (error: any) => {
            console.log(
                "Error:",
                error.response?.data?.errors?.[0]?.name,
                error.response?.data?.errors?.[0]?.message
            );
        },
    });
}

export interface User {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    roles: string[];
}

interface AuthMeResponse {
    user: User,
    token: string
}

export function authMeQuery() {
    return useQuery({
        queryKey: ['authMe'],
        queryFn: async (): Promise<AuthMeResponse> => {
            const response = await axios.get(`${baseURL}/me`, {
                headers: getAuthHeader()
            })
            return response.data
        }
    })
}


export interface getUsersResponse {
    docs: User[];
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

export function getUsersQuery() {
    return useQuery({
        queryKey: ['getUsers'],
        queryFn: async (): Promise<getUsersResponse> => {
            const response = await axios.get(`${baseURL}`, {
                headers: getAuthHeader()
            })
            return response.data
        },
    })
}

// export function logoutMutation() {
//     const { setAuthUser } = useAuth()
//     return useMutation({
//         mutationFn: () => {
//             return axios.post(`${baseURL}/logout`)
//         },
//         onSettled: () => {
//             setAuthUser(null)
//             deleteToken()
//         },
//         onError: () => {
//             setAuthUser(null)
//             deleteToken()
//         }
//     })
// }

// export function authMeMutation() {
//     const { setAuthUser } = useAuth()
//     return useMutation({
//         mutationFn: () => {
//             return axios.get(`${baseURL}/me`, { headers: tokenHeader })
//         },
//         onSuccess: (data) => {
//             console.log(data)
//             setAuthUser(data.data)
//         },
//         onError: (error: any) => {
//             console.log(error.response.data.errors[0].name, error.response.data.errors[0].message)
//         },
//         onSettled: () => {
//             console.log("settled")
//         }
//     })
// }

