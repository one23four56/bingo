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