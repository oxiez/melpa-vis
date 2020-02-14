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
    "bib": "late",
    "biblatex": "latex",
    "latex": "latex",
    "bibtex": "latex",
    "comm": "comm"
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

    get background() { return this.palette.background; }

    get nodeColorFunc() {
        return (function(node) {
            if (node.downloads == null) return this.palette.groups.elpa;
            if (!node.keywords) return this.palette.groups.default;
        
            for(const keyword of node.keywords) {
                if (keyword in keyword_groups)
                    return this.palette
                               .groups[keyword_groups[keyword]];
            }

            return this.palette.groups.default;
        }).bind(this);
    }

    onColorChange() {    
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

            // TODO: Replace color hack
            this.legend
                .selectAll("li")
                .data(legend)
                .enter()
                .append("li")
                .attr("class", "legend")
                .attr("style", group => "color:" + group.color)
                .text(group => group.label);

        }

        return this.nodeColorFunc;
    }


    registerListeners(on_color_chng) {
        this.select
            .on("change", on_color_chng);
    }
}
