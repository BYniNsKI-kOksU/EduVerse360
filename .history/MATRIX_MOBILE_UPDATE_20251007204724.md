# Aktualizacja Kalkulatora Macierzy dla Mobile - Changelog

## Data: 7 października 2025

### 🎨 Główne Zmiany dla Urządzeń Mobilnych (≤768px)

#### 1. **Poprawiony Wygląd Macierzy**
- ✅ **Zwiększone rozmiary kontenerów macierzy**: 180px (poprzednio 140px)
- ✅ **Większe inputy**: 45px × 45px (poprzednio 35px × 35px)
- ✅ **Większy padding**: 15px 12px dla lepszej czytelności
- ✅ **Lepsze odstępy między polami**: 5px grid-gap
- ✅ **Większa czcionka w inputach**: 16px dla lepszej widoczności

#### 2. **Przeprojektowany Przycisk Size (Resize Icon)**
- ✅ **Nowa pozycja**: Prawy górny róg macierzy (top: 5px, right: 5px)
- ✅ **Lepszy wygląd**: Pomarańczowe tło z zaokrąglonymi rogami (8px border-radius)
- ✅ **Zwiększona widoczność**: rgba(224, 122, 95, 0.8) background
- ✅ **Hover efekt**: Scale 1.15 z box-shadow
- ✅ **Rozmiar**: 32px × 32px (dobrze widoczny, nie zakrywa zawartości)

#### 3. **Przyciski Oblicz i Wyczyść**
- ✅ **Umieszczone obok siebie**: Flex layout z gap 12px
- ✅ **Zmniejszone rozmiary**: padding 10px 20px, font-size 14px
- ✅ **Responsywne**: flex: 1, max-width: 140px
- ✅ **Mobile-friendly**: min-width 100px

#### 4. **Przełącznik Trybu (Podstawowy/Rozszerzony)**
- ✅ **Przeniesiony pod tytuł**: Lepszy dostęp, bardziej widoczny
- ✅ **Wyśrodkowany layout**: justify-content: center
- ✅ **Horizontal flex**: Przycisk pomocy i przełącznik w jednej linii
- ✅ **Lepsze odstępy**: gap 15px między elementami

#### 5. **🚀 Size Menu - Pełnoekranowy Modal (NOWOŚĆ)**
##### Desktop (>768px):
- Klasyczne pozycjonowanie obok ikony resize
- Małe, kompaktowe menu

##### Mobile (≤768px):
- ✅ **Pełnoekranowy modal**: Wyśrodkowany na środku ekranu
- ✅ **Backdrop z blur**: rgba(0, 0, 0, 0.7) + backdrop-filter: blur(5px)
- ✅ **Nagłówek z tytułem**: "Rozmiar Macierzy A/B"
- ✅ **Przycisk zamknięcia (X)**: Prawy górny róg z animacją obrotu
- ✅ **Duże inputy**: 80px szerokości, 18px font-size
- ✅ **Większe przyciski**: flex: 1 dla Akceptuj/Anuluj
- ✅ **Animacje**:
  - Scale transform (0 → 1) przy otwieraniu
  - Backdrop fade-in
  - Smooth closing animation

##### Funkcjonalność:
```javascript
- Kliknięcie na backdrop zamyka menu
- Kliknięcie na X zamyka menu
- Automatyczne usuwanie backdrop po zamknięciu
- Responsywne nagłówki (dynamicznie generowane)
```

#### 6. **Kontrolki (Controls Section)**
- ✅ **Uproszczona struktura**: flex-direction: column na mobile
- ✅ **Wyśrodkowane elementy**: justify-content: center
- ✅ **Zmniejszone marginesy**: margin-bottom 10px
- ✅ **Auto height**: min-height: auto

---

### 📱 Breakpointy

#### @media (max-width: 768px)
- Macierze: 180px max-width
- Inputy: 45px × 45px
- Przyciski: 100px min-width
- Size menu: Pełnoekranowy modal
- Przełącznik trybu: Pod tytułem

#### @media (max-width: 480px)
- Macierze: 150px max-width
- Inputy: 40px × 40px
- Przyciski: 90px min-width
- Size menu: 95vw szerokości

---

### 🎯 Pliki Zmodyfikowane

1. **`/css/matrix-calculator.css`**
   - Dodano style dla `.size-menu-backdrop`
   - Zaktualizowano media queries dla mobile
   - Przeprojektowano `.resize-icon`
   - Dodano style dla `.size-menu-header`, `.size-menu-title`, `.size-menu-close`
   - Poprawiono pozycjonowanie przełącznika trybu

2. **`/js/matrixCalculator.js`**
   - Zaktualizowano funkcję `toggleSizeMenu(matrixId)`
   - Dodano detekcję mobile: `const isMobile = window.innerWidth <= 768`
   - Implementacja backdrop dla mobile
   - Dynamiczne tworzenie nagłówka menu
   - Różne pozycjonowanie dla desktop vs mobile

3. **`/index.html`**
   - Przeniesiono `#matrixHelpAndMode` pod tytuł kalkulatora
   - Uproszczono strukturę `.controls`
   - Zachowano kompatybilność z istniejącym JS

---

### ✨ Nowe Funkcje

#### Size Menu Backdrop System
```css
.size-menu-backdrop {
    position: fixed;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
    z-index: 1099;
}
```

#### Modal Header dla Mobile
```javascript
const header = document.createElement('div');
header.className = 'size-menu-header';
header.innerHTML = `
    <div class="size-menu-title">Rozmiar Macierzy ${matrixId}</div>
    <button class="size-menu-close" onclick="toggleSizeMenu('${matrixId}')">×</button>
`;
```

---

### 🔧 Testowanie

#### Do przetestowania:
- [ ] Otwieranie size menu na iPhone/Android
- [ ] Backdrop działa poprawnie (zamyka menu)
- [ ] Przycisk X zamyka menu
- [ ] Inputy są dobrze widoczne i łatwe do kliknięcia
- [ ] Przyciski Oblicz/Wyczyść są obok siebie
- [ ] Przełącznik trybu jest dobrze widoczny pod tytułem
- [ ] Znaczek resize (+ button) nie jest przycięty
- [ ] Macierze wyświetlają się poprawnie

#### Zalecane urządzenia testowe:
- iPhone 12/13/14 (390px × 844px)
- iPhone SE (375px × 667px)
- Samsung Galaxy S21 (360px × 800px)
- iPad (768px × 1024px)

---

### 🐛 Znane Problemy

- Brak (wszystkie zgłoszone problemy naprawione)

---

### 📝 Notatki Deweloperskie

- Size menu na mobile używa `position: fixed` z `transform: translate(-50%, -50%)`
- Backdrop jest dodawany/usuwany dynamicznie przez JS
- Animacje używają CSS transforms dla lepszej wydajności
- Nagłówek menu jest generowany tylko raz (sprawdzanie `!menu.querySelector('.size-menu-header')`)

---

### 🎨 Design Decisions

1. **Przełącznik trybu pod tytułem** - Łatwiejszy dostęp na mobile, nie wymaga scrollowania
2. **Pełnoekranowy modal dla size menu** - Lepsze UX na małych ekranach, większe przyciski
3. **Backdrop z blur** - Nowoczesny wygląd, skupienie uwagi na menu
4. **Resize icon w prawym górnym rogu** - Bardziej intuicyjne, nie zakrywa zawartości
5. **Przyciski obok siebie** - Oszczędność przestrzeni pionowej

---

*Wszystkie zmiany są w pełni responsywne i nie wpływają na wersję desktopową.*
