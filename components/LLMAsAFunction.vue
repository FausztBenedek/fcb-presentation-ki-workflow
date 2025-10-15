<template>
  <div class="function-container">
    <div class="function-declaration">
      <span class="function-f">f(</span>
      <span>
        <span> Give me some ideas for what to do when visiting Santiago. </span>
        <br />
        <template v-for="(porbability, index) in porbabilities">
          <template v-if="index + 1 < $clicks">
            {{ select(porbability).v }}
          </template>
        </template>
        <span v-click="27"></span>
      </span>
      <span class="function-f"> )</span>
    </div>
    <span class="function-f">=</span>
    <div class="function-result">
      <div v-for="(porbability, index) in porbabilities" class="answers">
        <table v-if="index + 1 == $clicks">
          <tr v-for="item in porbability" :class="{ selected: item.selected }">
            <td>{{ item.p }}</td>
            <td>{{ item.v }}</td>
          </tr>
          <tr>
            <td>...</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
} from "vue";

function select(fromList) {
  for (let e of fromList) {
    if (e.selected) {
      return e;
    }
  }
  return fromList[0];
}

let porbabilities = ref([
  [
    { p: "39%", v: "Sure", selected: true },
    { p: "36%", v: "There" },
    { p: "9%", v: "Of" },
    { p: "4%", v: "Santiago" },
    { p: "3%", v: "Absolutely" },
    { p: "1%", v: "Certainly" },
  ],
  [
    { p: "53%", v: ",", selected: true },
    { p: "38%", v: "!" },
    { p: "7%", v: " thing" },
    { p: "0%", v: "." },
    { p: "0%", v: "-" },
    { p: "0%", v: "!" },
  ],
  [
    { p: "52%", v: " there", selected: true },
    { p: "33%", v: " here" },
    { p: "7%", v: " Santiago" },
    { p: "1%", v: " visiting" },
    { p: "0%", v: " one" },
    { p: "0%", v: " let" },
  ],
  [
    { p: "98%", v: " are", selected: true },
    { p: "1%", v: "'s" },
    { p: "0%", v: " is" },
    { p: "0%", v: "`s" },
    { p: "0%", v: " a" },
    { p: "0%", v: " plenty" },
  ],
  [
    { p: "70%", v: " plenty", selected: true },
    { p: "24%", v: " many" },
    { p: "1%", v: " a" },
    { p: "1%", v: " so" },
    { p: "0%", v: " lots" },
    { p: "0%", v: " seperal" },
  ],
  [
    { p: "99%", v: " of", selected: true },
    { p: "0%", v: " things" },
    { p: "0%", v: "" },
    { p: "0%", v: " to" },
    { p: "0%", v: " o" },
    { p: "0%", v: " options" },
  ],
  [
    { p: "81%", v: " things", selected: true },
    { p: "7%", v: " great" },
    { p: "4%", v: " fun" },
    { p: "2%", v: " exciting" },
    { p: "1%", v: " activities" },
    { p: "0%", v: " amazing" },
  ],
  [
    { p: "87%", v: " to", selected: true },
    { p: "12%", v: " you" },
    { p: "0%", v: " for" },
    { p: "0%", v: " that" },
    { p: "0%", v: " one" },
    { p: "0%", v: " do" },
  ],
  [
    { p: "98%", v: " do", selected: true },
    { p: "1%", v: " see" },
    { p: "0%", v: " explore" },
    { p: "0%", v: " keep" },
    { p: "0%", v: " experience" },
    { p: "0%", v: " enjoy" },
  ],
  [
    { p: "71%", v: " in", selected: true },
    { p: "24%", v: " when" },
    { p: "2%", v: " and" },
    { p: "1%", v: " while" },
    { p: "0%", v: " during" },
    { p: "0%", v: "!" },
  ],
  [
    { p: "99%", v: " Santiago!", selected: true },
    { p: "0%", v: " the" },
    { p: "0%", v: " beautiful" },
    { p: "0%", v: " this" },
    { p: "0%", v: " and" },
    { p: "0%", v: " Chile" },
  ],
  [
    { p: "56%", v: " Here" },
    { p: "23%", v: " You" },
    { p: "6%", v: " Some" },
    { p: "5%", v: " One", selected: true },
    { p: "2%", v: " How" },
    { p: "1%", v: " Have" },
  ],
  [
    { p: "45%", v: " popular" },
    { p: "30%", v: " idea" },
    { p: "19%", v: " option", selected: true },
    { p: "1%", v: " of" },
    { p: "0%", v: " suggestion" },
    { p: "0%", v: " great" },
  ],
  [
    { p: "55%", v: " is" },
    { p: "31%", v: " could", selected: true },
    { p: "12%", v: " would" },
    { p: "0%", v: " might" },
    { p: "0%", v: " you" },
    { p: "0%", v: " may" },
  ],
  [
    { p: "99%", v: " be", selected: true },
    { p: "0%", v: " to" },
    { p: "0%", v: " b" },
    { p: "0%", v: "" },
    { p: "0%", v: " include" },
    { p: "0%", v: " may" },
  ],
  [
    { p: "94%", v: " to", selected: true },
    { p: "3%", v: " visiting" },
    { p: "1%", v: " exploring" },
    { p: "0%", v: " taking" },
    { p: "0%", v: " checking" },
    { p: "0%", v: " touring" },
  ],
  [
    { p: "59%", v: " visit" },
    { p: "25%", v: " take", selected: true },
    { p: "14%", v: " explore" },
    { p: "0%", v: " go" },
    { p: "0%", v: " check" },
    { p: "0%", v: " tour" },
  ],
  [
    { p: "99%", v: " a", selected: true },
    { p: "0%", v: " in" },
    { p: "0%", v: " the" },
    { p: "0%", v: " advantage" },
    { p: "0%", v: " walking" },
    { p: "0%", v: " an" },
  ],
  [
    { p: "71%", v: " walking", selected: true },
    { p: "15%", v: " tour" },
    { p: "3%", v: " guided" },
    { p: "3%", v: " city" },
    { p: "2%", v: " stroll" },
    { p: "1%", v: " walk" },
  ],
  [
    { p: "99%", v: " tour", selected: true },
    { p: "0%", v: " or" },
    { p: "0%", v: " food" },
    { p: "0%", v: " city" },
    { p: "0%", v: " and" },
    { p: "0%", v: "," },
  ],
  [
    { p: "99%", v: " of", selected: true },
    { p: "0%", v: " through" },
    { p: "0%", v: " around" },
    { p: "0%", v: " and" },
    { p: "0%", v: " to" },
    { p: "0%", v: " or" },
  ],
  [
    { p: "99%", v: " the", selected: true },
    { p: "0%", v: " some" },
    { p: "0%", v: " historic" },
    { p: "0%", v: " its" },
    { p: "0%", v: " downtown" },
    { p: "0%", v: " Santiago" },
  ],
  [
    { p: "95%", v: " city", selected: true },
    { p: "4%", v: " historic" },
    { p: "0%", v: " historical" },
    { p: "0%", v: " downtown" },
    { p: "0%", v: " old" },
    { p: "0%", v: " beautiful" },
  ],
  [
    { p: "37%", v: "," },
    { p: "30%", v: "'s", selected: true },
    { p: "20%", v: " to" },
    { p: "10%", v: " and" },
    { p: "0%", v: "." },
    { p: "0%", v: " center" },
  ],
  [
    { p: "87%", v: " historic", selected: true },
    { p: "7%", v: " historical" },
    { p: "1%", v: " famous" },
    { p: "0%", v: " main" },
    { p: "0%", v: " beautiful" },
    { p: "0%", v: " many" },
  ],
  [
    { p: "43%", v: " center", selected: true },
    { p: "34%", v: " neighbourhoods" },
    { p: "5%", v: " sites" },
    { p: "4%", v: " district" },
    { p: "4%", v: " downtown" },
    { p: "2%", v: " landmarks" },
  ],
]);
console.log("Length of clicks " + porbabilities.value.length);
</script>

<style>
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
.slidev-vclick-hidden.answers,
.slidev-vclick-target.answers {
  display: none;
}
.answers.slidev-vclick-current {
  display: flex;
  flex-flow: column;
}
.answers .selected {
  background: #5d839222;
}
</style>
