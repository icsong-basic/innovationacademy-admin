import React from 'react'
import type { Node } from 'react'
import { NavLink } from 'react-router-dom';

type Type = {
    to: string,
    children: Node
}

export default function (props: Type = {}) {
    return (
        <NavLink {...props} className="nav-link" />
    )
}
