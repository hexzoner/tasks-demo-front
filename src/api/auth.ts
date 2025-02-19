import { useMutation } from '@tanstack/react-query'
import axios from "axios";
import { storeToken } from '../utils/storage';

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("API URL is required, are you missing a .env file?");
const baseURL = `${API_URL}/users`;

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

export function loginMutation() {
    return useMutation({
        mutationFn: (loginData: any) => {
            return axios.post(`${baseURL}/login`, loginData)
        },
        onError: (error: any) => {
            console.log(error.response.data.errors[0].name, error.response.data.errors[0].message)
        },
        onSuccess: (data) => {
            console.log(data.data.token)
            console.log(data.data.user)
            storeToken(data.data.token)
        },
        // onSettled: (data, error, variables, context?: { id: string }) => {
        //     // Error or success... doesn't matter!
        // },
    })
}


// export async function login() {
//     console.log(baseURL)
//     const { isPending, error, data } = useQuery(api_LoginQuery)
//     return { isPending, error, data }
// }