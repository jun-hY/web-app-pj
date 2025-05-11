import axios from "axios";

const BASE_URL = 'http://localhost:1337/api/DeepInfraChat/chat/completions';
const prompt = `
한국어로 답변하세요.
코드 리뷰를 위한 ai 입니다. 모든 답변은 ~ 입니다로 끝나는 문장체를 사용하세요.
모든 답변은 json 형태로 반환하세요.
코드를 보고 코드의 문제점 4가지, 개선방안 4가지를 답변하세요
성능, 보안, 가독성 3가지 분야를 100점 만점으로 점수를 매기고 총점을 매기세요. 모든 점수는 소수점없는 자연수입니다. 총점은 3가지 분야의 평균으로 매기되 소수점은 버리세요.
모든 점수는 같은 key 안에 존재하게 작성하세요.
최종적으로 코드 리뷰에 대한 요약을 800byte 내로 작성하고 개선된 코드를 작성하세요. 개선된 코드를 코드 블록 문법을 사용하지 않고 작성하세요.
`

interface APIres {
    choices: [{
        index: number,
        message: {
            role: string,
            content: string,
        }
    }],
}

export const reqReview = async (code: string): Promise<APIres> => {
    try {
        const response = await axios.post<APIres>(`${BASE_URL}`, {
            "messages":[{
                "role": "user",
                "content": `${prompt}\n${code}`
            }],
            "model": "deepseek-r1-turbo",
        });
        return response.data;
    } catch (error) {
        console.error('cant reach ai api\n', error);
        throw error;
    }
}