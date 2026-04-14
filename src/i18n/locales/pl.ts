const pl = {
	translation: {
		brand: {
			name: "QRVault",
			tagline: "Twórz spersonalizowane kody QR — prywatnie, w swojej przeglądarce."
		},
		hero: {
			title: "Darmowy Generator Spersonalizowanych Kodów QR",
			subtitle:
				"Generuj kody QR dla URL, tekstu, e-maila i WiFi — bezpośrednio w przeglądarce. Bez przesyłania, bez serwerów, bez śledzenia.",
			badge: "100% Prywatny i Lokalny",
			pills: {
				customColors: "Własne Kolory",
				logoEmbedding: "Osadzanie Logo",
				dotStyles: "Style Kropek",
				multipleFormats: "PNG / SVG / JPG",
				private: "100% Prywatny",
				realtime: "Podgląd w Czasie Rzeczywistym"
			}
		},
		input: {
			placeholder: "Wpisz URL, tekst, e-mail lub dane WiFi…",
			label: "Treść",
			empty: "Wpisz treść, aby wygenerować kod QR.",
			generate: "Generuj Kod QR"
		},
		contentType: {
			label: "Typ treści",
			url: "URL",
			text: "Tekst",
			email: "E-mail",
			wifi: "WiFi"
		},
		wifi: {
			ssid: "Nazwa sieci (SSID)",
			password: "Hasło",
			security: "Zabezpieczenie",
			securityWpa: "WPA/WPA2",
			securityWep: "WEP",
			securityNone: "Brak (otwarta)",
			hidden: "Ukryta sieć"
		},
		email: {
			address: "Adres e-mail",
			subject: "Temat (opcjonalnie)",
			body: "Treść (opcjonalnie)"
		},
		customization: {
			title: "Personalizacja",
			dotStyle: "Styl kropek",
			dotColor: "Kolor kropek",
			backgroundColor: "Kolor tła",
			cornerStyle: "Styl narożników",
			errorCorrection: "Korekcja błędów",
			size: "Rozmiar (px)",
			logo: "Obraz logo",
			logoUpload: "Prześlij logo",
			logoRemove: "Usuń logo",
			logoHint: "Zalecany PNG lub SVG. Utrzymaj małe dla dobrej skanowalności."
		},
		dotStyles: {
			square: "Kwadrat",
			dots: "Kropki",
			rounded: "Zaokrąglone",
			extraRounded: "Bardzo zaokrąglone",
			classy: "Eleganckie",
			classyRounded: "Eleganckie zaokrąglone"
		},
		cornerStyles: {
			square: "Kwadrat",
			dot: "Kropka",
			extraRounded: "Bardzo zaokrąglone"
		},
		errorLevels: {
			L: "L — Niski (7%)",
			M: "M — Średni (15%)",
			Q: "Q — Kwartal (25%)",
			H: "H — Wysoki (30%)"
		},
		download: {
			title: "Pobierz",
			png: "Pobierz PNG",
			svg: "Pobierz SVG",
			jpg: "Pobierz JPG"
		},
		share: {
			title: "Udostępnij",
			whatsapp: "Udostępnij przez WhatsApp",
			copy: "Kopiuj link",
			copied: "Skopiowano!"
		},
		preview: {
			empty: "Twój kod QR pojawi się tutaj",
			scanHint: "Zeskanuj dowolną kamerą"
		},
		action: {
			reset: "Resetuj kod QR"
		},
		nav: {
			buyMeCoffee: "Postaw mi kawę"
		},
		footer: {
			privacy: "Twoje dane nigdy nie opuszczają urządzenia.",
			github: "GitHub",
			builtWith: "Zbudowane z",
			madeWith: "Stworzone z myślą o prywatności.",
			rights: "Całe przetwarzanie odbywa się lokalnie w Twojej przeglądarce."
		},
		feedback: {
			title: "Wyślij opinię",
			chooseCategory: "Jaki to rodzaj opinii?",
			categoryBug: "Błąd",
			categoryBugDesc: "Coś nie działa",
			categorySuggestion: "Sugestia",
			categorySuggestionDesc: "Pomysł lub usprawnienie",
			categoryGeneral: "Ogólna",
			categoryGeneralDesc: "Cokolwiek innego",
			placeholder: "Powiedz nam co myślisz…",
			placeholderBug: "Opisz co się stało i jak to odtworzyć…",
			placeholderSuggestion: "Podziel się swoim pomysłem lub ulepszeniem…",
			placeholderGeneral: "Powiedz nam co myślisz…",
			send: "Wyślij",
			sending: "Wysyłanie…",
			close: "Zamknij panel opinii",
			back: "Wstecz",
			cancel: "Anuluj",
			addScreenshot: "Zrzut ekranu",
			removeScreenshot: "Usuń zrzut ekranu",
			screenshotPreviewAlt: "Podgląd zrzutu ekranu",
			screenshotInstruction: "Kliknij i przeciągnij, aby wybrać obszar do przechwycenia",
			captureBtn: "Przechwyć",
			capturing: "Przechwytywanie…",
			successTitle: "Dziękujemy za opinię!",
			successBody: "Twoja wiadomość została dostarczona.",
			errorGeneric: "Coś poszło nie tak. Spróbuj ponownie."
		},
		a11y: {
			qrPreview: "Podgląd wygenerowanego kodu QR",
			downloadPng: "Pobierz kod QR jako PNG",
			downloadSvg: "Pobierz kod QR jako SVG",
			downloadJpg: "Pobierz kod QR jako JPG",
			shareWhatsapp: "Udostępnij przez WhatsApp",
			copyLink: "Kopiuj link do udostępnienia",
			removeLogoAriaLabel: "Usuń logo",
			uploadLogoAriaLabel: "Prześlij obraz logo",
			feedbackCharCount: "{{remaining}} pozostałych znaków"
		},
		faq: {
			title: "Często Zadawane Pytania",
			subtitle: "Wszystko, co musisz wiedzieć o QRVault.",
			items: [
				{
					question: "Czy moje dane są prywatne? Czy coś jest przesyłane?",
					answer:
						"Nic nie opuszcza Twojego urządzenia. QRVault generuje kody QR całkowicie w przeglądarce — bez serwerów, bez przesyłania i bez śledzenia. Twoje URL-e, hasła WiFi i adresy e-mail pozostają na Twoim urządzeniu."
				},
				{
					question: "Jakie typy treści mogę zakodować w kodzie QR?",
					answer:
						"QRVault obsługuje cztery typy: URL (dowolny adres internetowy), zwykły tekst (notatki, kupony, kody produktów), e-mail (wstępnie wypełniony adres, temat i treść) oraz WiFi (SSID, hasło i typ zabezpieczeń)."
				},
				{
					question: "Czym jest korekcja błędów i który poziom wybrać?",
					answer:
						"Korekcja błędów pozwala odczytać kod QR nawet gdy jest częściowo uszkodzony. Poziom L przywraca 7%, M 15%, Q 25% i H 30%. Użyj H przy dodawaniu logo. Użyj L lub M przy czystych wydrukach, gdzie chcesz mniejsze wzory."
				},
				{
					question: "Dlaczego mój kod QR nie skanuje się?",
					answer:
						"Częste przyczyny: zbyt mały kontrast między punktami a tłem, zbyt mały kod (drukuj minimum 2,5 cm), zbyt niski poziom korekcji błędów z logo zakrywającym środek, lub zbyt długa treść (użyj skracacza URL)."
				},
				{
					question: "Jaka jest różnica między PNG, SVG i JPG?",
					answer:
						"PNG to najbezpieczniejszy wybór — bezstratny, obsługuje przezroczyste tło. SVG jest wektorowy i skaluje się nieskończenie do druku. JPG używa kompresji stratnej, która może rozmyć krawędzie potrzebne do odczytu — używaj PNG lub SVG gdy tylko możliwe."
				},
				{
					question: "Czy mogę dodać logo? Jakieś wskazówki?",
					answer:
						"Tak — prześlij PNG lub SVG używając przycisku przesyłania. Trzymaj plik poniżej 200 KB. Ustaw poziom korekcji błędów na H przed dodaniem logo, ponieważ zakrywa ono część kodu i wyższy poziom zapewnia poprawne skanowanie."
				},
				{
					question: "Czy mogę używać QRVault offline?",
					answer:
						"Po załadowaniu strony QRVault działa całkowicie offline — bez połączenia z internetem. Całe przetwarzanie odbywa się lokalnie."
				}
			]
		}
	}
};

export default pl;
