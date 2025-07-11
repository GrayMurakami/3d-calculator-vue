<template>
  <div class="calc calc-move" v-tilt>
    <div class="calc-screen">
        <p class="field">{{ display }}</p>
        <button @click="copyResult" class="copy-btn" title="Скопировать">
            📋
        </button>
    </div>
    <div class="buttons">
      <button class="btn clear bg-orange" @click="onBtn('C')">C</button>
      <button class="btn del bg-orange" @click="onBtn('⌫')">⌫</button>
      <button class="btn sqrt bg-orange" @click="onBtn('√')">√</button>
      <button class="btn addition bg-blue" @click="onBtn('+')">+</button>

      <button class="btn seven" @click="onBtn('7')">7</button>
      <button class="btn eight" @click="onBtn('8')">8</button>
      <button class="btn nine" @click="onBtn('9')">9</button>
      <button class="btn subtraction bg-blue" @click="onBtn('-')">-</button>

      <button class="btn four" @click="onBtn('4')">4</button>
      <button class="btn five" @click="onBtn('5')">5</button>
      <button class="btn six" @click="onBtn('6')">6</button>
      <button class="btn multiply bg-blue" @click="onBtn('×')">×</button>

      <button class="btn one" @click="onBtn('1')">1</button>
      <button class="btn two" @click="onBtn('2')">2</button>
      <button class="btn three" @click="onBtn('3')">3</button>
      <button class="btn division bg-blue" @click="onBtn('÷')">÷</button>

      <button class="btn plus-minus bg-orange" @click="onBtn('+/-')">+/-</button>
      <button class="btn zero" @click="onBtn('0')">0</button>
      <button class="btn point bg-orange" @click="onBtn('.')">.</button>
      <button class="btn result bg-blue" @click="onBtn('=')">=</button>
    </div>
    <b><p class="author">&copy; 2025 GraY</p></b>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import vTilt from '../directives/tilt.js'

// Логика калькулятора:
const display = ref('0')

let a = ''
let b = ''
let operation = ''
let finish = false
const decimalePlaces = 4
const maxLength = 7

function copyResult() {
  navigator.clipboard.writeText(display.value)
    .then(() => {
      // Можно добавить уведомление об успехе
      // alert('Скопировано!');
    })
    .catch(err => {
      // Обработка ошибки (например, alert)
      alert('Ошибка копирования');
    });
}

function clearCalculator() {
  a = ''
  b = ''
  operation = ''
  finish = false
  display.value = '0'
}

function handleDelete() {
  if (finish) {
    a = a.slice(0, -1)
    display.value = a || '0'
    if (a === '') finish = false
  } else if (operation === '') {
    a = a.slice(0, -1)
    display.value = a || '0'
  } else {
    b = b.slice(0, -1)
    display.value = b || '0'
  }
}

function onBtn(val) {
  if (val === 'C') return clearCalculator()
  if (val === '⌫') return handleDelete()
  if (val === '√') return handleSquareRoot()
  if (val === '+/-') return handleToggleSign()
  if (val === '=') return handleEqual()
  if (['+', '-', '×', '÷'].includes(val)) return handleOperationInput(val)
  // цифры и точка
  return handleNumberInput(val)
}


function handleNumberInput(val) {
  // Если только что был равенство (=), начать новый ввод
  if (finish) {
    a = val === '.' ? '0.' : val // поддержка десятичной точки
    b = ''
    operation = ''
    finish = false
    display.value = a
    return
  }
  if (operation === '') {
    a = handleInput(a, val)
    display.value = a
  } else {
    b = handleInput(b, val)
    display.value = b
  }
}


function handleInput(currentValue, val) {
  if (currentValue.length >= maxLength && !(val === '.' && !currentValue.includes('.'))) {
    return currentValue
  }
  if (val === '.' && currentValue.includes('.')) return currentValue
  if (currentValue === '0' && val !== '.') return val
  return currentValue + val
}

function handleOperationInput(val) {
  if (a !== '' && b === '') {
    operation = val
    display.value = operation
  } else if (a !== '' && b !== '') {
    const result = calculateResult()
    if (result !== 'Error') {
      a = result
      b = ''
    }
    operation = val
    finish = false
  }
}

function handleEqual() {
  if (a !== '' && b !== '' && operation !== '') {
    const result = calculateResult()
    if (result !== 'Error') {
      a = result
    }
    b = ''
    operation = ''
    finish = true
  }
}

function calculateResult() {
  let res = calculate(a, b, operation)
  res = (res !== 'Error' && !isNaN(res))
    ? Number(parseFloat(res).toFixed(decimalePlaces))
    : 'Error'

  res = res.toString()
  if (res.length > maxLength) {
    let number = parseFloat(res)
    if (Math.abs(number) >= 1e8 || Math.abs(number) < 1e-4) {
      res = number.toExponential(decimalePlaces - 2)
    } else {
      let integerPartLength = Math.floor(number).toString().length
      if (integerPartLength >= maxLength) {
        res = number.toExponential(decimalePlaces - 2)
      } else {
        let allowedDecimalPlaces = maxLength - integerPartLength - 1
        res = number.toFixed(allowedDecimalPlaces)
      }
    }
  }
  if (res.indexOf('.') !== -1) {
    res = res.replace(/\.?0+$/, '')
  }
  display.value = res === 'Error' ? 'Error' : res
  return res
}

function handleSquareRoot() {
  if (finish) {
    a = calculateSquareRoot(a)
    display.value = a
    finish = false
    b = ''
    operation = ''
  } else if (operation === '') {
    a = calculateSquareRoot(a)
    display.value = a
  } else if (b !== '') {
    b = calculateSquareRoot(b)
    display.value = b
  }
}

function calculateSquareRoot(val) {
  const number = parseFloat(val)
  if (isNaN(number)) return 'Error'
  let result = number >= 0 ? Math.sqrt(number) : 'Error'
  if (typeof result === 'number') {
    result = result.toFixed(decimalePlaces)
    result = parseFloat(result).toString()
  }
  return result
}

function handleToggleSign() {
  if (b === '' && operation === '') {
    a = toggleSign(a)
    display.value = a
  } else if (a !== '' && b !== '') {
    b = toggleSign(b)
    display.value = b
  }
}

function toggleSign(value) {
  return (-parseFloat(value)).toString()
}

function addition(a, b) {
  return (+a) + (+b)
}
function subtraction(a, b) {
  return a - b
}
function multiply(a, b) {
  return a * b
}
function division(a, b) {
  return b === 0 ? 'Error' : a / b
}
function calculate(a, b, op) {
  a = parseFloat(a)
  b = parseFloat(b)
  let result = null
  switch (op) {
    case '+': result = addition(a, b); break
    case '-': result = subtraction(a, b); break
    case '×': result = multiply(a, b); break
    case '÷': result = b === 0 ? 'Error' : division(a, b); break
    default: break
  }
  return result
}
</script>