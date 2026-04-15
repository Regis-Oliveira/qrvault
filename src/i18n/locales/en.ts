const en = {
	translation: {
		brand: {
			name: "QRVault",
			tagline: "Create custom QR codes — privately, in your browser."
		},
		hero: {
			title: "Free Custom QR Code Generator",
			subtitle:
				"Generate QR codes for URLs, text, email, and WiFi — directly in your browser. No uploads, no servers, no tracking.",
			badge: "100% Private & Local",
			pills: {
				customColors: "Custom Colors",
				logoEmbedding: "Logo Embedding",
				dotStyles: "Dot Styles",
				multipleFormats: "PNG / SVG / JPG",
				private: "100% Private",
				realtime: "Real-time Preview"
			}
		},
		url: {
			label: "URL",
			placeholder: "https://example.com",
			error: "Enter a valid URL starting with https:// or http://"
		},
		input: {
			placeholder: "Enter URL, text, email or WiFi credentials…",
			label: "Content",
			empty: "Please enter some content to generate a QR code.",
			generate: "Generate QR Code"
		},
		contentType: {
			label: "Content type",
			url: "URL",
			text: "Text",
			email: "Email",
			wifi: "WiFi"
		},
		wifi: {
			ssid: "Network name (SSID)",
			password: "Password",
			security: "Security",
			securityWpa: "WPA/WPA2",
			securityWep: "WEP",
			securityNone: "None (open)",
			hidden: "Hidden network"
		},
		email: {
			address: "Email address",
			subject: "Subject (optional)",
			body: "Body (optional)"
		},
		customization: {
			title: "Customization",
			dotStyle: "Dot style",
			dotColor: "Dot color",
			backgroundColor: "Background color",
			cornerStyle: "Corner style",
			errorCorrection: "Error correction",
			size: "Size (px)",
			logo: "Logo image",
			logoUpload: "Upload logo",
			logoRemove: "Remove logo",
			logoHint: "PNG or SVG recommended. Keep it small for scannability."
		},
		dotStyles: {
			square: "Square",
			dots: "Dots",
			rounded: "Rounded",
			extraRounded: "Extra rounded",
			classy: "Classy",
			classyRounded: "Classy rounded"
		},
		cornerStyles: {
			square: "Square",
			dot: "Dot",
			extraRounded: "Extra rounded"
		},
		errorLevels: {
			L: "L — Low (7%)",
			M: "M — Medium (15%)",
			Q: "Q — Quartile (25%)",
			H: "H — High (30%)"
		},
		download: {
			title: "Download",
			png: "Download PNG",
			svg: "Download SVG",
			jpg: "Download JPG"
		},
		share: {
			title: "Share",
			shareImage: "Share QR Image",
			sharing: "Sharing…",
			copy: "Copy content",
			copied: "Copied!"
		},
		preview: {
			empty: "Your QR code will appear here",
			scanHint: "Scan with any camera app"
		},
		action: {
			reset: "Reset QR Code"
		},
		nav: {
			buyMeCoffee: "Buy me a coffee",
			myQRCodes: "My QR Codes"
		},
		footer: {
			privacy: "Your data never leaves your device.",
			github: "GitHub",
			builtWith: "Built with",
			madeWith: "Made with privacy in mind.",
			rights: "All processing happens locally in your browser."
		},
		feedback: {
			title: "Send Feedback",
			chooseCategory: "What kind of feedback is this?",
			categoryBug: "Bug",
			categoryBugDesc: "Something isn't working",
			categorySuggestion: "Suggestion",
			categorySuggestionDesc: "An idea or improvement",
			categoryGeneral: "General",
			categoryGeneralDesc: "Anything else",
			placeholder: "Tell us what you think…",
			placeholderBug: "Describe what happened and how to reproduce it…",
			placeholderSuggestion: "Share your idea or improvement…",
			placeholderGeneral: "Tell us what you think…",
			send: "Send",
			sending: "Sending…",
			close: "Close feedback panel",
			back: "Back",
			cancel: "Cancel",
			addScreenshot: "Screenshot",
			removeScreenshot: "Remove screenshot",
			screenshotPreviewAlt: "Screenshot preview",
			screenshotInstruction: "Click and drag to select the area to capture",
			captureBtn: "Capture",
			capturing: "Capturing…",
			successTitle: "Thanks for your feedback!",
			successBody: "Your message has been delivered.",
			errorGeneric: "Something went wrong. Please try again."
		},
		a11y: {
			qrPreview: "Generated QR code preview",
			downloadPng: "Download QR code as PNG",
			downloadSvg: "Download QR code as SVG",
			downloadJpg: "Download QR code as JPG",
			shareImage: "Share QR code as image",
			copyContent: "Copy QR code content",
			removeLogoAriaLabel: "Remove logo",
			uploadLogoAriaLabel: "Upload logo image",
			feedbackCharCount: "{{remaining}} characters remaining",
			editQR: "Edit {{title}}",
			deleteQR: "Delete {{title}}"
		},
		save: {
			button: "Save QR Code",
			sectionTitle: "Save",
			dialogTitle: "Save QR Code",
			dialogEdit: "Edit Saved QR",
			titleLabel: "Title",
			titlePlaceholder: "e.g. Home WiFi, My Portfolio…",
			descLabel: "Description",
			descPlaceholder: "Optional notes about this QR code…",
			categoryLabel: "Category",
			categoryPlaceholder: "Select a category…",
			categoryCustom: "✚ Custom…",
			categoryCustomPlaceholder: "Type a custom category…",
			save: "Save",
			update: "Update",
			updateBtn: "Update QR Code",
			cancel: "Cancel",
			titleRequired: "Title is required.",
			saved: "Saved!",
			updated: "Updated!"
		},
		vault: {
			title: "My QR Codes",
			subtitle: "All your saved QR codes in one place.",
			empty: "No QR codes saved yet.",
			emptyHint: 'Generate a QR code and click "Save QR Code" to store it here.',
			filterAll: "All",
			deleteConfirm: "Delete this?",
			confirmYes: "Delete",
			confirmNo: "Cancel",
			downloadBtn: "Download",
			createFirst: "Create your first QR code"
		},
		storage: {
			ariaLabel: "Storage: {{percent}}% used",
			warning: "Storage is getting full. Consider deleting some QR codes.",
			critical: "Storage is almost full.",
			blocked: "Storage is full. Delete some QR codes to continue saving."
		},
		faq: {
			title: "Frequently Asked Questions",
			subtitle:
				"Everything you need to know about creating custom QR codes with QRVault — free, private, and directly in your browser.",
			items: [
				{
					question: "How do I create a free QR code online?",
					answer:
						"Creating a free custom QR code with QRVault takes just seconds. Select a content type — URL, plain text, email, or WiFi — type or paste your content, and your QR code generates in real time as you type. Customize the dot color, background color, dot style, and corner shape, then download in PNG, SVG, or JPG format. No sign-up, no account, no watermarks — completely free, forever."
				},
				{
					question: "Is QRVault really free and private? Is my data safe?",
					answer:
						"Yes — QRVault is 100% free with no hidden fees, and your data never leaves your device. All QR code generation runs entirely in your browser using JavaScript. There are no servers receiving your URLs, WiFi passwords, email addresses, or any content you encode. No account required, no tracking, no analytics on your content. Everything is processed locally and discarded the moment you close the tab."
				},
				{
					question: "Can I create a custom QR code with a logo and brand colors?",
					answer:
						"Absolutely. QRVault lets you fully customize your QR code design: pick any dot color and background color with the color pickers, choose from six dot styles (square, rounded, dots, extra-rounded, classy, classy-rounded) and three corner styles, and upload a PNG or SVG logo to embed in the center. For branded QR codes with a logo, set error correction to level H — it recovers up to 30% of the pattern, ensuring the code still scans reliably even with the logo covering the center."
				},
				{
					question: "How do I make a QR code for WiFi so guests can connect instantly?",
					answer:
						"Switch the content type to WiFi, enter your network name (SSID), password, and security type (WPA/WPA2, WEP, or open/none). QRVault encodes this in the standard WiFi QR code format recognized natively by iOS Camera, Android Camera, and most modern scanner apps — guests simply point their camera at the code to connect without typing. Your WiFi password is encoded locally and never transmitted anywhere."
				},
				{
					question: "Why is my QR code not scanning? How do I fix it?",
					answer:
						"The most common causes: (1) Low color contrast — always use dark dots on a light background or vice versa; avoid gray-on-white or similar low-contrast combinations. (2) Printed too small — a scannable QR code should be at least 2.5 cm × 2.5 cm (1 inch) at the intended viewing distance. (3) Logo covers too much — if you embedded a logo, switch error correction to level H so the code can recover lost pattern. (4) Content too long — very long URLs create dense, hard-to-scan codes; use a URL shortener first. Download as PNG for the sharpest pixel edges."
				},
				{
					question: "PNG, SVG, or JPG — which QR code format should I download?",
					answer:
						"PNG is the best choice for most uses: lossless compression, sharp edges, transparent background support, and universal compatibility with printers, apps, and scanners. SVG is a vector format that scales to any size without pixelation — ideal for large-format printing, billboards, and professional design files. JPG uses lossy compression that blurs the sharp edges QR scanners depend on; only use it if file size is a hard constraint and PNG is not an option. For digital and web use, choose PNG; for print and scalable design, choose SVG."
				},
				{
					question: "What is QR code error correction and which level should I choose?",
					answer:
						"Error correction determines how much of the QR code pattern can be damaged, dirty, or obscured and still scan correctly. Level L (7%) is suitable for clean digital screens with no physical wear. Level M (15%) is a solid general-purpose default for most printed and digital uses. Level Q (25%) adds resilience for codes in rough environments — outdoor signage, product labels, or high-traffic surfaces. Level H (30%) is required whenever you embed a logo, since the logo physically covers part of the pattern. Higher correction levels produce a denser, more complex visual pattern — use the lowest level that meets your use case for the best scannability."
				}
			]
		}
	}
};

export default en;
