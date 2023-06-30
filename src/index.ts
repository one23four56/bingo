
export const // helper functions
    id = <type extends HTMLElement>(id) => document.getElementById(id) as type,
    set = (key: string, value: unknown) => localStorage.setItem(key, JSON.stringify(value)),
    get = <type>(key: string, d: string = "{}") => JSON.parse(localStorage.getItem(key) ?? d) as type,
    qs = <type extends HTMLElement>(query: string) => document.querySelector(query) as type;

export interface Project {
    id: string;
    name: string;
    items: string[];
    time: number;
    formatVersion: 1; // for backwards compatibility if format is ever updated
}

