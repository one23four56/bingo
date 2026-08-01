//@ts-check
// doing this in js so i don't have to worry about compiling it lol
import * as esbuild from 'esbuild';
import process from 'process';
import fs from 'fs/promises';

const entryPoints = [
    'export',
    'home',
    'project'
]

// true if executed with 'pack' argument, ie compile in pack mode
const pack = process.argv[2] === "pack";

console.log(`[build]: building in ${pack ? "pack" : "dev"} mode`);
console.time("[build]: build completed in");

const existing = await Promise.all(
    entryPoints
        .flatMap((e) => [`static/${e}.js`, `static/${e}.js.map`])
        .map(file => fs.unlink(file).then(_ => true, _ => false))
).then(r => r.filter(v => v).length);

if (existing != 0) {
    console.log(`[build]: removed ${existing} existing file${existing == 1 ? "" : "s"}`);
}

const context = await esbuild.context({
    entryPoints: entryPoints.map(e => "src/" + e + ".ts"),
    bundle: true,
    outdir: 'static',
    format: "iife",
    loader: {
        ".html": "text",
        ".css": "text"
    },
    minify: pack,
    sourcemap: !pack,
});

if (pack) {
    await context.rebuild();
    console.timeEnd("[build]: build completed in");

    console.log(`[build]: \`static\` folder ready for production`)
    process.exit(0);
} else {
    await context.watch();
    console.timeEnd("[build]: build completed in");
    console.log("[build]: watch mode is enabled. any file changes will trigger automatic recompilation")
    const { port } = await context.serve({
        servedir: "static",
    });
    console.log(`[build]: \`static\` folder hosted on port ${port}`);
}

