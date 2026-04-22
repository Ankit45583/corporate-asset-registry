import api from './api';

// ✅ Backend se data aata hai, sirf pass karo
export const getSummary = async () => {
    const { data } = await api.get('/reports/summary');
    return data;
};

export const getDepartmentReport = async () => {
    const { data } = await api.get('/reports/departments');
    return data;
};