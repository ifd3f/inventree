import React, { Component } from "react";

export function MaybeNotProvided(props) {
  if (props.children) {
    return props.children;
  } else if (props.type) {
    return <span className="text-muted font-weight-italic">No {props.type} provided.</span>;
  } else {
    return <span className="text-muted">N/A</span>;
  }
}

export function MaybeLink(props) {
  let urlOnlyStyle = props.style ? props.style : {overflow: 'hidden', textOverflow: 'ellipsis'};
  if (props.children) {
    if (props.url) {
      return <a href={props.url}>{props.children}</a>
    } else {
      return props.children;
    }
  } else {
    if (props.url) {
      return <a href={props.url}><span style={urlOnlyStyle}>props.url</span></a>;
    } else {
      return <span class="text-muted">No source provided.</span>;
    }
  }
}
