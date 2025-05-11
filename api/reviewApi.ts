import { Axios } from "axios";

const BASE_URL = 'http://localhost:1337/v1/chat/completions';

/*
"http://localhost:1337/v1/chat/completions" 
     -H "Content-Type: application/json" 
     -d '{
           "messages": [
             {
               "role": "user",
               "content": "Hello"
             }
           ],
           "model": "gpt-4o-mini"
         }'
*/

export const fetchReview = async (code: string) => {
     try {
        const response = await Axios.get(`${BASE_URL}/users`);
        return response.data;
    } catch (error) {
        console.error('사용자 목록 조회 실패:', error);
        throw error;
    }
}