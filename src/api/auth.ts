import { useMutation } from '@tanstack/react-query'
import axios from "axios";
import { storeToken, deleteToken } from '../utils/storage';
import { useAuth } from '../context';

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("API URL is required, are you missing a .env file?");
const baseURL = `${API_URL}/users`;

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

export function logoutMutation() {
    const { setAuthUser } = useAuth()
    return useMutation({
        mutationFn: () => {
            return axios.post(`${baseURL}/logout`)
        },
        onSettled: () => {
            setAuthUser(null)
            deleteToken()
        },
        onError: () => {
            setAuthUser(null)
            deleteToken()
        }
    })
}

export function authMeMutation() {
    const { setAuthUser } = useAuth()
    return useMutation({
        mutationFn: () => {
            return axios.get(`${baseURL}/me`)
        },
        onSuccess: (data) => {
            setAuthUser(data.data)
        },
    })
}

// interface User {
//     id: number;
//     firstName: string;
//     lastName: string;
//     email: string;
//     roles: string[];
// }

// interface LoginResponse {
//     token: string;
//     user: User
// }

// export function loginApi(loginData: any, enabled: boolean) {
//     return useQuery({
//         queryKey: ['login'],
//         queryFn: async (): Promise<LoginResponse> => {
//             const response = await axios.post(`${baseURL}/login`, loginData)
//             return response.data
//         },
//         enabled: enabled
//     })
// }

// export async function login() {
//     console.log(baseURL)
//     const { isPending, error, data } = useQuery(api_LoginQuery)
//     return { isPending, error, data }
// }