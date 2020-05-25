import React, {createContext, FunctionComponent, useContext} from "react";
import {useAuth} from "./AuthProvider";
import {InventreeAPI} from "./api";


interface APIContextData {
    api: InventreeAPI | null
}

const APIProviderContext = createContext<APIContextData>({api: null})

export interface InventreeAPIProviderProps {
    root: string
    children: any
}

export const InventreeAPIProvider: FunctionComponent<InventreeAPIProviderProps> = ({root, children}) => {
    const auth = useAuth();
    return <APIProviderContext.Provider value={{
        api: new InventreeAPI(auth, root)
    }}>
        {children}
    </APIProviderContext.Provider>
}

export const useInventreeAPI = () => useContext(APIProviderContext).api!
