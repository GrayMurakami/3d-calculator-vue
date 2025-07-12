<template>
  <div class="calc">
    <div class="calc-screen">
      <p class="field">{{ displayValue }}</p>
      <button @click="copyToClipboard(displayValue)" class="copy-btn" title="Copy">📋</button>
    </div>
    <div class="buttons">
      <button class="btn bg-orange" @click="clearAll">C</button>
      <button class="btn bg-orange" @click="deleteLast">⌫</button>
      <button class="btn bg-orange" @click="handleSqrt">√</button>
      <button class="btn bg-blue" @click="setOperator('+')">+</button>

      <button class="btn" @click="inputDigit('7')">7</button>
      <button class="btn" @click="inputDigit('8')">8</button>
      <button class="btn" @click="inputDigit('9')">9</button>
      <button class="btn bg-blue" @click="setOperator('-')">-</button>

      <button class="btn" @click="inputDigit('4')">4</button>
      <button class="btn" @click="inputDigit('5')">5</button>
      <button class="btn" @click="inputDigit('6')">6</button>
      <button class="btn bg-blue" @click="setOperator('×')">×</button>

      <button class="btn" @click="inputDigit('1')">1</button>
      <button class="btn" @click="inputDigit('2')">2</button>
      <button class="btn" @click="inputDigit('3')">3</button>
      <button class="btn bg-blue" @click="setOperator('÷')">÷</button>

      <button class="btn bg-orange" @click="toggleSign">+/-</button>
      <button class="btn" @click="inputDigit('0')">0</button>
      <button class="btn bg-orange" @click="inputDigit('.')">.</button>
      <button class="btn bg-blue" @click="calculateResult">=</button>
    </div>
    <b><p class="author">&copy; 2025 GraY</p></b>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useClipboard } from '@vueuse/core'

const maxLength = 9

const firstValue = ref('0')      // первое число (строка для простоты)
const secondValue = ref('')      // второе число (строка)
const operator = ref('')         // текущий оператор
const isSecondValueInput = ref(false) // флаг, что вводим второе число

const { copy: copyToClipboard } = useClipboard() // функция для копирования

// computed значение, всегда отображаемое на экране
const displayValue = computed(() => {
  if (isSecondValueInput.value) return secondValue.value || '0'
  return firstValue.value || '0'
})

// Ввод цифр и точки
function inputDigit(digit) {
  let target = isSecondValueInput.value ? secondValue : firstValue
  // Ограничение длины
  if (target.value.length >= maxLength && digit !== '.') return
  // Одна точка
  if (digit === '.' && target.value.includes('.')) return
  // Нельзя начинать с нескольких нулей
  if (target.value === '0' && digit !== '.') target.value = digit
  else target.value += digit
}

// Операции + - × ÷
function setOperator(op) {
  // Если оператор уже выбран и второе число есть — считаем, результат переносим в первое число
  if (operator.value && secondValue.value) {
    calculateResult()
  }
  operator.value = op
  isSecondValueInput.value = true
}

// Кнопка =
function calculateResult() {
  let a = parseFloat(firstValue.value)
  let b = parseFloat(secondValue.value || firstValue.value) // если второй нет — считаем само с собой
  let result = 0
  switch (operator.value) {
    case '+': result = a + b; break
    case '-': result = a - b; break
    case '×': result = a * b; break
    case '÷': result = b === 0 ? 'Error' : a / b; break
    default: return
  }
  // Красиво округляем, ошибки и длинные числа — в экспоненту
  let resultStr = (result === 'Error') ? 'Error' : +parseFloat(result).toFixed(8)
  resultStr = String(resultStr)
  if (resultStr.length > maxLength) resultStr = (+resultStr).toExponential(4)
  firstValue.value = resultStr
  secondValue.value = ''
  operator.value = ''
  isSecondValueInput.value = false
}

// C
function clearAll() {
  firstValue.value = '0'
  secondValue.value = ''
  operator.value = ''
  isSecondValueInput.value = false
}

// ⌫
function deleteLast() {
  let target = isSecondValueInput.value ? secondValue : firstValue
  target.value = target.value.slice(0, -1) || '0'
}

// √
function handleSqrt() {
  let target = isSecondValueInput.value ? secondValue : firstValue
  let num = parseFloat(target.value)
  if (isNaN(num) || num < 0) {
    target.value = 'Error'
    return
  }
  let sqrtVal = Math.sqrt(num).toFixed(8)
  sqrtVal = +sqrtVal
  target.value = String(sqrtVal).length > maxLength ? sqrtVal.toExponential(4) : String(sqrtVal)
}

// +/-
function toggleSign() {
  let target = isSecondValueInput.value ? secondValue : firstValue
  if (target.value === '0' || target.value === '') return
  if (target.value.startsWith('-')) target.value = target.value.slice(1)
  else target.value = '-' + target.value
}
</script>