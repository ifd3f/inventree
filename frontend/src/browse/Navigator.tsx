import {FunctionComponent, useContext} from "react";
import {SelectedContainerContext} from "./InventoryBrowser";


export interface NavigatorProps {

}

export const Navigator: FunctionComponent<NavigatorProps> = () => {
    const {selected} = useContext(SelectedContainerContext);
    return null;
}