import axios from 'axios';
export type ApiResponse<TExptectedDataType> = {
    data?: TExptectedDataType;
    error?: string;
};
export const networkingUtils = {
    doFetch: async <TExpectedDataType>(
        url: string,
        method: 'get' | 'post' | 'delete' | 'put',
        data?: any
    ): Promise<ApiResponse<TExpectedDataType>> => {
        const apiResponse: ApiResponse<TExpectedDataType> = {};
        try {
            const response = await axios({
                method: method,
                url: url,
                data: data,
                headers: { 'content-type': 'application/json' },
            });
            apiResponse.data = response.data;
        } catch (error) {
            apiResponse.error = error.message;
        }
        return apiResponse;
    },
};
