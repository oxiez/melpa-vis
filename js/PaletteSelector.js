import * as d3 from "d3";
import Palette from "Palette";

// Background: 121212
const keyword_groups = {
    "languages": "languages",
    "convenience": "convenience",
    "theme": "look",
    "themes": "look",
    "faces": "look",
    "completion": "completion",
    "company": "completion",
    "auto-complete": "completion",
    "games": "games",
    "tools": "tools",
    "util": "tools",
    "extensions": "tools",
    "calendar": "tools",
    "tex": "latex",
    "bib": "latex",
    "biblatex": "latex",
    "latex": "latex",
    "bibtex": "latex",
    "comm": "comm"
};

const simple_groups = {
    "languages": "languages",
    "convenience": "convenience",
    "theme": "look",
    "themes": "look",
    "faces": "look",
    "completion": "convenience",
    "company": "convenience",
    "auto-complete": "convenience",
    "games": "convenience",
    "tools": "convenience",
    "util": "convenience",
    "extensions": "convenience",
    "calendar": "convenience",
    "tex": "languages",
    "bib": "languages",
    "biblatex": "languages",
    "latex": "languages",
    "bibtex": "languages",
    "comm": "convenience"
};

const labels = {
    "default": "Default",
    "elpa": "ELPA Packages",
    "languages": "Languages",
    "convenience": "Convenience",
    "look": "Look & Feel",
    "completion": "Auto-Completion",
    "games": "Games",
    "tools": "Tools",
    "latex": "Latex",
    "comm": "Internet Tools"
};

export default class PaletteSelector {
    constructor(selector, palettes) {
        this.palette = palettes.default;
        this.palettes = palettes;
        this.body = d3.select("body"); // For background color

        this.select = d3.select(selector)
                        .select("select");

        this.options = this.select
                           .selectAll("option");

        console.log(palettes);

        this.options
            .data(Object.values(palettes))
            .enter()
            .append("option")
            .attr("value", palette => palette.id)
            .text(palette => palette.label);

        this.legend = d3.select(selector)
                        .select("ul");

    }

    get colorPaletteId() { return this.select.property("value"); }

    get background() { return this.palette.background; }

    nodeColorFunc(keyword_mapping) {
        return (function(node) {
            if (node.downloads == null) return this.palette.groups.elpa;
            if (!node.keywords) return this.palette.groups.default;
        
            for(const keyword of node.keywords) {
                if (keyword in keyword_mapping)
                    return this.palette
                               .groups[keyword_mapping[keyword]];
            }

            return this.palette.groups.default;
        }).bind(this);
    }

    get link_color() { return this.palette.links; }

    get node_stroke() { return this.palette.node_stroke; }

    onColorChange(source, metric_range) {
        this.palette = this.palettes[this.colorPaletteId];

        this.body
            .style("background-color", this.palette.background)
            .style("color", this.palette.text);
            
        
        if(this.palette.metric === "categorical") {
            const legend =
              Object.keys(this.palette.groups)
                    .map(group => { return {
                        color: this.palette.groups[group],
                        label: labels[group]
                    }; });

            this.legend
                .selectAll("li")
                .remove();

            this.legend
                .selectAll("li")
                .data(legend)
                .enter()
                .append("li")
                .attr("class", "legend")
                .style("color", group =>  group.color)
                .text(group => group.label);

            return this.nodeColorFunc(keyword_groups);

        } else if(this.palette.metric === "simple") {
            const legend =
              Object.keys(this.palette.groups)
                    .map(group => { return {
                        color: this.palette.groups[group],
                        label: labels[group]
                    }; });

            this.legend
                .selectAll("li")
                .remove();

            // TODO: Replace color hack
            this.legend
                .selectAll("li")
                .data(legend)
                .enter()
                .append("li")
                .attr("class", "legend")
                .style("color", group => group.color)
                .text(group => group.label);

            return this.nodeColorFunc(simple_groups);
        } else if(this.palette.metric === "distance") {
            return node => {
                console.log(node.name + node.distances[source] + metric_range[1]);
                return d3.interpolateOrRd(node.distances[source] / metric_range[1]);
            };
        } else { // B & W
            this.legend.selectAll("li").remove();
            
            return this.palette.groups;
        }
    }


    registerListeners(on_color_chng) {
        this.select
            .on("change", on_color_chng);
    }
}
