
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
    freeSpace: boolean;
    formatVersion: 1; // for backwards compatibility if format is ever updated
}

/**
 * Checks whether or not an object is a {@link Project}
 * @param object object to check
 * @returns whether or not the object implements {@link Project}
 */
export function isProject(object: unknown): object is Project {
    return (
        object &&
        typeof object === "object" &&
        typeof object["id"] === "string" &&
        typeof object["name"] === "string" &&
        Array.isArray(object["items"]) &&
        object["items"].every(i => typeof i === "string") &&
        typeof object["time"] === "number" &&
        typeof object["freeSpace"] === "boolean" &&
        object["formatVersion"] === 1
    ) as boolean;
}

/**
 * Opens a popup that displays some text
 * @param text text to display
 */
export function alert(text: string): Promise<void> {
    id("alert-text").innerText = text;
    id<HTMLDialogElement>("alert").showModal();

    return new Promise((resolve) => {
        id("alert-close").addEventListener("click", () => {
            id<HTMLDialogElement>("alert").close();
            resolve();
        }, { once: true });
    });

}
