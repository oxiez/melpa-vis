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
            this.svg
                .selectAll("circle.node");

        this.links =
            this.svg
                .selectAll("line.link");
    }

    displayGraph(nodes, links) {
        this.nodes =
            this.svg
                .selectAll("circle.node")
                .remove()
        this.links =
            this.svg
                .selectAll("line.link")
                .remove();
        
        this.links =
            this.svg
                .append("g")
                .attr("stroke", "#999")
                .attr("stroke-opacity", 0.6)
                .selectAll("line.link")
                .data(links)
                .enter()
                .append("svg:line")
                .attr("class", "link");

        this.nodes =
            this.svg
                .append("g")
                .selectAll("circle.node")
                .data(nodes, node => node.name)
                .enter()
                .append("svg:circle")
                .attr("class", "node")
                .attr("r", 5);

    }

    /**
     * Function to register with a ForceSimulation.
     */
    onTick() {
        this.links
            .attr("x1", link => link.source.x)
            .attr("y1", link => link.source.y)
            .attr("x2", link => link.target.x)
            .attr("y2", link => link.target.y);

        this.nodes
            .attr("cx", node => node.x)
            .attr("cy", node => node.y);

    }
}
