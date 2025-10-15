import { defineMermaidSetup } from '@slidev/types'

export default defineMermaidSetup(() => {
  return {
    theme: 'base',
    themeCSS: `
    .actor, .default polygon, .default rect, .default g, .default path {
      fill: #283149 !important;
      stroke: white !important;
    }
    .actor-line {
      stroke: #283149 !important;
    }
    .default:hover polygon, .default:hover rect, .default:hover g, .default:hover path, .default p:hover {
      fill: blue !important;
      stroke: white !important;
      cursor: pointer !important;
    }
    .actor, .default p {
      color: white !important;
    }
    .actor tspan {
      fill: white !important;
    }
    .edgeLabel p {
      background-color: #ffffff !important;
    }
    .cluster rect {
      stroke: black;
      fill: white !important;
    }
    .nodeLabel {
      color: white !important;
    }
    `
  }
})
