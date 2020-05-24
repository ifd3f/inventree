import Axios, {AxiosResponse} from "axios";
import {RetrieveContainer} from "./data";



export class InventreeAPI {
    constructor(private root: string) {

    }

    protected path(resource: string): string {
        return this.root + resource
    }

    getRootContainers(): Promise<Array<RetrieveContainer>> {
        return Axios.get(
            this.root + "v1/containers",
            {
                params: {
                    parent: 0
                }
            }
        ).then((res: AxiosResponse<Array<RetrieveContainer>>) => {
            return res.data
        });
    }
}