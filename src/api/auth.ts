import { useMutation, useQuery } from '@tanstack/react-query'
import axios from "axios";
import { storeToken, restoreToken } from '../utils/storage';
import { useAuth } from '../context';

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("API URL is required, are you missing a .env file?");
const baseURL = `${API_URL}/users`;

export const tokenHeader =
{
    "Content-Type": "application/json",
    Authorization: `Bearer ${restoreToken()}`,
}


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
    const { setAuthUser } = useAuth()
    return useMutation({
        mutationFn: (data: any) => {
            return axios.post(`${baseURL}`, data)
        },
        onError: (error: any) => {
            console.log(error.response.data.errors[0].name, error.response.data.errors[0].message)
        },
        onSuccess: (data) => {
            storeToken(data.data.token)
            setAuthUser(data.data.user)
            onSuccess(data)
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

interface User {
    id: number;
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
            const response = await axios.get(`${baseURL}/me`, { headers: tokenHeader })
            return response.data
        }
    })
}