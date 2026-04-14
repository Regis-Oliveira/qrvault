const es = {
	translation: {
		brand: {
			name: "QRVault",
			tagline: "Crea códigos QR personalizados — de forma privada, en tu navegador."
		},
		hero: {
			title: "Generador de Códigos QR Gratuito y Personalizado",
			subtitle:
				"Genera códigos QR para URLs, texto, correo y WiFi — directamente en tu navegador. Sin subidas, sin servidores, sin rastreo.",
			badge: "100% Privado y Local",
			pills: {
				customColors: "Colores Personalizados",
				logoEmbedding: "Logo Integrado",
				dotStyles: "Estilos de Puntos",
				multipleFormats: "PNG / SVG / JPG",
				private: "100% Privado",
				realtime: "Vista Previa en Tiempo Real"
			}
		},
		input: {
			placeholder: "Ingresa URL, texto, correo o credenciales WiFi…",
			label: "Contenido",
			empty: "Ingresa contenido para generar el código QR.",
			generate: "Generar Código QR"
		},
		contentType: {
			label: "Tipo de contenido",
			url: "URL",
			text: "Texto",
			email: "Correo",
			wifi: "WiFi"
		},
		wifi: {
			ssid: "Nombre de red (SSID)",
			password: "Contraseña",
			security: "Seguridad",
			securityWpa: "WPA/WPA2",
			securityWep: "WEP",
			securityNone: "Ninguna (abierta)",
			hidden: "Red oculta"
		},
		email: {
			address: "Dirección de correo",
			subject: "Asunto (opcional)",
			body: "Cuerpo (opcional)"
		},
		customization: {
			title: "Personalización",
			dotStyle: "Estilo de puntos",
			dotColor: "Color de puntos",
			backgroundColor: "Color de fondo",
			cornerStyle: "Estilo de esquinas",
			errorCorrection: "Corrección de error",
			size: "Tamaño (px)",
			logo: "Imagen de logo",
			logoUpload: "Subir logo",
			logoRemove: "Quitar logo",
			logoHint: "PNG o SVG recomendado. Mantén el logo pequeño para escaneabilidad."
		},
		dotStyles: {
			square: "Cuadrado",
			dots: "Puntos",
			rounded: "Redondeado",
			extraRounded: "Extra redondeado",
			classy: "Elegante",
			classyRounded: "Elegante redondeado"
		},
		cornerStyles: {
			square: "Cuadrado",
			dot: "Punto",
			extraRounded: "Extra redondeado"
		},
		errorLevels: {
			L: "L — Bajo (7%)",
			M: "M — Medio (15%)",
			Q: "Q — Cuartil (25%)",
			H: "H — Alto (30%)"
		},
		download: {
			title: "Descargar",
			png: "Descargar PNG",
			svg: "Descargar SVG",
			jpg: "Descargar JPG"
		},
		share: {
			title: "Compartir",
			whatsapp: "Compartir por WhatsApp",
			copy: "Copiar enlace",
			copied: "¡Copiado!"
		},
		preview: {
			empty: "Tu código QR aparecerá aquí",
			scanHint: "Escanea con cualquier cámara"
		},
		action: {
			reset: "Reiniciar código QR"
		},
		nav: {
			buyMeCoffee: "Invítame a un café"
		},
		footer: {
			privacy: "Tus datos nunca salen de tu dispositivo.",
			github: "GitHub",
			builtWith: "Hecho con",
			madeWith: "Hecho pensando en la privacidad.",
			rights: "Todo el procesamiento ocurre localmente en tu navegador."
		},
		feedback: {
			title: "Enviar comentarios",
			chooseCategory: "¿Qué tipo de comentario es este?",
			categoryBug: "Error",
			categoryBugDesc: "Algo no funciona",
			categorySuggestion: "Sugerencia",
			categorySuggestionDesc: "Una idea o mejora",
			categoryGeneral: "General",
			categoryGeneralDesc: "Cualquier otra cosa",
			placeholder: "Dinos qué piensas…",
			placeholderBug: "Describe qué ocurrió y cómo reproducirlo…",
			placeholderSuggestion: "Comparte tu idea o mejora…",
			placeholderGeneral: "Dinos qué piensas…",
			send: "Enviar",
			sending: "Enviando…",
			close: "Cerrar panel de comentarios",
			back: "Volver",
			cancel: "Cancelar",
			addScreenshot: "Captura",
			removeScreenshot: "Eliminar captura",
			screenshotPreviewAlt: "Vista previa de la captura",
			screenshotInstruction: "Haz clic y arrastra para seleccionar el área a capturar",
			captureBtn: "Capturar",
			capturing: "Capturando…",
			successTitle: "¡Gracias por tus comentarios!",
			successBody: "Tu mensaje ha sido entregado.",
			errorGeneric: "Algo salió mal. Por favor, inténtalo de nuevo."
		},
		a11y: {
			qrPreview: "Vista previa del código QR generado",
			downloadPng: "Descargar código QR como PNG",
			downloadSvg: "Descargar código QR como SVG",
			downloadJpg: "Descargar código QR como JPG",
			shareWhatsapp: "Compartir por WhatsApp",
			copyLink: "Copiar enlace compartible",
			removeLogoAriaLabel: "Quitar logo",
			uploadLogoAriaLabel: "Subir imagen de logo",
			feedbackCharCount: "{{remaining}} caracteres restantes"
		},
		faq: {
			title: "Preguntas Frecuentes",
			subtitle: "Todo lo que necesitas saber sobre QRVault.",
			items: [
				{
					question: "¿Son privados mis datos? ¿Se sube algo a servidores?",
					answer:
						"Nada sale de tu dispositivo. QRVault genera códigos QR completamente en tu navegador — sin servidores, sin subidas y sin rastreo. Tus URLs, contraseñas WiFi y correos permanecen en tu máquina."
				},
				{
					question: "¿Qué tipos de contenido puedo codificar en un código QR?",
					answer:
						"QRVault admite cuatro tipos: URL (cualquier dirección web), texto plano (notas, cupones, códigos de producto), correo electrónico (dirección, asunto y cuerpo pre-completados) y WiFi (SSID, contraseña y tipo de seguridad)."
				},
				{
					question: "¿Qué es la corrección de errores y qué nivel debo usar?",
					answer:
						"La corrección de errores permite leer el código QR incluso si está dañado. Nivel L recupera 7%, M 15%, Q 25% y H 30%. Usa H al insertar un logo. Usa L o M para impresiones limpias donde quieres patrones más pequeños y densos."
				},
				{
					question: "¿Por qué mi código QR no se puede escanear?",
					answer:
						"Causas comunes: bajo contraste entre puntos y fondo, código demasiado pequeño (imprime al menos 2,5 cm), corrección de errores baja con logo cubriendo el centro, o contenido demasiado largo (usa un acortador de URL)."
				},
				{
					question: "¿Cuál es la diferencia entre PNG, SVG y JPG?",
					answer:
						"PNG es la opción más segura — sin pérdidas, soporta fondo transparente. SVG es vectorial y escala infinitamente para impresión. JPG usa compresión con pérdidas que puede difuminar los bordes necesarios para la lectura — usa PNG o SVG siempre que sea posible."
				},
				{
					question: "¿Puedo añadir un logo? ¿Algún consejo?",
					answer:
						"Sí — sube un PNG o SVG usando el botón de subida. Mantén el archivo por debajo de 200 KB. Establece la corrección de errores en H antes de añadir el logo, ya que cubre parte del código y el nivel más alto garantiza una lectura correcta."
				},
				{
					question: "¿Puedo usar QRVault sin conexión?",
					answer:
						"Una vez que la página ha cargado, QRVault funciona completamente sin conexión — no se necesita internet. Todo el procesamiento es local."
				}
			]
		}
	}
};

export default es;
