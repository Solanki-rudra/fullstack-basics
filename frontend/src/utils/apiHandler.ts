const apiHandler = async <T>(apiCall: () => Promise<T>): Promise<T> => {
    try {
        return await apiCall();
    } catch (error: any) {
        throw error.response?.data || "Something went wrong";
    }
};

export { apiHandler }