import * as d3 from "d3";

export default class DependencyGraphView {
    constructor(selector,
                width = "100%",
                height = "100%") {
        
        this.svg = d3.select(selector)
                     .append("svg")
                     .attr("width", width)
                     .attr("height", height);

        this.nodes =
            this.svg.selectAll("circle.node");

        this.links =
            this.svg.selectAll("line.link");
    }

    displayGraph(nodes, links) {
        this.nodes = this.svg
                         .selectAll("circle.node")
                         .remove()
        this.links =
            this.svg
                .selectAll("line.link")
                .remove();
        
        this.nodes =
            this.svg
                .selectAll("circle.node")
                .data(nodes, node => node.name) // Id function

        this.links =
            this.svg
                .selectAll("line.link")
                .data(links);
    }

    /**
     * Function to register with a ForceSimulation.
     */
    onTick() {

    }
}
