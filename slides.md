---
theme: seriph
favicon: https://www.fcb-solutions.de/wp-content/uploads/2022/06/cropped-Logo_Blau-192x192.png
title: FCB - KI Workflow
transition: slide-left
background: #f9f5f4
---

# Mögliche KI Workflows bei Versicherungen
---

# Wichtige Terminologie

- Prompt
- LLM (Large Language Model)
- Embeddings?
- AI Agents?
- Open Source und Open Source LLMs

---

<style>
/* Hack to make the big mermaid diagram scrollable */
.slidev-layout {
    overflow: scroll;
}
/* This part is repeated from the svg itself, because if I copy the svg in here, it breaks otherwise */
.default polygon, .default rect {
  fill: #283149 !important;
  stroke: white !important;
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
</style>

<div>
<Diagram />
</div>

---

# Pre process

- Um GeVo bearbeiten zu können brauchen wir folgende Informationen:
    - Was ist der Stand im Bestandsystem
    - Möglichst weitere Dokumente
- Und so kommen wir auf folgende Pre process Flow

```mermaid
---
config:
  theme: 'base'
  themeCSS: |
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

---

graph LR
  customer_data_extract[["Auslesen von Versicherungsnummer aus dem Text"]]
  fetch_customer_details{{"Abruf von Kundeninformationen durch API"}}
  router[["Router"]]
  customer_data_extract --> fetch_customer_details
  fetch_customer_details --> router

```

---

# Router

- Entscheidet zwischen GeVos mithilfe einer LLM
- Promt sieht so aus (Natürlich komplizierter):

```markdown
Welchem GeVo gehört volgendem Kundenanfrage?

{Kundenanfrage einfach in dem Prompt kopiert}

Möglichkeiten:
- Addressveränderung
- Kündigung
- Ich kann es noch nicht
```

---

# Kündigung
```mermaid
---
config:
  theme: 'base'
  themeCSS: |
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

---

graph LR
    fetch_customer_documents{{"Abruf von Kundenspezifischen Dokumente"}}
    termination_execute_prep[["Überprüfung, und Vorbereitung der Kündigung"]]
    termination_execute{{"Ausführung der Kündigung"}}
    fetch_customer_documents --> |An diesem Punkt alle kundenspezifische Informationen sind vorhanden|termination_execute_prep
    termination_execute_prep --> termination_execute

```

