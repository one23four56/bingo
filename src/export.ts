import { Project, get } from './index';

const
    params = new URLSearchParams(location.search),
    projectId = params.get("project") as string,
    cards = Number(params.get('cards')),
    hideBingoTitle = params.has('hide-bingo-title') as boolean;

// if the project does not exist, redirect home
if (typeof projectId !== "string" || !localStorage.getItem(projectId) || isNaN(cards))
    window.open("index.html", "_self");

const project: Project = get(projectId);

document.title = project.name + " Bingo"

for (let card = 1; card <= cards; card++) {

    // create list 
    const list: string[][] = [];
    let copy: string[] = [];

    for (const item of project.items)
        copy.push(item);

    for (let i = 1; i <= 5; i++) {

        const row: string[] = [];

        for (let j = 1; j <= 5; j++) {

            if (i === 3 && j == 3 && project.freeSpace) {
                row.push("FREE SPACE");
                continue;
            }

            const pick = Math.floor(Math.random() * copy.length);
            row.push(copy[pick]);

            copy = copy.filter((_v, index) => index !== pick);
        }

        list.push(row);
    }

     document.body.appendChild(document.createElement("h1")).innerText =
        project.name + (hideBingoTitle ? "" : "Bingo");

    document.body.appendChild(document.createElement("p")).innerText =
        `Card ${card}`;

    const table = document.body.appendChild(document.createElement("table"));

    table.appendChild(document.createElement("tr")).append(
        ..."BINGO".split("").map(l => {
            const th = document.createElement("th");
            th.innerText = l;
            return th;
        })
    )

    for (const row of list) {
        const tr = table.appendChild(document.createElement("tr"));

        for (const col of row) 
            tr.appendChild(document.createElement("td")).appendChild(document.createElement("div")) 
                .innerText = col;

    }
}

document.body.appendChild(document.createElement("h1")).innerText = project.name + " Bingo (List)"

const list = document.body.appendChild(document.createElement("ol"));

for (const item of project.items)
    list.appendChild(document.createElement("li")).innerText = item;

window.print();
setTimeout(() => window.close(), 100);
