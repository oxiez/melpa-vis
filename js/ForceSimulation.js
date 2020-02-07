import * as d3 from "d3";

export default class ForceSimulation {
    constructor(link_distance = 50,
                link_strength = null,
                force_repulse = -700) {

        this.link_distance = link_distance;
        this.link_strength = link_strength;
        this.force_repulse = force_repulse;
        
        this.force = d3.forceSimulation()
                       .force("link", d3.forceLink()
                                        .distance(link_distance)
                                        .strength(link_strength))
                       .force("charge", d3.forceManyBody()
                                          .strength(force_repulse))
                       .force("x", d3.forceX(900))
                       .force("y", d3.forceY(600));

    }

    updateGraph(nodes, links) {
        
        // There seems to be a bug with adding new nodes
        // see https://github.com/danielcaldas/react-d3-graph/issues/143
        // this.force = d3.forceSimulation()
        //                .on("tick", this.listener)
        //                .force("charge", d3.forceManyBody()
        //                                   .strength(this.force_repulse))
        //                .nodes(nodes)
        //                .force("link", d3.forceLink(links)
        //                                 .id(node => node.name)
        //                                 .distance(this.link_distance))
        //                .force("x", d3.forceX(900))
        //                .force("y", d3.forceY(600))
        //                .alpha(1)
        //                .alphaTarget(0)
        //                .restart();

        this.force
            .nodes(nodes)
            .force("link", d3.forceLink(links)
                             .id(node => node.name)
                             .distance(this.link_distance))
            .alpha(1)
            .alphaTarget(0)
            .restart();

    }

    /**
     * Binds a function to run per tick.
     * Removes the old callback with the passed function.
     * The callback does not take any parameters.
     * Call this before updateGraph
     * 
     * @param on_func The function to pass in.
     * @param obj The object to bind `this` to.
     */
    registerListener(on_func) {
        this.listener = on_func;
        
        this.force.on("tick", on_func);
    }

}
