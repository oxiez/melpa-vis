import * as d3 from "d3";
export { DependencyModelFactory, DependencyModel };

const DependencyModelFactory = (function() {
    return {
        getInstance: function(archive_url, downloads_url) {
            const model = new DependencyModel(archive_url, downloads_url);
            return model.done.then(model => model);
        }
    }
})();

class DependencyModel {
    constructor(archive_url = "archive.json",
                downloads_url = "download_counts.json") {
        
        const archive_promise = d3.json(archive_url);
        const download_promise = d3.json(downloads_url);

        this.done = Promise.all([archive_promise, download_promise])
                           .then(this.generateGraph);
        
    }

    get nodes() { return this.nodeList; }
    get links() { return this.linkList; }

    generateGraph(responses) {
        this.generateNodes(responses);
        this.generateLinks();
    }

    /**
     * Returns an object containing an object of packages,
     * a list of nodes, and a list of links.
     * @param {number} json
     */
    generateNodes(responses) {
        const packages = responses[0];
        const downloads = responses[1];

        this.index = {};
        this.nodeList = Object.keys(json).map(
            name => this.generateNode(name, packages[name])
        );
        
        this.nodeList.forEach(node => {
            this.index[node.name] =  node;

            if (node.name in downloads) {
                this.index[node.name]["downloads"] = downloads[node.name];
            }
        }, this);
    }

    /**
     * @param {string} name
     * @param {Object} name
     */
    generateNode(name, element) {
        let authors = null;
        let keywords = [];
        let children = [];

        if (element["props"] !== null) {
            authors = element["props"]["authors"];
            keywords = element["props"]["keywords"];
        }

        if (element["deps"] !== null) {
            children = Object.keys(element["deps"]);
        }
            
        return {
            name,
            desc: element["desc"],
            authors,
            keywords,
            children
        };
    }

    /**
     * Generate links based on this.nodes and this.index
     */
    generateLinks() {
        this.linkList = [];

        this.nodeList.forEach(source => {
            source.children.forEach(target => {
                this.linkList.push({
                    source,
                    target
                });
            }, this);
        }, this);
    }
}
