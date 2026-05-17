import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from '../api/axios';

const InstituteContext = createContext();

export const InstituteProvider = ({ children }) => {
    const [institute, setInstitute] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();

    // Pattern: /i/:slug/...
    const pathParts = location.pathname.split('/');
    const slugInPath = pathParts[1] === 'i' ? pathParts[2] : null;

    useEffect(() => {
        const fetchInstitute = async () => {
            if (!slugInPath) {
                setInstitute(null);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const { data } = await axios.get(`/institutes/${slugInPath}`);
                setInstitute(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch institute:", err);
                setError("Institute not found");
                setInstitute(null);
            } finally {
                setLoading(false);
            }
        };

        fetchInstitute();
    }, [slugInPath]);

    return (
        <InstituteContext.Provider value={{ institute, loading, error, isTenant: !!institute }}>
            {children}
        </InstituteContext.Provider>
    );
};

export const useInstitute = () => useContext(InstituteContext);
