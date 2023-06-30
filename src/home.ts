import { id, Project, set, get } from ".";

id("create-button").addEventListener("click", () => {

    const project: Project = {
        id: crypto.randomUUID(),
        name: "Untitled",
        items: [],
        time: Date.now(),
        formatVersion: 1,
    };

    set("index", [...get<string[]>("index", "[]"), project.id]);
    set(project.id, project);

    window.open(`project.html?project=${project.id}`, "_self")

})

const projects = get<string[]>("index", "[]")
    .map(i => get<Project>(i))
    .sort((a, b) => b.time - a.time);

if (projects.length === 0)
    id("main").appendChild(document.createElement("em")).innerText =
        "It looks like you have no projects. To get started, click the 'Create New Project' button.";

id("main").appendChild(document.createElement("hr"));

for (const project of projects) {
    const a = id("main").appendChild(document.createElement("a"));
    a.className = "project";
    a.href = `project.html?project=${project.id}`
    a.title = `Open ${project.name} Bingo`

    a.appendChild(document.createElement("i")).className =
        "fa-solid fa-arrow-right hidden"

    const span = a.appendChild(document.createElement("span"));
    span.innerText = project.name + " Bingo"
    span.appendChild(document.createElement("br"));
    span.appendChild(document.createElement("em")).innerText = new Date(project.time).toLocaleString("en-US", {
        month: 'short',
        day: "numeric",
        hour: 'numeric',
        minute: 'numeric'
    })

    id("main").appendChild(document.createElement("hr"));

}