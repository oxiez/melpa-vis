import * as d3 from "d3";

export default class ForceSimulation {
    constructor(link_distance = 30,
                max_repulse = 200) {

        this.link_distance = link_distance;
        this.max_repulse = max_repulse;
        
        this.force = d3.forceSimulation()
                       .force("link", d3.forceLink()
                                        .distance(link_distance))
                       .force("charge", d3.forceManyBody()
                                          .strength(-100)
                                          .distanceMax(max_repulse))
                       .force("x", d3.forceX(900))
                       .force("y", d3.forceY(600));

    }

    updateGraph(nodes, links) {
        this.force = this.force
                         .nodes(nodes)
                         .force("link", d3.forceLink(links)
                                          .id(node => node.name)
                                          .distance(this.link_distance))
                         .restart();
    }

    /**
     * Binds a function to run per tick.
     * Removes the old callback with the passed function.
     * The callback does not take any parameters.
     * 
     * @param on_func The function to pass in.
     * @param obj The object to bind `this` to.
     */
    registerListener(on_func) {
        this.force.on("tick", on_func);
    }

}
