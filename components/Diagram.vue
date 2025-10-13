<script setup lang="ts">
import { ref, onMounted } from "vue";
import VueHoverPopper from './VueHoverPopper.vue'

let svgRendered = ref(false)
let referenceEl = ref()

onMounted(() => {
  const objectEl = document.getElementById("mySvg") as HTMLObjectElement;

  // Wait for the SVG to fully load
  objectEl.addEventListener("load", () => {
    svgRendered.value = true
    const svgDoc = objectEl.contentDocument; // Access the inner document of the SVG
    if (!svgDoc) return;
    let element = svgDoc.querySelector(".customer_data_extract")
    referenceEl.value = element
    element.addEventListener("click", (data) => {
      console.log(data.target.getBoundingClientRect().x)
      console.log(data)
    });
  });
});
</script>

<template>
  <object id="mySvg" type="image/svg+xml" data="./public/diagram.svg"></object>
</template>
