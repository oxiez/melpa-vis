import * as d3 from "d3";
import ForceSimulation from "ForceSimulation";
import DependencyGraphView from "DependencyGraphView";
import { DependencyModelFactory, DependencyModel } from "DependencyModel";

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
        

    }

}
