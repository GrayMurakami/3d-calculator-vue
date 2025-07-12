import { createApp } from 'vue'
import App from './App.vue'
import tilt from './directives/tilt'

createApp(App).directive('tilt', tilt).mount('#app')

