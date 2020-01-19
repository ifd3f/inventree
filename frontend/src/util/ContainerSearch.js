import React, {useState} from "react";
import axios from "axios";
import {AsyncTypeahead} from "react-bootstrap-typeahead";

export function ContainerSearch(props) {
    const name = props.name;
    const onChange = props.onChange;
    const defaultValue = props.defaultValue;
    const [wasChanged, setWasChanged] = useState(false);
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
        });
    };

    const handleChange = (options) => {
        onChange({
            name: name,
            option: options.length === 0 ? null : options[0]
        });
    };

    const handleInputChange = (query) => {
        setWasChanged(true);
    };

    const selected = (wasChanged || !defaultValue) ? null : [defaultValue];

    return <AsyncTypeahead
        id="container-search-bar"
        minLength={2}
        labelKey={option => option.name}
        placeholder="Search for containers"
        onSearch={handleSearch}
        options={options}
        isLoading={isLoading}
        onChange={handleChange}
        onInputChange={handleInputChange}
        selected={selected}
        highlightOnlyResult="true"
    />
}