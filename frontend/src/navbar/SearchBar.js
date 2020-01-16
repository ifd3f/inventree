import {Dropdown} from "react-bootstrap";
import React, {useState} from "react";
import Form from "react-bootstrap/Form";
import {AsyncTypeahead, Menu, MenuItem} from "react-bootstrap-typeahead";
import axios from "axios";


function ResultEntry(props) {
    return <MenuItem {...props} >
        {props.option}
    </MenuItem>
}

function ResultMenu(props) {
    return <Menu>
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
            setOptions(res.data.map(x => x.name));
            setIsLoading(false);
        })
    };

    return <>
        <AsyncTypeahead
            minLength={2}
            labelKey="search"
            placeholder="Containers, items, tags..."
            onSearch={handleSearch}
            options={options}
            isLoading={isLoading}
            renderMenu={renderResultMenu}
            {...props}
        />
    </>
}