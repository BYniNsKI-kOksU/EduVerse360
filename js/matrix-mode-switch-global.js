// Ustaw globalnie tryb zaawansowany dla systemu pomocy
window.isAdvancedMode = false;
const matrixModeSwitch = document.getElementById('matrixModeSwitch');
if (matrixModeSwitch) {
  matrixModeSwitch.addEventListener('change', function() {
    window.isAdvancedMode = this.checked;
  });
}
// Synchronizacja na starcie
if (matrixModeSwitch) window.isAdvancedMode = matrixModeSwitch.checked;
