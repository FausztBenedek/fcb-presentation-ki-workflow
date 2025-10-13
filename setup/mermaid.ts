import { defineMermaidSetup } from '@slidev/types'

export default defineMermaidSetup(() => {
  return {
    theme: 'base',
    themeCSS: `
    .default polygon, .default rect, .default g, .default path {
      fill: #283149 !important;
      stroke: white !important;
    }
    .default:hover polygon, .default:hover rect, .default:hover g, .default:hover path, .default p:hover {
      fill: blue !important;
      stroke: white !important;
      cursor: pointer !important;
    }
    .default p {
      color: white !important;
    }
    .edgeLabel p {
      background-color: #ffffff !important;
    }
    .cluster rect {
      stroke: black;
      fill: white !important;
    }
    `
  }
})
