import { id, get, set, qs, Project } from './index';

const projectId = new URLSearchParams(location.search).get("project") as string;

// if the project does not exist, redirect home
if (typeof projectId !== "string" || !localStorage.getItem(projectId))
    window.open("index.html", "_self");

const project: Project = get(projectId)

/**
 * Update the autosave text
 */
function saveProject() {
    project.time = Date.now();
    set(project.id, project);
    qs("#buttons span").innerText = `Autosave is on. Last saved at ${new Date().toLocaleTimeString("en-US", { hour: 'numeric', minute: "2-digit" })}.`
}

qs("header span").innerText = project.name;
document.title = project.name + " Bingo - Bingo Card Creator";

qs("header span").addEventListener("input", () => {
    project.name = qs("header span").innerText;
    document.title = project.name + " Bingo - Bingo Card Creator";
    saveProject();
})

id("delete").addEventListener("click", () => {
    id("delete-text").innerText = `Are you sure you want to delete ${project.name} Bingo? This can NOT be undone.`
    id<HTMLDialogElement>("delete-confirm").showModal();
})

id("delete-no").addEventListener("click", () => id<HTMLDialogElement>("delete-confirm").close())
id("delete-yes").addEventListener("click", () => {
    set("index", get<string[]>("index").filter(i => i !== project.id));
    localStorage.removeItem(project.id);
    location.replace("index.html")
})

id<HTMLInputElement>("free-space").checked = project.freeSpace;
id("free-space").addEventListener("input", () => {
    project.freeSpace = id<HTMLInputElement>("free-space").checked;
    updateItemCountText();
    saveProject();
})

id("save").addEventListener("click", () => {
    const
        file = new Blob([JSON.stringify(project)], { type: 'text/plain' }),
        a = document.createElement("a"),
        url = URL.createObjectURL(file);

    a.href = url;
    a.download = project.name
        .slice(0, 50) // maximum of 50 characters
        .toLowerCase()
        .replace(/[ _/\\!@#$%^&*()=+"';:\|\]\[.,]/g, "-") // normalize special characters
        .replace(/-+/g, "-") // convert groups of dashes (---) into one dash (-)
        + ".bingo"; // add file extension

    a.click();
    a.remove();
    URL.revokeObjectURL(url);
})

id<HTMLInputElement>("create-item").addEventListener("keypress", event => {
    if (event.key !== "Enter")
        return;

    const item = id<HTMLInputElement>("create-item").value.trim();

    if (item === "" || project.items.includes(item))
        return;

    project.items.push(item);
    saveProject();
    addItem(item);
    id<HTMLInputElement>("create-item").value = "";
})

function addItem(item: string) {

    const div = document.createElement("div");
    div.className = "item";
    id("items").prepend(div);

    div.appendChild(document.createElement("span")).innerText = item;

    const button = div.appendChild(document.createElement("button"));
    button.classList.add("red");
    button.title = "Delete Item"

    button.appendChild(document.createElement("i")).className = 
        "fa-solid fa-trash";

    button.addEventListener("click", () => {
        // delete item

        project.items = project.items.filter(i => i !== item);

        for (const child of id("items").children)
            if (child.querySelector("span")?.innerText === item)
                child.remove();

        updateItemCountText();
        saveProject();
    })

    updateItemCountText();

}

function updateItemCountText() {
    const required = 25 - (project.freeSpace ? 1 : 0);

    id("item-count").innerText = `Items - ${project.items.length}`

    if (project.items.length - required < 0)
        id("item-count").innerText += ` (${required - project.items.length} more required)`
}

for (const item of project.items)
    addItem(item);

updateItemCountText(); // just in case there were zero items