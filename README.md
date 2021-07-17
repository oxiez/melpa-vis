# Milkypostman’s Emacs Lisp Package Archive Visualization
Visualizes MELPA as a force directed graph with D3.

![Dark Mode Visualization](./img/galaxy.png)

## Instructions
A live version is available at: https://nfusionz.github.io/melpa-vis/

If you wish to run it locally, download the necessary data files from `melpa.org/archive.json` and `melpa.org/download_counts.json` into the `dist` folder. Then, run

```
npm install
npm run build
npm start
```

to start the webserver. The site should be accessible at `localhost:8080`.
