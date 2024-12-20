import React, { useState, createContext } from 'react';

export const userDataContext = createContext(null);

const UserContext = ({ children }) => {
    const [user, setUser] = useState(null);

    return (
        <userDataContext.Provider value={{ user, setUser }}>
            {children}
        </userDataContext.Provider>
    );
}

export default UserContext;
