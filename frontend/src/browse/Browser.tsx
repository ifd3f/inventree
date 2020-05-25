import React from "react";
import {createContext, FunctionComponent} from "react";
import {RetrieveContainer} from "../util";
import {Navigator} from "./Navigator";
import {ContainerDetail} from "./ContainerDetail";

export interface SelectedContainerData {
    selected: RetrieveContainer | null
}

export const SelectedContainerContext = createContext<SelectedContainerData>({selected: null});

export const Browser: FunctionComponent = () => {

    return <SelectedContainerContext.Provider value={{selected: null}}>
        <Navigator/>
        <ContainerDetail/>
    </SelectedContainerContext.Provider>;
};
