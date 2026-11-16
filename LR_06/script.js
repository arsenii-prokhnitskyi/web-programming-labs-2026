'use strict';
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const topLeft = document.querySelector('#top-left'); const topRight = document.querySelector('#top-right');
const bottomRight = document.querySelector('#bottom-right'); const bottomLeft = document.querySelector('#bottom-left');
const topLeftValue = document.querySelector('#top-left-value'); const topRightValue = document.querySelector('#top-right-value');
const bottomRightValue = document.querySelector('#bottom-right-value'); const bottomLeftValue = document.querySelector('#bottom-left-value');
const preview = document.querySelector('#preview'); const cssCode = document.querySelector('#css-code');
function hideTabs() { tabs.forEach(tab => tab.classList.remove('active')); tabContents.forEach(content => content.classList.remove('active')); }
function showTab(tabName) { document.querySelector(`[data-tab="${tabName}"]`).classList.add('active'); document.querySelector(`[data-content="${tabName}"]`).classList.add('active'); }
tabs.forEach(tab => tab.addEventListener('click', event => {
  console.log(event.type); console.log(event.target); console.log(event.currentTarget);
  const tabName = event.currentTarget.dataset.tab; hideTabs(); showTab(tabName);
}));
function generateBorderRadius() {
  const radius = `${topLeft.value}px ${topRight.value}px ${bottomRight.value}px ${bottomLeft.value}px`;
  preview.style.borderRadius = radius;
  topLeftValue.textContent = `${topLeft.value} px`; topRightValue.textContent = `${topRight.value} px`;
  bottomRightValue.textContent = `${bottomRight.value} px`; bottomLeftValue.textContent = `${bottomLeft.value} px`;
  cssCode.value = `border-radius: ${radius};`;
}
topLeft.addEventListener('input', generateBorderRadius); topRight.addEventListener('input', generateBorderRadius);
bottomRight.addEventListener('input', generateBorderRadius); bottomLeft.addEventListener('input', generateBorderRadius);
generateBorderRadius();
