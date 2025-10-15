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

let previous = {}

onMounted(() => {
  window.addEventListener('keydown', (e) => {
    function onKeyToSlied(key, slide) {
        console.log("noKey")
        if (e.key === key) {
          console.log("pressed" + key )
          let current = nav.currentSlideNo.value
          if (slide == current) {
            nav.go(previous[key])
            previous[key] = undefined
          } else {
            previous[key] = current
            nav.go(slide)
          }
        }
    }
    onKeyToSlied('w', 4)
    onKeyToSlied('e', 9)
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


```mermaid

graph LR

    __START__(Start)
    __START__ --> pre_process
    pre_process("Entscheidung um welche GeVo die Kundenanfrage sich handelt")
    pre_process -->|Alle andere GVOs| uncovered
    pre_process --> termination
    pre_process --> address_change
    pre_process --> other
    subgraph Core
        termination("Kündigung")
        termination --> answer

        address_change("Addressveränderung")
        address_change --> answer

        other("...")
        other --> answer

    end
    answer{{"Antwort an Kunde"}}
    answer --> __END__
    __END__(Ende)
    uncovered("Nicht bearbeitbar") --> __END__;

```



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


```text
Sehr geehrte Damen und Herren,

hiermit kündige ich meine Lebensversicherung 
mit der Vertragsnummer LV-123456 zum 31.12.2025.

Mit freundlichen Grüßen

Max Mustermann
```


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
Welchem GeVo gehört folgende Kundenanfrage?

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
    router --> fetch_customer_documents
    router --> address_data_extract
    subgraph Core
        subgraph Kündigung
            fetch_customer_documents{{"Kundenspezifischen Dokumente abrufen"}}
            termination_handled_by_llm[["Kündigung durch LLM behandlen lassen (Entscheidung treffen + Antwort formulieren)"]]
            fetch_customer_documents --> termination_handled_by_llm
            termination_handled_by_llm --> termination_actual_handling
            termination_actual_handling{{"Wahre Behandlung der Kündigung bei Bedarf"}}
        end

        subgraph Adressänderung
            address_data_extract[["Auslesen von Adressdaten"]]
            address_change_execute{{"Ausführung der Adressänderung"}}
            address_data_extract --> address_change_execute
        end
        termination_actual_handling --> answer
        address_change_execute --> answer
        answer{{Antwort an Kunde}}

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


---

<style>
/* Hack to make the big mermaid diagram scrollable */
.slidev-layout {
    overflow: scroll;
}
</style>

# Beispielzeit

<table>

<tr v-click>
<td>
1. Auslesen von Versicherungsnummer aus dem Text
</td>

<td>

```text
Sehr geehrte Damen und Herren,

hiermit kündige ich meine Lebensversicherung 
mit der Vertragsnummer LV-123456 zum 31.12.2025.

Mit freundlichen Grüßen

Max Mustermann
```
</td>
</tr>
<tr v-click>


<td>

2. Abruf von Kundeninformationen durch API
</td>

<td>

```json
{
    "insurance_number": "LV-123456",
    "customer_inquiry": "Sehr geehrte ...",
    "customer_information:": {
        ...
    }
}
```
</td>

</tr>

<tr v-click>

<td>

3. Router
</td>
<td>

`Kündigung`
</td>
</tr>

<tr v-click>
<td>
4. Dokumentabrufe
</td>
</tr>

<tr v-click>
<td>
    5. Kündigung durch LLM behandlen lassen
</td>
<td>

```
Aktion: Kündigung Durchführen
```
```text
Sehr geehrter Herr Mustermann,

vielen Dank für Ihre Nachricht. Wir bestätigen hiermit die Kündigung Ihrer 
Lebensversicherung mit der Vertragsnummer LV-123456 zum 31.12.2025.

Mit freundlichen Grüßen
Ihr KI Assistent

```
</td>
</tr>


<tr v-click>
<td>
6. Evaluierungen
</td>
<td>

- Richtige Entscheidung: ✅
- Stilistisch: 🚫
</td>
</tr>

</table>

---

<style>
.slidev-layout {
    display: flex;
    flex-flow: column;
}
.function-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
}
.function-container .function-declaration {
    
    display: flex;
    justify-content: center;
    align-items: center;

}
.function-f {
    font-size: 150px;
}
.function-container .function-result {
    min-width: 150px;
}
.slidev-vclick-hidden.answers, .slidev-vclick-target.answers {
    display: none;
}
.answers.slidev-vclick-current {
    display: flex;
    flex-flow: column;
}
</style>


# LLM - Large Language Model


<div class="function-container">
<div class="function-declaration">
    <span class="function-f">f(</span>
        <span>
            <span>
            Can you explain the history of transistors and how they're relevant to computers? What is a transistor, and how exactly is it used to perform computations?
            </span>
            <br>
            <span v-click="2">Sure</span>
            <span v-click="3">,</span>
            <span v-click="4"> there</span>
            <span v-click="5"> are</span>
        </span>
    <span class="function-f"> )</span>
</div>
<span class="function-f">=</span>
<div class="function-result">
    <div v-click="1" class="answers">
        <table>
            <tr><td>39%</td><td>Sure</td></tr>
            <tr><td>36%</td><td>There</td></tr>
            <tr><td>9%</td><td>Of</td></tr>
            <tr><td>4%</td><td>Santiago</td></tr>
            <tr><td>3%</td><td>Absolutely</td></tr>
            <tr><td>1%</td><td>Certainly</td></tr>
            <tr><td>...</td></tr>
        </table>
    </div>
    <div v-click="2" class="answers">
        <table>
            <tr><td>53%</td><td>,</td></tr>
            <tr><td>38%</td><td>!</td></tr>
            <tr><td>7%</td><td>thing</td></tr>
            <tr><td>0%</td><td>.</td></tr>
            <tr><td>0%</td><td>-</td></tr>
            <tr><td>0%</td><td>!</td></tr>
            <tr><td>...</td></tr>
        </table>
    </div>
    <div v-click="3" class="answers">
        <table>
            <tr><td>52%</td><td>there</td></tr>
            <tr><td>33%</td><td>here</td></tr>
            <tr><td>7%</td><td>Santiago</td></tr>
            <tr><td>1%</td><td>visiting</td></tr>
            <tr><td>0%</td><td>one</td></tr>
            <tr><td>0%</td><td>let</td></tr>
            <tr><td>...</td></tr>
        </table>
    </div>
    <div v-click="4" class="answers">
        <table>
            <tr><td>98%</td><td>are</td></tr>
            <tr><td>1%</td><td>'s</td></tr>
            <tr><td>0%</td><td>is</td></tr>
            <tr><td>0%</td><td>`s</td></tr>
            <tr><td>0%</td><td>a</td></tr>
            <tr><td>0%</td><td>plenty</td></tr>
            <tr><td>...</td></tr>
        </table>
    </div>
</div>
</div>

