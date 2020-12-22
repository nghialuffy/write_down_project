import {useCallback, useState, useEffect} from 'react';
import {HTTP_STATUS_CODE} from '../const/http-status';
import { DataAccess } from './base';

export type UseEntityData<T> = {
    status: HTTP_STATUS_CODE;
    loading: boolean,
    data?: T,
};

export function useEntityData<T extends Partial<{ _id: string; }>>(url: string | undefined, keyUpdate?: any, defaultData?: T): UseEntityData<T> {
    let [data, setData] = useState<T>();
    const [loading, setLoading] = useState(defaultData ? false : true);
    const [errorStatus, setStatus] = useState<HTTP_STATUS_CODE>('200');

    const fetchUser = useCallback(async () => {
        try {
            if (!url) return;
            setLoading(true);
            const res = await DataAccess.Get(url);
            setData(res.data);
            setStatus(res?.status?.toString());
        } catch (e) {
            console.error('Fetch entity error', e);
            if (e.response) {
                setStatus(e.response?.status?.toString());
            } else {
                setStatus('500');
            }
        } finally {
            setLoading(false);
        }
    }, [url]);

    useEffect(() => {
        if (defaultData) {
            setData(defaultData);
        }
        if (url) {
            fetchUser();
        } else {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchUser, url, defaultData, keyUpdate]);

    return { loading, data, status: errorStatus };
}

export type UseEntityDataList<T> = {
    status: HTTP_STATUS_CODE;
    loading: boolean,
    data?: T,
};


export function useEntityDataList<T>(url: string | undefined, page?: number, defaultData?: T): UseEntityDataList<T> {
    let [data, setData] = useState<T>();
    const [loading, setLoading] = useState(defaultData ? false : true);
    const [errorStatus, setStatus] = useState<HTTP_STATUS_CODE>('200');

    const fetchUser = useCallback(async () => {
        try {
            if (!url) return;
            setLoading(true);
            const res = await DataAccess.Get(`${url}?page=${page ?? 1}`);
            setData(res.data);
            setStatus(res?.status?.toString());
        } catch (e) {
            console.error('Fetch entity error', e);
            if (e.response) {
                setStatus(e.response?.status?.toString());
            } else {
                setStatus('500');
            }
        } finally {
            setLoading(false);
        }
    }, [url, page]);

    useEffect(() => {
        if (defaultData) {
            setData(defaultData);
        }
        if (url) {
            fetchUser();
        } else {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchUser, url, page, defaultData]);

    return { loading, data, status: errorStatus };
}