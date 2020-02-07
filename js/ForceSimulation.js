import * as d3 from "d3";

export default class ForceSimulation {
    constructor(link_distance = 700,
                force_repulse = -5000) {

        this.link_distance = link_distance;
        this.force_repulse = force_repulse;
        
        this.force = d3.forceSimulation()
                       .force("charge", d3.forceManyBody()
                                          .strength(force_repulse))
                       .force("x", d3.forceX())
                       .force("y", d3.forceY())
                       .on("tick", this.listener);

    }

    pause() {
        this.force.stop();
    }

    resume() {
        this.force.alpha(1).alphaTarget(0).restart();
    }

    updateGraph(nodes, links) {
        this.pause();

        this.force
            .nodes(nodes)
            .force("link", d3.forceLink(links)
                             .id(node => node.name)
                             .distance(this.link_distance));
 
        this.resume();
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
