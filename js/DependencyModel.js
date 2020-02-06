import * as d3 from "d3";
export { DependencyModelFactory, DependencyModel };

const DependencyModelFactory = (function() {
    return {
        getInstance: function(archive_url, downloads_url) {
            const model = new DependencyModel(archive_url, downloads_url);
            return model.done.then(_ => model);
        }
    }
})();

class DependencyModel {
    constructor(archive_url = "archive.json",
                downloads_url = "download_counts.json") {
        
        const archive_promise = d3.json(archive_url);
        const download_promise = d3.json(downloads_url);

        this.done = Promise.all([archive_promise, download_promise])
                           .then(this.generateGraph.bind(this));
    }

    get nodes() { return this.node_list; }
    get links() { return this.link_list; }

    generateGraph(responses) {
        this.generateNodes(responses);
        this.generateLinks();
    }
    
    generateNodes(responses) {
        const packages = responses[0];
        const downloads = responses[1];

        this.index = {};
        this.node_list = Object.keys(packages).map(
            name => this.generateNode(name, packages[name])
        );

        const tmp = [];
        
        this.node_list.forEach(node => {
            this.index[node.name] = node;

            // Some packages come with deps outside of MELPA
            node.parents.forEach(parent => {
                if (!(parent in this.index)) {
                    this.index[parent] = {
                        name: parent,
                        desc: "A package not listed in MELPA.",
                        keywords: [],
                        parents: []
                    }

                    tmp.push(this.index[parent])
                }
            }, this);
            
            if (node.name in downloads) {
                this.index[node.name]["downloads"] = downloads[node.name];
            }
        }, this);

        this.node_list = this.node_list.concat(tmp);
    }

    /**
     * @param {string} name
     * @param {Object} element
     */
    generateNode(name, element) {
        let authors = null;
        let keywords = [];
        let parents = [];

        if (element["props"] !== null) {
            authors = element["props"]["authors"];
            keywords = element["props"]["keywords"];
        }

        if (element["deps"] !== null) {
            parents = Object.keys(element["deps"]);
        }
            
        return {
            name,
            desc: element["desc"],
            authors,
            keywords,
            parents
        };
    }

    /**
     * Generate links based on this.nodes and this.index
     */
    generateLinks() {
        this.link_list = [];

        this.node_list.forEach(target => {
            target.parents.forEach(source => {
                this.link_list.push({
                    source,
                    target
                });
            }, this);
        }, this);
    }
}
