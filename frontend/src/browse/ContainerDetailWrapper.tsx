
import React, {FunctionComponent} from "react";
import {LoadingDataState, SelectedDataState, useContainerSelection} from "./InventoryBrowser";
import {Button} from "reactstrap";


export const ContainerDetailWrapper = () => {
    const {state, selectContainer} = useContainerSelection();

    const ol = () => selectContainer(2);
    if (state == null) {
        return <Button onClick={ol}>ff</Button>;
    }

    if (state instanceof LoadingDataState) {
        return <p>ld</p>;
    }

    return <p>{state.container.name}</p>;
}