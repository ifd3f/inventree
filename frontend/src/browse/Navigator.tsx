import {FunctionComponent} from "react";
import {useContainerSelection} from "./InventoryBrowser";


export interface NavigatorProps {

}

export const Navigator: FunctionComponent<NavigatorProps> = () => {
    const {state} = useContainerSelection();
    return null;
}