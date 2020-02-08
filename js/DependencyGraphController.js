import * as d3 from "d3";
import ForceSimulation from "ForceSimulation";
import DependencyGraphView from "DependencyGraphView";
import { DependencyModel } from "DependencyModel";

export default class DependencyGraphController {

    /**
     * @param {ForceSimulation} simulation
     * @param {Promise<DepdendencyModel>} model
     * @param {DependencyGraphView} view
     */
    constructor(simulation, model, view) {
        this.simulation = simulation;
        this.model = model;
        this.view = view;

        view.registerListeners(this.filter.bind(this), this.pause.bind(this));
        simulation.registerListener(this.onTick.bind(this));

        model.then(data => {
            // Use default filtering options
            this.filter();
        });
    }

    filter() {
        this.model.then(data => {
            const results = data.getFilteredResults(this.view.filters);

            if (results.nodes.length !== 0) {
                this.simulation.updateGraph(results.nodes, results.links);
                this.view.displayGraph(results.nodes, results.links);
            } else {
                window.alert("No packages matched your query.");
            }
        });
    }

    // Enables highlighting of packages
    pause() {
        this.simulation.pause();
        this.view.pause(this.resume.bind(this));
    }

    resume() {
        this.simulation.resume();
    }
    

    onTick() {
        this.view.onTick.bind(this.view)();
    }

}
