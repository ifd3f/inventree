export interface RetrieveNode {
    id: number
    name: string
    description: string
    image: string
    parents: Array<number>
    location_metadata: any
    qr_uuid: string
}

export interface RetrieveContainer extends RetrieveNode {
    container_type: number
    metadata: any
    items: Array<RetrieveItem>
    sub_containers: Array<RetrieveContainer> | Array<number>
}

export interface RetrieveItem extends RetrieveNode {
    tags: Array<string>
}

