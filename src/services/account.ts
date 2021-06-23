import { post } from "../api/customApi";

export const login = async (shouJi: string, miMa: string): Promise<string> => {
    const { token } = await post('/public/dengLu', { shouJi, miMa });
    return token;
}