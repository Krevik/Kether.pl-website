import axios from 'axios';
export type ApiResponse<TExpectedDataType> = {
    data?: TExpectedDataType;
    error?: string;
};

export type HttpMethod = 'get' | 'post' | 'delete' | 'put';

export const networkingUtils = {
    doFetch: async <TExpectedDataType>(
        url: string,
        method: HttpMethod,
        data?: unknown
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
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            apiResponse.error = errorMessage;
        }
        return apiResponse;
    },
};
