import axios from "axios"

const usuarioApi = axios.create({
    baseURL : "http://localhost:8000/api/user"
})

export const deleteUser = (email) => usuarioApi.delete(`/${email}`);