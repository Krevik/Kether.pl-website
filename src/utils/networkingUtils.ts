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
        await axios({
            method: method,
            url: url,
            data: data,
            headers: { 'content-type': 'application/json' },
        })
            .then(async (response) => {
                const fetchingResult = await response.data;
                apiResponse.data = fetchingResult;
            })
            .catch((error) => {
                apiResponse.error = error;
            });
        return apiResponse;
    },
};