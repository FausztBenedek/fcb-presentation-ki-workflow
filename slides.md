---
theme: seriph
favicon: https://www.fcb-solutions.de/wp-content/uploads/2022/06/cropped-Logo_Blau-192x192.png
title: FCB - KI Workflow
transition: slide-left
background: #f9f5f4
---

# KI Workflows bei Versicherungen
<script setup>
import { useNav } from '@slidev/client'
import { onMounted } from 'vue'

const nav = useNav()

let previous = undefined

onMounted(() => {
  window.addEventListener('keydown', (e) => {
    // Example: press Shift + S to go to slide 7
    console.log("navigate")
    if (e.key === 'e') {
      let current = nav.currentSlideNo.value
      if (4 == current) {
        nav.go(previous)
        previous = undefined
      } else {
        previous = current
        nav.go(4)
      }
    }
  })
})
</script>


---

<div style="height: 100%;">

# Wenn ihr mit dem Handy folgen wollt

## https://fausztbenedek.github.io/fcb-presentation-ki-workflow
<img src="./public/qrcode.svg" style="height: 90%; margin: auto;"/>
</div>


---

# Wichtige Terminologie

- Prompt
- Context
- LLM (Large Language Model)
- Embeddings?
- AI Agents?
- Open Source und Open Source LLMs

---

# Architektur

<style>
/* Hack to make the big mermaid diagram scrollable */
.slidev-layout {
    overflow: scroll;
}
</style>

<div>

```mermaid

graph TD
    %% Explanations:
    llm[[In diesem Box wird ein LLM angesprochen]]
    api_call{{In diesem Box wird eine API angesprochen}}

    __START__(Start)
    __START__ --> Pre-process
    subgraph Pre-process
        customer_data_extract[["Auslesen von Versicherungsnummer aus dem Text"]]
        fetch_customer_details{{"Abruf von Kundeninformationen durch API"}}
        router[["Router"]]
        customer_data_extract --> fetch_customer_details
        fetch_customer_details --> router
    end
    router -->|Alle andere GVOs| uncovered
    router --> Kündigung
    router --> Adressänderung
    subgraph Core
        subgraph Kündigung
            fetch_customer_documents{{"Abruf von Kundenspezifischen Dokumente"}}
            termination_handled_by_llm[["Kündigung durch LLM behandeln lassen"]]
            termination_handling{{"Eigentliche behandlung der Kündigung"}}
            fetch_customer_documents --> termination_handled_by_llm
            termination_handled_by_llm --> termination_handling
        end
        termination_handling --> answer

        subgraph Adressänderung
            address_data_extract[["Auslesen von Adressdaten"]]
            address_change_execute{{"Ausführung der Adressänderung"}}
            address_data_extract --> address_change_execute
        end
        address_change_execute --> answer

    end
    answer{{"Antwort an Kunde"}}
    todo_node("TODO: Wir haben noch nicht spezifiziert, was passieren soll?")
    fetch_customer_details --> |"Kunde im System nicht gefunden"|todo_node
    customer_data_extract --> |"Versicherungsnummer ist nicht in der Email"|todo_node
    answer --> __END__
    todo_node --> __END__
    __END__(Ende)
    uncovered("Nicht bearbeitbar") --> __END__;

```

</div>

---

<style>
.container {
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
}
</style>

<div class="container">
<div>

# Pre process

- Um GeVo bearbeiten zu können brauchen wir folgende Informationen:
    - Was ist der Stand im Bestandsystem
    - Möglichst weitere Dokumente
- Und so kommen wir auf folgende Pre process Flow
</div>

<div style="justify-self: center; display: flex; align-items: center;">

```mermaid
graph TD
  customer_data_extract[["Versicherungsnummer aus dem Text der Kundenanfrage auslesen"]]
  fetch_customer_details{{"Abruf von Kundeninformationen durch API"}}
  router[["Router"]]
  customer_data_extract --> fetch_customer_details
  fetch_customer_details --> router

```
</div>
</div>


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
graph LR
fetch_customer_documents{{"Kundenspezifischen Dokumente abrufen"}}
termination_handled_by_llm[["Kündigung durch LLM behandlen lassen (Entscheidung treffen + Antwort formulieren)"]]
fetch_customer_documents --> termination_handled_by_llm
termination_handled_by_llm --> termination_execute
termination_handled_by_llm --> termination_escalate_to_human
termination_handled_by_llm --> termination_deny
termination_handled_by_llm --> ask_for_more_information
subgraph "Eigentliche Behandlung"
    termination_execute{{"Ausführung der Kündigung"}}
    termination_escalate_to_human{{"Weiterleitung einem menschlichen Sachbearbeiter"}}
    termination_deny("Ablehnung der Kündigung")
    ask_for_more_information("Weite Informationen von der Kunde nötig")
end 
answer{{Antwort an Kunde}}
termination_execute --> answer
termination_deny --> answer
termination_escalate_to_human --> |#quot;Ich habe es an einem menschlichen Mitarbeiter eskaliert #quot;|answer
ask_for_more_information --> answer

```

---

# Addressveränderung

- Es wird gerade daran gearbeitet

---
layout: center
---

# Pheww

---

<style>
.evaluations-container {
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    height: 100%;
}
</style>

<div class="evaluations-container">
<div>

# Evaluierungen


- = Testen wie das KI leistet

<div v-click="1">

- Bislang haben wir nur für die Kündigung Evaluierungen
</div>
</div>

<div v-click="1">

```mermaid
graph LR

termination_handled_by_llm[["Kündigung durch LLM behandlen lassen (Entscheidung treffen + Antwort formulieren)"]]
termination_handled_by_llm --> Evaluierungen
subgraph Evaluierungen
direction LR
    right_decision[["Wurde die Richtige Entscheidung getroffen?"]]
    answer_conciseness[["Ist die Antwort stilistisch korrekt?"]]
    other("...")
end
termination_handling{{"Eigentliche behandlung der Kündigung"}}
Evaluierungen --> termination_handling
```

</div>
</div>

---
layout: two-cols-header
---

# Evaluierungen

(Es gibt menschliche und LLM basierte Evaluierungen)

::left::

## Platz

- Können / Sollen irgendwo im System sein
    - Nach dem Router, um zu evaluieren, ob der Router die Richtige Entscheidung getroffen hat
    - Nach dem die Antwort an der Kunde versendet wurde (= Monitoring)

::right::

## Nützlichkeit

- Hilfe bei Fehlersuche
- Monitoring beim Update

## Nachteile

- Kostet Geld

(Man muss nicht 100% des Verkehrs durch die Evaluierung Pipeline durchführen lassen)
