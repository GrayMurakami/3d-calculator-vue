<script setup>
defineProps({ label: String })
</script>

<template>
  <button class="btn" :class="classes" @click="$emit('click', label)">
    {{ label }}
  </button>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps(['label'])

const blue   = new Set(['+','−','×','÷','='])
const orange = new Set(['C','⌫','√','+/−','.'])

const classes = computed(() =>
  blue.has(props.label)   ? 'bg-blue'   :
  orange.has(props.label) ? 'bg-orange' : ''
)
</script>