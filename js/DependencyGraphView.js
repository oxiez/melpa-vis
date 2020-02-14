import * as d3 from "d3";

// From colorbrewer
const keyword_colors = {
    "languages": "#377eb8", // Language specific modes
    "convenience": "#4daf4a", // Generic category
    "theme": "#984ea3", // Look & Feel
    "themes": "#984ea3",
    "faces": "#984ea3",
    "completion": "#f781bf", // Completion Frameworks
    "company": "#f781bf",
    "auto-complete": "#f781bf",
    "games": "#e41a1c", // Games
    "tools": "#ff7f00", // Utilities / Tools / Extensions
    "util": "#ff7f00",
    "extensions": "#ff7f00",
    "calendar": "#ff7f00",
    "tex": "#a65628", // LaTeX
    "bib": "#a65628",
    "biblatex": "#a65628",
    "latex": "#a65628",
    "bibtex": "#a65628",
    "comm": "#ffff33" // Internet Utility
};

export default class DependencyGraphView {
    constructor(selector,
                width = "100%",
                height = "100%",
                line_opacity = 0.5) {

        this.svg = d3.select(selector)
                     .append("svg")
                     .attr("width", width)
                     .attr("height", height);

        // https://observablehq.com/@mbostock/mobile-patent-suits
        this.svg
            .append("svg:defs")
            .append("svg:marker")
            .attr("id", "arrowhead")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 35)
            .attr("refY", 0)
            .attr("fill", "#722F37")
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5");

        this.g = this.svg
            .append("g")
            .attr("class", "all");

        this.zoom = d3.zoom()
                      .scaleExtent([0.04,6])
                      .on("zoom", () => this.g.attr("transform", d3.event.transform) );
        
        this.svg
            .call(this.zoom)
            .call(this.zoom.transform,
                  d3.zoomIdentity
                    .translate(900, 600)
                    .scale(0.065));

        // Ensure nodes on top
        this.links = this.g
                         .append("g")
                         .attr("class", "links")
                         .attr("stroke-width", "2")
                         .attr("stroke-opacity", line_opacity);
                
        this.nodes = this.g
                         .append("g")
                         .attr("class", "nodes")
                         .attr("opacity", 0.8);

        this.text = this.g
                        .append("svg:text")
                        .attr("class", "info")
                        .attr("text-anchor", "middle");

        this.search = d3.select("#search");
        this.downloads = d3.select("#downloads");
        this.d_not_null = d3.select("#dnotnull");
        this.filter = d3.select("#filter");
        this.pause_button = d3.select("#pause");
        this.descendants = d3.select("#descendants");
        this.dependencies = d3.select("#dependencies");
    }

    registerListeners(filter, pause) {
        this.filter.on("click", filter);

        this.pause_button.on("click", pause);
    }

    pause(resume) {
        this.pause_button.property("value", "Resume");
        const pause_listener = this.pause_button.on("click");

        
        this.pause_button.on("click", () => {
            resume();
            this.pause_button.on("click", pause_listener);
            this.pause_button.property("value", "Pause");
        });
    }

    get filters() {
        return {
            search: this.search.property("value"),
            downloads: this.downloads.property("value"),
            dnotnull: this.d_not_null.property("checked"),
            descendants: this.descendants.property("checked"),
            dependencies: this.dependencies.property("checked")
        };
    }
    
    displayGraph(nodes, links) {
        this.g
            .selectAll("text.info")
            .remove();
        
        this.nodes
            .selectAll("circle.node")
            .remove();
        
        this.links
            .selectAll("line.link")
            .remove();
        
        this.links
            .selectAll("line.link")
            .data(links)
            .enter()
            .append("svg:line")
            .attr("class", "link")
            .attr("marker-end", "url(#arrowhead)");

        this.nodes
            .selectAll("circle.node")
            .data(nodes, node => node.name)
            .enter()
            .append("svg:circle")
            .attr("class", "node")
            .attr("id", node => node.name)
            .attr("r", node => this.scaleNode(node))
            .on("mouseover", this.mouseOver.bind(this))
            .on("mouseout", this.mouseOut.bind(this));


        // Ensure text on top
        this.text = this.g
                        .append("svg:text")
                        .attr("class", "info")
                        .attr("text-anchor", "middle");
    }

    onColorChange(node_color, link_color, node_stroke) {
        this.nodes
            .selectAll("circle.node")
            .attr("fill", node_color)
            .attr("stroke", node_stroke)
            .attr("stroke-width", "20");

        this.links
            .selectAll("line.link")
            .attr("stroke", link_color);

        this.text
            .attr("fill", link_color);
    }

    scaleNode(node) {        
        if (node["downloads"] != null) {
            return (4*Math.log(node["downloads"])) + 2;
        } else {
            return 100;
        }
    }

    /**
     * Function to register with a ForceSimulation.
     */
    onTick() {

        this.nodes
            .selectAll("circle.node")
            .attr("cx", node => node.x)
            .attr("cy", node => node.y);

        this.links
            .selectAll("line.link")
            .attr("x1", link => link.source.x)
            .attr("y1", link => link.source.y)
            .attr("x2", link => link.target.x)
            .attr("y2", link => link.target.y);

    }

    mouseOver(node) {
        let downloads = "?";
        let rad = 2;
        if (node.downloads != null) {
            downloads = node.downloads;
            rad = (2*Math.log(node.downloads)) + 2;
        }
        
        this.text.attr("transform", "translate(" + node.x + "," + (node.y - rad - 30)+ ")")
            .text(node.name + ": " + downloads + " downloads")
            .attr("display", null);
    }

    mouseOut() {
        this.text.attr("display", "none");
    }
}
