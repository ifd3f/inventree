interface APINode {
    id: number
    name: string
    description: string
    image: string
    parents: Array<number>
    location_metadata: any
    qr_uuid: string
}

interface APIContainer extends APINode {
    container_type: number
    metadata: any
    items: Array<APIItem>
    sub_containers: Array<APIContainer> | Array<number>
}

interface APIItem extends APINode {
    tags: Array<string>
}

