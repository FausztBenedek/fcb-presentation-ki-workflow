<template>
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
</template>

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
.slidev-vclick-hidden.answers, .slidev-vclick-target.answers {
    display: none;
}
.answers.slidev-vclick-current {
    display: flex;
    flex-flow: column;
}
</style>
