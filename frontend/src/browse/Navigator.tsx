import {FunctionComponent, useContext} from "react";
import {SelectedContainerContext} from "./Browser";


export interface NavigatorProps {

}

export const Navigator: FunctionComponent<NavigatorProps> = () => {
    const {selected} = useContext(SelectedContainerContext);
    return null;
}