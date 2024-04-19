import { id, Project, set, get, isProject, alert } from ".";

id("create-button").addEventListener("click", () => {

    const project: Project = {
        id: crypto.randomUUID(),
        name: "Untitled",
        items: [],
        time: Date.now(),
        freeSpace: true,
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

id("import-button").addEventListener("click", () => {

    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".bingo"

    input.addEventListener("change", async () => {
        if (!input.files || !input.files[0])
            return;

        const file = input.files[0], text = await file.text();

        try {
            const object = JSON.parse(text);
            let endMessage: string | null = null;
            
            if (!isProject(object))
                throw new Error("Extracted object does not properly implement Project");
            
            if (get<string[]>("index", "[]").includes(object.id)) {
                object.id = crypto.randomUUID();
                endMessage = `A project with the same ID already existed, so the ID of the uploaded project has been updated.`
            }

            set("index", [...get<string[]>("index", "[]"), object.id]);
            set(object.id, object);

            await alert(
                `The project '${object.name} Bingo' has been imported successfully.` +
                (endMessage ? `\n(Note: ${endMessage})` : ``)
            )

            window.open(`project.html?project=${object.id}`, "_self")
            
        } catch (err) {
            alert(`The file '${file.name}' is invalid.\n(${err})\nPlease make sure you upload a valid .bingo file`);
        }
    })

    input.click();
    setTimeout(() => input.remove(), 0);

})