import React, {createContext, FunctionComponent, useContext, useState} from "react";
import {RetrieveContainer, useInventreeAPI} from "../util";
import {Navigator} from "./Navigator";
import {ContainerDetail} from "./ContainerDetail";

class LoadingDataState {
    constructor(
        public readonly containerId: number,
        public readonly requestNumber: number) {
    }
}

class SelectedDataState {
    constructor(public readonly container: RetrieveContainer) {
    }
}

type ContainerSelectionState = null | LoadingDataState | SelectedDataState;

export interface SelectedContainerContextData {
    state: ContainerSelectionState
    selectContainer(id: number): void
}

const SelectedContainerContext = createContext<SelectedContainerContextData>(
    {
        state: null,
        selectContainer: _ => {}
    });

export const InventoryBrowser: FunctionComponent = () => {
    const [state, setState] = useState<ContainerSelectionState>(null);
    const [nextRequestNumber, setNextRequestNumber] = useState<number>(0);
    const api = useInventreeAPI();

    const selectContainer = (id: number) => {
        const nextState = new LoadingDataState(id, nextRequestNumber);
        api.getContainer(id).then((container) => {
            if (state === nextState) {
                setState(new SelectedDataState(container));
            }
        });

        setNextRequestNumber(nextRequestNumber + 1);
        setState(nextState);
    }

    return <SelectedContainerContext.Provider value={{state, selectContainer}}>
        <Navigator/>
        <ContainerDetail/>
    </SelectedContainerContext.Provider>;
};

export const useContainerSelection = () => useContext(SelectedContainerContext);
