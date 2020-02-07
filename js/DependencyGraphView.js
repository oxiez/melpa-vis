import * as d3 from "d3";

export default class DependencyGraphView {
    constructor(selector,
                width = "100%",
                height = "100%",
                line_opacity = 0.5) {

        this.svg = d3.select(selector)
                     .append("svg")
                     .attr("width", width)
                     .attr("height", height);

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
                         .attr("stroke", "#474747")
                         .attr("stroke-width", "2")
                         .attr("stroke-opacity", line_opacity);
                
        this.nodes = this.g
                         .append("g")
                         .attr("class", "nodes");

        this.info = this.g
                        .append("g")
                        .attr("class", "info");

        this.search = d3.select("#search");
        this.downloads = d3.select("#downloads");
        this.d_not_null = d3.select("#dnotnull");
        this.filter = d3.select("#filter");
        this.pause_button = d3.select("#pause");
    }

    registerListeners(filter, pause) {
        this.filter.on("click", filter);

        this.pause_button.on("click", pause);
    }

    pause(resume, onHover) {
        this.pause_button.property("value", "Resume");
        const pause_listener = this.pause_button.on("click");

        
        this.pause_button.on("click", () => {
            resume();
            this.pause_button.on("click", pause_listener);
            this.pause_button.property("value", "Pause");

            this.info
                .selectAll("boxes")
                .remove();
        });
    }

    get filters() {
        return {
            search: this.search.property("value"),
            downloads: this.downloads.property("value"),
            dnotnull: this.d_not_null.property("checked")
        };
    }
    
    displayGraph(nodes, links) {
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
            .attr("class", "link");

        this.nodes
            .selectAll("circle.node")
            .data(nodes, node => node.name)
            .enter()
            .append("svg:circle")
            .attr("class", "node")
            // .attr("name", node => node.name)
            .attr("r", node => this.scaleNode(node));
    }

    scaleNode(node) {        
        if (node["downloads"] != null) {
            return (2*Math.log(node["downloads"])) + 2;
        } else {
            return 2;
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
}
