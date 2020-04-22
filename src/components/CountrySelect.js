import React from 'react'
import countries from '../countries';
import { FormSelect } from "shards-react";

const countriesData = Object.keys(countries.ko).map((countryCode, key) => {
    return { countryCode, name: countries.ko[countryCode] }
})
countriesData.sort((i1, i2) => i1.name.localeCompare(i2.name));

export default function CountrySelect({ className, value, onChange }) {
    return (
        <FormSelect
            className={className}
            value={value}
            onChange={onChange}
        >
            <option readOnly>국적</option>
            {
                countriesData.map(({ countryCode, name }, key) => {
                    return <option value={countryCode} key={key}>{name}</option>
                })
            }
        </FormSelect>
    )
}
