import React, {createContext, FunctionComponent, useContext, useState} from "react";
import {RetrieveContainer, useInventreeAPI} from "../util";
import {Navigator} from "./Navigator";
import {ContainerDetailWrapper} from "./ContainerDetailWrapper";

export class LoadingDataState {
    constructor(
        public readonly containerId: number,
        public readonly requestNumber: number,
        public readonly requestSent: boolean) {
    }
}

export class SelectedDataState {
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
        const nextState = new LoadingDataState(id, nextRequestNumber, false);
        setNextRequestNumber(nextRequestNumber + 1);
        setState(nextState);
    }

    const getState = () => state;

    if (state instanceof LoadingDataState && !state.requestSent) {
        const thisState = state;
        api.getContainer(state.containerId).then((container) => {
            console.log(state, container)
            const stateWhenLoaded = getState();
            if (stateWhenLoaded instanceof LoadingDataState && stateWhenLoaded.requestNumber == thisState.requestNumber) {
                setState(new SelectedDataState(container));
            }
        });
    }

    return <SelectedContainerContext.Provider value={{state, selectContainer}}>
        <Navigator/>
        <ContainerDetailWrapper/>
    </SelectedContainerContext.Provider>;
};

export const useContainerSelection = () => useContext(SelectedContainerContext);
