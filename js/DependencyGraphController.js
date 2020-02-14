import * as d3 from "d3";
import ForceSimulation from "ForceSimulation";
import DependencyGraphView from "DependencyGraphView";
import { DependencyModel } from "DependencyModel";
import PaletteSelector from "PaletteSelector";

export default class DependencyGraphController {

    /**
     * @param {ForceSimulation} simulation
     * @param {Promise<DepdendencyModel>} model
     * @param {DependencyGraphView} view
     * @param {PaletteSelector} palette_select
     */
    constructor(simulation, model, view, palette_select) {
        this.simulation = simulation;
        this.model = model;
        this.view = view;
        this.palette = palette_select;

        view.registerListeners(this.filter.bind(this), this.pause.bind(this));
        simulation.registerListener(this.onTick.bind(this));
        palette_select.registerListeners(this.onColorChange.bind(this));

        model.then(data => {
            // Use default filtering options
            this.filter();
        });
    }

    onColorChange() {
        const nodeColorFunc = this.palette.onColorChange();
        this.view.onColorChange(nodeColorFunc);
    }

    filter() {
        this.model.then(data => {
            const results = data.getFilteredResults(this.view.filters);

            if (results.nodes.length !== 0) {
                this.simulation.updateGraph(results.nodes, results.links);
                this.view.displayGraph(results.nodes, results.links);
                const nodeColorFunc = this.palette.onColorChange();
                this.view.onColorChange(nodeColorFunc);
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
