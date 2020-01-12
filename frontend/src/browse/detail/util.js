import {useRouteMatch} from "react-router-dom";

export function useSelectedContainerID() {
    const match = useRouteMatch('/browse/:containerID');
    return match ? match.params.containerID : 0;
}