import * as d3 from "d3";

export default class ForceSimulation {
    constructor(link_distance = 30,
                max_repulse = 200) {
        
        this.force = d3.forceSimulation()
                       .force("link", d3.forceLink()
                                        .distance(link_distance))
                       .force("charge", d3.forceManyBody()
                                          .distanceMax(max_repulse))
                       .force("x", d3.forceX())
                       .force("y", d3.forceY());

    }

    updateGraph(nodes, links) {
        this.force
            .nodes(nodes)
            .links(links)
            .restart();
    }

    /**
     * Binds a function to run per tick.
     * Removes the old callback with the passed function.
     * The callback does not take any parameters.
     */
    registerListener(on_func) {
        this.force.on("tick", on_func);
    }

}
