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

        view.registerListeners(this.filter.bind(this),
                               this.clear.bind(this));
        simulation.registerListener(this.onTick.bind(this));

        model.then(data => {
            this.filter();
            // view.displayGraph(data.nodes, data.links);
            // simulation.updateGraph(data.nodes, data.links);
        });
    }

    filter() {
        this.model.then(data => {
            const results = data.getFilteredResults(this.view.filters);

            if (results.nodes.length !== 0) {                
                this.view.displayGraph(results.nodes, results.links);
                this.simulation.updateGraph(results.nodes, results.links);
            } else {
                console.log("No results found.");
            }
        });
    }

    clear() {
        
    }

    onTick() {
        this.view.onTick.bind(this.view)();
    }

}
