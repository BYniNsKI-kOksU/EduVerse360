const translations = {
    "pl": {
        "title": "EduVerse 360",
        "choose_app": "Wybierz aplikacje",
        "home": "Strona główna",
        "applications": "Aplikacje",
        "help": "Pomoc",
        "about": "O aplikacji",
        "instructions": "Instrukcja",
        "welcome": {
            "title": "Witaj w EduVerse 360",
            "subtitle": "Odkryj narzędzia do obliczeń matematycznych",
            "start_hint": "Kliknij dowolny klawisz lub kliknij myszką, aby kontynuować"
        },
        "leapYear": {
            "title": "Badacz roku przestępnego",
            "prompt": "Podaj rok:",
            "button": "Oblicz",
            "history": "Historia:",
            "emptyHistory": "Brak historii",
            "error": "Wprowadź poprawny rok (liczbę całkowitą).",
            "yes": "To {verb} rok przestępny",
            "no": "To nie {verb} rok przestępny",
            "verbs": {"past": "był", "present": "jest", "future": "będzie"}
        },
        "auth": {
            "login": "Zaloguj się",
            "register": "Zarejestruj się",
            "logout": "Wyloguj się",
            "email": "Email",
            "password": "Hasło",
            "confirmPassword": "Potwierdź hasło",
            "firstName": "Imię",
            "lastName": "Nazwisko",
            "loginSuccess": "Logowanie udane!",
            "registerSuccess": "Rejestracja udana! Witamy w EduVerse 360!",
            "invalidCredentials": "Nieprawidłowy email lub hasło!",
            "passwordMismatch": "Hasła nie są identyczne!",
            "userExists": "Użytkownik z tym emailem już istnieje!",
            "welcome": "Witamy w EduVerse 360!",
            "logoutConfirmation": "Czy na pewno chcesz się wylogować?",
            "logoutSuccess": "Wylogowano pomyślnie!",
            "cancel": "Anuluj",
            "confirm": "Potwierdź"
        },
        "matrixCalc": {
            "resizeBtn": "Zmień rozmiar",
            "acceptBtn": "Akceptuj",
            "title": "Kalkulator Macierzy",
            "rows": "Wiersze:",
            "cols": "Kolumny:",
            "operation": "Operacja:",
            "compute": "Oblicz",
            "clear": "Wyczyść",
            "matrix_a": "Macierz A",
            "matrix_b": "Macierz B",
            "solve": "Układ równań",
            "default_result": "Wynik pojawi się tutaj",
            "method_label": "Metoda:",
            "operations": {
                "add": "Dodawanie",
                "sub": "Odejmowanie",
                "mul": "Mnożenie",
                "det": "Wyznacznik",
                "inv": "Macierz odwrotna",
                "trans": "Transpozycja",
                "solve": "Układ równań"
            },
            "methods": {
                "cramer": "Cramer",
                "gauss": "Eliminacja Gaussa",
                "gauss_jordan": "Gauss-Jordan",
                "inverse": "Macierz odwrotna"
            },
            "errors": {
                "same_dim": "Macierze muszą mieć te same wymiary do {op}.",
                "mul_dim": "Liczba kolumn A musi być równa liczbie wierszy B.",
                "square": "Macierz musi być kwadratowa, aby wykonać tę operację.",
                "singular": "Macierz osobliwa – brak odwrotności.",
                "invalid": "Niepoprawna liczba w (wiersz {r}, kolumna {c}).",
                "solve_dim": "Macierz B musi być wektorem (1 kolumna) dla układu równań.",
                "size_invalid": "Nieprawidłowy rozmiar macierzy. Wprowadź wartości od 1 do 10.",
                "resize_failed": "Nie udało się zmienić rozmiaru macierzy."
            },
            "resize_dialog": {
                "title": "Zmień rozmiar macierzy",
                "matrix_a": "Macierz A",
                "matrix_b": "Macierz B",
                "rows": "Wiersze:",
                "cols": "Kolumny:",
                "accept": "Akceptuj",
                "cancel": "Anuluj"
            },
            "buttons": {
                "resize": "Zmień rozmiar",
                "compute": "Oblicz",
                "clear": "Wyczyść"
            }
        },
        "userProfile": {
            "title": "Profil użytkownika",
            "edit": "Edytuj profil",
            "favorites": "Ulubione obliczenia",
            "settings": "Ustawienia",
            "password": "Zmień hasło",
            "activity": "Ostatnia aktywność",
            "calculations": "Obliczenia",
            "saved": "Zapisane",
            "favoritesCount": "Ulubione",
            "sections": {
                "statistics": "Statystyki",
                "quickActions": "Szybkie akcje",
                "recentActivity": "Ostatnia aktywność",
                "achievements": "Osiągnięcia"
            },
            "stats": {
                "completedCourses": "Ukończone kursy",
                "studyTime": "Czas nauki",
                "achievements": "Osiągnięcia",
                "averageGrades": "Średnia ocen"
            },
            "actions": {
                "title": "Szybkie akcje",
                "editProfile": "Edytuj profil",
                "detailedStats": "Szczegółowe Statystyki",
                "detailedStatsDesc": "Zobacz pełny raport swojego postępu",
                "activityDesc": "Przeglądaj swoją historię nauki",
                "achievementsDesc": "Zobacz pełną listę swoich sukcesów",
                "settingsDesc": "Personalizuj swoje dane i preferencje"
            },
            "modals": {
                "stats": {
                    "title": "Szczegółowe Statystyki"
                },
                "activity": {
                    "title": "Ostatnia Aktywność"
                },
                "achievements": {
                    "title": "Wszystkie Osiągnięcia"
                },
                "editProfile": {
                    "title": "Edytuj Profil",
                    "personalInfo": "Informacje osobiste",
                    "name": "Imię i nazwisko",
                    "email": "Adres email",
                    "preferences": "Preferencje",
                    "darkMode": "Tryb ciemny",
                    "language": "Język",
                    "role": "Rola",
                    "roles": {
                        "student": "Student",
                        "teacher": "Nauczyciel",
                        "researcher": "Badacz",
                        "developer": "Programista"
                    },
                    "avatar": "Zdjęcie profilowe",
                    "uploadAvatar": "Prześlij nowe zdjęcie",
                    "removeAvatar": "Usuń zdjęcie",
                    "save": "Zapisz zmiany",
                    "cancel": "Anuluj"
                }
            },
            "form": {
                "userName": "Nazwa użytkownika",
                "email": "Email",
                "role": "Rola",
                "emailNotifications": "Powiadomienia email",
                "darkMode": "Tryb ciemny",
                "saveChanges": "Zapisz zmiany",
                "cancel": "Anuluj"
            },
            "roles": {
                "student": "Student",
                "teacher": "Nauczyciel",
                "administrator": "Administrator"
            },
            "notifications": {
                "profileUpdated": "Profil został zaktualizowany pomyślnie!",
                "noChanges": "Nie wykryto żadnych zmian.",
                "passwordChanged": "Hasło zostało zmienione pomyślnie!",
                "avatarUpdated": "Zdjęcie profilowe zostało zaktualizowane!",
                "avatarRemoved": "Zdjęcie profilowe zostało usunięte!",
                "error": "Wystąpił błąd. Spróbuj ponownie.",
                "invalidFile": "Wybierz poprawny plik obrazu.",
                "fileTooLarge": "Rozmiar pliku musi być mniejszy niż 5MB.",
                "nameRequired": "Nazwa użytkownika jest wymagana!",
                "emailInvalid": "Wprowadź poprawny adres email!"
            }
        },
        "dashboard": {
            "menu": "Menu",
            "navigation": "Nawigacja", 
            "settings": "Ustawienia",
            "applications": "Aplikacje",
            "home": "Strona główna",
            "profile": "Profil",
            "help": "Pomoc",
            "darkMode": "Tryb ciemny",
            "lightMode": "Tryb jasny",
            "language": "Język",
            "back": "Wstecz"
        }
    },
    "en": {
        "title": "EduVerse 360",
        "choose_app": "Choose application",
        "home": "Home",
        "applications": "Applications",
        "help": "Help",
        "about": "About",
        "instructions": "Instructions",
        "welcome": {
            "title": "Welcome to EduVerse 360",
            "subtitle": "Discover tools for mathematical calculations",
            "start_hint": "Click any key or mouse to continue"
        },
        "auth": {
            "login": "Log in",
            "register": "Register",
            "logout": "Log out",
            "email": "Email",
            "password": "Password",
            "confirmPassword": "Confirm Password",
            "firstName": "First Name",
            "lastName": "Last Name",
            "loginSuccess": "Login successful!",
            "registerSuccess": "Registration successful! Welcome to EduVerse 360!",
            "invalidCredentials": "Invalid email or password!",
            "passwordMismatch": "Passwords do not match!",
            "userExists": "User with this email already exists!",
            "welcome": "Welcome to EduVerse 360!"
        },
        "leapYear": {
            "title": "Leap Year Investigator",
            "prompt": "Enter year:",
            "button": "Check",
            "history": "History:",
            "emptyHistory": "No history",
            "error": "Enter a valid integer year.",
            "yes": "It {verb} a leap year",
            "no": "It is not {verb} a leap year",
            "verbs": {"past": "was", "present": "is", "future": "will be"}
        },
        "matrixCalc": {
            "resizeBtn": "Resize",
            "acceptBtn": "Accept",
            "title": "Matrix Calculator",
            "rows": "Rows:",
            "cols": "Columns:",
            "operation": "Operation:",
            "compute": "Compute",
            "clear": "Clear",
            "matrix_a": "Matrix A",
            "matrix_b": "Matrix B",
            "result_label": "Result",
            "solve": "Solve",
            "default_result": "Result will appear here",
            "method_label": "Method:",
            "operations": {
                "add": "Addition",
                "sub": "Subtraction",
                "mul": "Multiplication",
                "det": "Determinant",
                "inv": "Inverse",
                "trans": "Transpose",
                "solve": "Solve"
            },
            "methods": {
                "cramer": "Cramer",
                "gauss": "Gaussian elimination",
                "gauss_jordan": "Gauss-Jordan",
                "inverse": "Inverse matrix"
            },
            "errors": {
                "same_dim": "Matrices must have the same dimensions for {op}.",
                "mul_dim": "Columns of A must equal rows of B.",
                "square": "Matrix must be square for this operation.",
                "singular": "Matrix is singular – cannot invert.",
                "invalid": "Invalid number at (row {r}, col {c}).",
                "solve_dim": "Matrix B must be a vector (1 column) for equation system.",
                "size_invalid": "Invalid matrix size. Please enter values between 1 and 10.",
                "resize_failed": "Failed to resize matrix."
            },
            "resize_dialog": {
                "title": "Resize Matrix",
                "matrix_a": "Matrix A",
                "matrix_b": "Matrix B",
                "rows": "Rows:",
                "cols": "Columns:",
                "accept": "Accept",
                "cancel": "Cancel"
            },
            "buttons": {
                "resize": "Resize",
                "compute": "Compute",
                "clear": "Clear"
            }
        },
        "userProfile": {
            "title": "User Profile",
            "edit": "Edit Profile",
            "favorites": "Favorite Calculations",
            "settings": "Settings",
            "password": "Change Password",
            "activity": "Recent Activity",
            "calculations": "Calculations",
            "saved": "Saved",
            "favoritesCount": "Favorites",
            "statistics": {
                "title": "Your Statistics",
                "totalCalculations": "Total Calculations",
                "favoriteCalculations": "Favorite Calculations",
                "completedTasks": "Completed Tasks",
                "accuracy": "Accuracy Rate"
            },
            "actions": {
                "title": "Quick Actions",
                "editProfile": "Edit Profile",
                "viewFavorites": "View Favorites", 
                "openSettings": "Open Settings",
                "changePassword": "Change Password",
                "detailedStats": "Detailed Statistics",
                "detailedStatsDesc": "View your complete progress report",
                "activityDesc": "Browse your learning history",
                "achievementsDesc": "View your complete list of achievements",
                "settingsDesc": "Customize your data and preferences"
            },
            "achievements": {
                "title": "Achievements",
                "mathExplorer": "Math Explorer",
                "accuracyMaster": "Accuracy Master",
                "speedCalculator": "Speed Calculator"
            },
            "modals": {
                "stats": {
                    "title": "Detailed Statistics"
                },
                "activity": {
                    "title": "Recent Activity"
                },
                "achievements": {
                    "title": "All Achievements"
                },
                "editProfile": {
                    "title": "Edit Profile",
                    "personalInfo": "Personal Information",
                    "name": "Full Name",
                    "email": "Email Address",
                    "preferences": "Preferences",
                    "darkMode": "Dark Mode",
                    "language": "Language",
                    "role": "Role",
                    "roles": {
                        "student": "Student",
                        "teacher": "Teacher",
                        "researcher": "Researcher",
                        "developer": "Developer"
                    },
                    "avatar": "Profile Picture",
                    "uploadAvatar": "Upload New Avatar",
                    "removeAvatar": "Remove Avatar",
                    "save": "Save Changes",
                    "cancel": "Cancel"
                },
                "viewFavorites": {
                    "title": "Favorite Calculations",
                    "noFavorites": "No favorite calculations yet",
                    "clearAll": "Clear All",
                    "close": "Close"
                },
                "changePassword": {
                    "title": "Change Password",
                    "currentPassword": "Current Password",
                    "newPassword": "New Password",
                    "confirmPassword": "Confirm New Password",
                    "save": "Change Password",
                    "cancel": "Cancel"
                }
            },
            "notifications": {
                "profileUpdated": "Profile updated successfully!",
                "noChanges": "No changes detected.",
                "passwordChanged": "Password changed successfully!",
                "avatarUpdated": "Avatar updated successfully!",
                "avatarRemoved": "Avatar removed successfully!",
                "error": "An error occurred. Please try again.",
                "invalidFile": "Please select a valid image file.",
                "fileTooLarge": "File size must be less than 5MB."
            }
        },
        "dashboard": {
            "menu": "Menu",
            "navigation": "Navigation",
            "settings": "Settings", 
            "applications": "Applications",
            "home": "Home",
            "profile": "Profile",
            "help": "Help",
            "darkMode": "Dark mode",
            "lightMode": "Light mode",
            "language": "Language",
            "back": "Back"
        }
    },
    "de": {
        "title": "EduVerse 360",
        "choose_app": "Anwendung wählen",
        "home": "Startseite",
        "applications": "Anwendungen",
        "help": "Hilfe",
        "about": "Über",
        "instructions": "Anleitung",
        "welcome": {
            "title": "Willkommen bei EduVerse 360",
            "subtitle": "Entdecken Sie Werkzeuge für mathematische Berechnungen",
            "start_hint": "Klicken Sie auf eine beliebige Taste oder Maus, um fortzufahren"
        },
        "auth": {
            "login": "Anmelden",
            "register": "Registrieren",
            "logout": "Abmelden",
            "email": "E-Mail",
            "password": "Passwort",
            "confirmPassword": "Passwort bestätigen",
            "firstName": "Vorname",
            "lastName": "Nachname",
            "loginSuccess": "Anmeldung erfolgreich!",
            "registerSuccess": "Registrierung erfolgreich! Willkommen bei EduVerse 360!",
            "invalidCredentials": "Ungültige E-Mail oder Passwort!",
            "passwordMismatch": "Passwörter stimmen nicht überein!",
            "userExists": "Benutzer mit dieser E-Mail existiert bereits!",
            "welcome": "Willkommen bei EduVerse 360!"
        },
        "leapYear": {
            "title": "Schaltjahr-Untersucher",
            "prompt": "Jahr eingeben:",
            "button": "Prüfen",
            "history": "Verlauf:",
            "emptyHistory": "Kein Verlauf",
            "error": "Geben Sie eine gültige Jahreszahl (ganze Zahl) ein.",
            "yes": "Es {verb} ein Schaltjahr",
            "no": "Es ist nicht {verb} ein Schaltjahr",
            "verbs": {"past": "war", "present": "ist", "future": "wird sein"}
        },
        "matrixCalc": {
            "resizeBtn": "Größe ändern",
            "acceptBtn": "Akzeptieren",
            "title": "Matrix-Rechner",
            "rows": "Zeilen:",
            "cols": "Spalten:",
            "operation": "Operation:",
            "compute": "Berechnen",
            "clear": "Löschen",
            "matrix_a": "Matrix A",
            "matrix_b": "Matrix B",
            "result_label": "Ergebnis",
            "solve": "Lösen",
            "default_result": "Ergebnis wird hier erscheinen",
            "method_label": "methode:",
            "operations": {
                "add": "Addition",
                "sub": "Subtraktion",
                "mul": "Multiplikation",
                "det": "Determinante",
                "inv": "Inverse Matrix",
                "trans": "Transponierung",
                "solve": "Gleichungssystem"
            },
            "methods": {
                "cramer": "Cramer",
                "gauss": "Gaußsches Eliminationsverfahren",
                "gauss_jordan": "Gauß-Jordan",
                "inverse": "Inverse Matrix"
            },
            "errors": {
                "same_dim": "Matrizen müssen für {op} die gleichen Dimensionen haben.",
                "mul_dim": "Die Spalten von A müssen den Zeilen von B entsprechen.",
                "square": "Die Matrix muss für diese Operation quadratisch sein.",
                "singular": "Matrix ist singulär – kann nicht invertiert werden.",
                "invalid": "Ungültige Zahl in (Zeile {r}, Spalte {c}).",
                "solve_dim": "Matrix B muss für das Gleichungssystem ein Vektor (1 Spalte) sein.",
                "size_invalid": "Ungültige Matrixgröße. Bitte geben Sie Werte zwischen 1 und 10 ein.",
                "resize_failed": "Größenänderung der Matrix fehlgeschlagen."
            },
            "resize_dialog": {
                "title": "Matrixgröße ändern",
                "matrix_a": "Matrix A",
                "matrix_b": "Matrix B",
                "rows": "Zeilen:",
                "cols": "Spalten:",
                "accept": "Akzeptieren",
                "cancel": "Abbrechen"
            },
            "buttons": {
                "resize": "Größe ändern",
                "compute": "Berechnen",
                "clear": "Löschen"
            }
        },
        "userProfile": {
            "title": "Benutzerprofil",
            "edit": "Profil bearbeiten",
            "favorites": "Bevorzugte Berechnungen",
            "settings": "Einstellungen",
            "password": "Passwort ändern",
            "activity": "Letzte aktywność",
            "calculations": "Berechnungen",
            "saved": "Gespeichert",
            "favoritesCount": "Favoriten"
        },
        "dashboard": {
            "menu": "Menü",
            "navigation": "Navigation",
            "settings": "Einstellungen",
            "applications": "Anwendungen", 
            "home": "Startseite",
            "profile": "Profil",
            "darkMode": "Dunkler Modus",
            "lightMode": "Heller Modus",
            "language": "Sprache",
            "back": "Zurück"
        }
    }
};