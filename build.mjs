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

console.timeEnd("[build]: build completed in");

if (pack) {
    for (const file of entryPoints) {
        try {
            await fs.unlink(`static/${file}.js.map`);
        } catch { }
    }
    console.log(`[build]: \`static\` folder ready for production`)
    process.exit(0);
} else {
    await context.watch();
    console.log("[build]: watch mode is enabled. any file changes will trigger automatic recompilation")
    const { port } = await context.serve({
        servedir: "static",
    });
    console.log(`[build]: \`static\` folder hosted on port ${port}`);
}

