# bingo

A simple website that lets you create custom Bingo cards for any occasion.

## How to Use

To start, create your own project with the "Create New Project" button, or import a `.bingo` file from your computer with the the "Import from Computer" button.

You can change the name of a project by clicking in the header, and you can add items by typing in the "Add items here..." box.

Once you have 24 (or 25 with no free space) items, you can click the "Export" button to generate cards and print them or save them as a PDF.

## Host it Yourself

If you wish to host this site yourself, you can find pre-minified site files in `static.zip` under the Assets section of the [latest release](https://github.com/one23four56/bingo/releases/latest).

If you want to minify the files yourself, simply:

1. `git clone` this repo
2. Run `npm install`
3. Run `npm run pack`

The resulting `static` directory will be production-ready.

## Development

To set up a local copy of this site for development purposes, simply:

1. `git clone` this repo
2. Run `npm install` to install dependencies (esbuild)
3. Run `npm run build` to start the build watcher and locally host the `static` directory

When the build watcher is active, any changes to TypeScript files will automatically trigger a rebuild, so you don't need to do anything.
