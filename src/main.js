import { createApp } from 'vue'
import App from './App.vue'
import tilt from './directives/tilt'
import './assets/calculator.css'

createApp(App).directive('tilt', tilt).mount('#app')

