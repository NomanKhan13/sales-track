import { createContext, useState } from "react"

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(null);

    console.log(user);

    return <UserContext.Provider value={{ user, setUser, userLoading, setUserLoading }}>
        {children}
    </UserContext.Provider>
}

export default UserProvider;