import api from './api';

export const getAssets = async () => {
    const { data } = await api.get('/assets');
    return data;
};

export const getAsset = async (id) => {
    const { data } = await api.get(`/assets/${id}`);
    return data;
};

export const createAsset = async (assetData) => {
    const { data } = await api.post('/assets', assetData);
    return data;
};

export const updateAsset = async (id, assetData) => {
    const { data } = await api.put(`/assets/${id}`, assetData);
    return data;
};

export const deleteAsset = async (id) => {
    const { data } = await api.delete(`/assets/${id}`);
    return data;
};