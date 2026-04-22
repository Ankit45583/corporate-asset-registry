import api from './api';

export const getAssignments = async () => {
    const { data } = await api.get('/assignments');
    return data;
};

export const createAssignment = async (assignmentData) => {
    const { data } = await api.post('/assignments', assignmentData);
    return data;
};

export const returnAsset = async (id) => {
    const { data } = await api.put(`/assignments/${id}`);
    return data;
};

export const deleteAssignment = async (id) => {
    const { data } = await api.delete(`/assignments/${id}`);
    return data;
};