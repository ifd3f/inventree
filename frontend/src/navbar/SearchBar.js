import {Dropdown} from "react-bootstrap";
import React, {useState} from "react";
import Form from "react-bootstrap/Form";
import {AsyncTypeahead, Menu, MenuItem} from "react-bootstrap-typeahead";
import axios from "axios";


function ResultEntry(props) {
    return <MenuItem id={props.option.id} {...props} >
        {props.option.name}
    </MenuItem>
}

function ResultMenu(props) {
    return <Menu id="search-results">
        {props.results.map((result, index) => {
            return <ResultEntry option={result} position={index}/>;
        })}
    </Menu>
}

function renderResultMenu(results, menuProps) {
    return <ResultMenu results={results} {...menuProps}/>
}

export function SearchBar(props) {
    const [options, setOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = (query) => {
        setIsLoading(true);
        axios.get("/api/containers/search", {
            params: {
                'text__contains': query
            }
        }).then(res => {
            setOptions(res.data);
            setIsLoading(false);
        })
    };

    return <>
        <AsyncTypeahead
            id="search-bar"
            minLength={2}
            labelKey={option => option.name}
            placeholder="Containers, items, tags..."
            onSearch={handleSearch}
            options={options}
            isLoading={isLoading}
            renderMenu={renderResultMenu}
            {...props}
        />
    </>
}