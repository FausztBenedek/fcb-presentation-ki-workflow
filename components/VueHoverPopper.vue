<template>
  <!-- Teleport to body so container isn't clipped by overflow parents -->
  <teleport to="body">
    <transition name="fade">
      <div
        v-if="visible"
        ref="popper"
        :class="['vue-hover-popper', popperClass]
        "
        :style="popperStyle"
        @mouseenter="onPopperMouseEnter"
        @mouseleave="onPopperMouseLeave"
        role="tooltip"
      >
        <div class="vue-hover-popper__content">
          <slot />
        </div>
        <div v-if="arrow" ref="arrowEl" class="vue-hover-popper__arrow" :style="arrowStyle"></div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

// props
const props = defineProps({
  referenceEl: { type: Object, required: true },
  placement: { type: String, default: 'top' }, // top | bottom | left | right
  offset: { type: Number, default: 8 },
  arrow: { type: Boolean, default: true },
  strategy: { type: String, default: 'absolute' }, // absolute | fixed
  showDelay: { type: Number, default: 100 }, // ms
  hideDelay: { type: Number, default: 100 }, // ms
  popperClass: { type: String, default: '' },
})

// local refs & state
const popper = ref(null)
const arrowEl = ref(null)
const visible = ref(false)
const popperStyle = reactive({ position: props.strategy, left: '0px', top: '0px', transform: 'translate(0,0)' })
const arrowStyle = reactive({ left: '', top: '' })

let referenceEl = null
let showTimer = null
let hideTimer = null
let updateScheduled = false

function clearTimers() {
  if (showTimer) { clearTimeout(showTimer); showTimer = null }
  if (hideTimer) { clearTimeout(hideTimer); hideTimer = null }
}

function show() {
  clearTimers()
  showTimer = setTimeout(async () => {
    visible.value = true
    await nextTick()
    scheduleUpdate()
  }, props.showDelay)
}

function hide() {
  clearTimers()
  hideTimer = setTimeout(() => {
    visible.value = false
  }, props.hideDelay)
}

function onReferenceMouseEnter() {
  show()
}
function onReferenceMouseLeave() {
  // if cursor goes to popper, don't immediately hide; popper mouseenter will keep it
  hide()
}
function onPopperMouseEnter() {
  clearTimers()
}
function onPopperMouseLeave() {
  hide()
}

function scheduleUpdate() {
  if (updateScheduled) return
  updateScheduled = true
  requestAnimationFrame(() => {
    updateScheduled = false
    updatePosition()
  })
}

function updatePosition() {
  if (!referenceEl || !popper.value || !visible.value) return

  const refRect = referenceEl.getBoundingClientRect()
  const popRect = popper.value.getBoundingClientRect()
  const viewportWidth = document.documentElement.clientWidth
  const viewportHeight = document.documentElement.clientHeight

  const placementsToTry = [props.placement, 'top', 'bottom', 'right', 'left']

  let chosen = null
  let coords = { left: 0, top: 0 }

  for (const place of placementsToTry) {
    const c = computeCoordsForPlacement(place, refRect, popRect)
    if (fitsInViewport(c, popRect, viewportWidth, viewportHeight)) {
      chosen = place
      coords = c
      break
    }
  }

  if (!chosen) {
    // fallback to requested placement even if overflow
    chosen = props.placement
    coords = computeCoordsForPlacement(chosen, refRect, popRect)
  }

  // apply styles
  // Use CSS transform to avoid reflow where possible
  const left = coords.left + window.pageXOffset
  const top = coords.top + window.pageYOffset
  popperStyle.position = props.strategy
  popperStyle.left = left + 'px'
  popperStyle.top = top + 'px'
  popperStyle.transform = 'translate(0,0)'

  // arrow
  if (props.arrow && arrowEl.value) {
    const arrowSize = 8
    if (chosen === 'top' || chosen === 'bottom') {
      const center = refRect.left + refRect.width / 2 - left
      arrowStyle.left = Math.max(arrowSize, Math.min(popRect.width - arrowSize, center)) + 'px'
      arrowStyle.top = ''
    } else {
      const center = refRect.top + refRect.height / 2 - top
      arrowStyle.top = Math.max(arrowSize, Math.min(popRect.height - arrowSize, center)) + 'px'
      arrowStyle.left = ''
    }
  }
}

function computeCoordsForPlacement(place, refRect, popRect) {
  const offset = props.offset
  const coords = { left: 0, top: 0 }
  if (place === 'top') {
    coords.left = refRect.left + refRect.width / 2 - popRect.width / 2
    coords.top = refRect.top - popRect.height - offset
  } else if (place === 'bottom') {
    coords.left = refRect.left + refRect.width / 2 - popRect.width / 2
    coords.top = refRect.bottom + offset
  } else if (place === 'left') {
    coords.left = refRect.left - popRect.width - offset
    coords.top = refRect.top + refRect.height / 2 - popRect.height / 2
  } else if (place === 'right') {
    coords.left = refRect.right + offset
    coords.top = refRect.top + refRect.height / 2 - popRect.height / 2
  }
  // keep coords integral
  coords.left = Math.round(coords.left)
  coords.top = Math.round(coords.top)
  return coords
}

function fitsInViewport(coords, popRect, vw, vh) {
  const left = coords.left
  const top = coords.top
  return left >= 0 && top >= 0 && (left + popRect.width) <= vw && (top + popRect.height) <= vh
}

// update on scroll/resize
function onWindowChange() {
  scheduleUpdate()
}

onMounted(() => {
  referenceEl = props.referenceEl
  if (!referenceEl) {
    console.warn('[VueHoverPopper] selector did not match any element:', props.selector)
    return
  }

  // attach events
  referenceEl.addEventListener('mouseenter', onReferenceMouseEnter)
  referenceEl.addEventListener('mouseleave', onReferenceMouseLeave)

  window.addEventListener('scroll', onWindowChange, true)
  window.addEventListener('resize', onWindowChange)

  // if reference moves (e.g. DOM changes), observe it
  const ro = new MutationObserver(() => scheduleUpdate())
  ro.observe(document.body, { attributes: true, childList: true, subtree: true })

  // cleanup on unmount
  onBeforeUnmount(() => {
    clearTimers()
    if (referenceEl) {
      referenceEl.removeEventListener('mouseenter', onReferenceMouseEnter)
      referenceEl.removeEventListener('mouseleave', onReferenceMouseLeave)
    }
    window.removeEventListener('scroll', onWindowChange, true)
    window.removeEventListener('resize', onWindowChange)
    ro.disconnect()
  })
})

// keep position updated while visible (in case of animations or layout shifts)
watch(visible, (val) => {
  if (val) {
    scheduleUpdate()
  }
})
</script>

<style scoped>
.vue-hover-popper {
  z-index: 9999;
  background: white;
  border-radius: 6px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.12);
  padding: 8px;
  font-size: 14px;
  max-width: 320px;
}

.vue-hover-popper__arrow {
  width: 0;
  height: 0;
  position: absolute;
  border-style: solid;
}

/* Arrow positioning basics - the script sets top/left for the arrow */
.vue-hover-popper__arrow[style] {
  /* arrow visual is drawn with borders in runtime via ::before */
}

/* small fade transition */
.fade-enter-active, .fade-leave-active { transition: opacity 120ms ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* optional content wrapper */
.vue-hover-popper__content { position: relative }
</style>
