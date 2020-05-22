import React from "react";
import {DefaultContents} from "./Default";


const CONTAINER_TYPE_DEFAULT = 0;
const CONTAINER_TYPE_GRID = 1;
const CONTAINER_TYPE_FREEFORM = 2;


export function Contents(props) {
    let container = props.container;
    let contents = props.contents;
    switch (container.container_type) {
        case CONTAINER_TYPE_DEFAULT:
            return <DefaultContents contents={contents}/>;
        case CONTAINER_TYPE_GRID:
            return <DefaultContents contents={contents}/>;
        case CONTAINER_TYPE_FREEFORM:
            return <DefaultContents contents={contents}/>;
    }
    throw `unsupported container_type ${container.container_type}`;
}
