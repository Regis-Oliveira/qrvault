const fr = {
	translation: {
		brand: {
			name: "QRVault",
			tagline: "Créez des QR codes personnalisés — en toute confidentialité, dans votre navigateur."
		},
		hero: {
			title: "Générateur de QR Codes Gratuit et Personnalisé",
			subtitle:
				"Générez des QR codes pour des URL, du texte, des e-mails et du WiFi — directement dans votre navigateur. Sans téléchargement, sans serveurs, sans suivi.",
			badge: "100% Privé et Local",
			pills: {
				customColors: "Couleurs Personnalisées",
				logoEmbedding: "Logo Intégré",
				dotStyles: "Styles de Points",
				multipleFormats: "PNG / SVG / JPG",
				private: "100% Privé",
				realtime: "Aperçu en Temps Réel"
			}
		},
		url: {
			label: "URL",
			placeholder: "https://exemple.com",
			error: "Entrez une URL valide commençant par https:// ou http://"
		},
		input: {
			placeholder: "Entrez une URL, du texte, un e-mail ou des identifiants WiFi…",
			label: "Contenu",
			empty: "Entrez du contenu pour générer le QR code.",
			generate: "Générer le QR Code"
		},
		contentType: {
			label: "Type de contenu",
			url: "URL",
			text: "Texte",
			email: "E-mail",
			wifi: "WiFi"
		},
		wifi: {
			ssid: "Nom du réseau (SSID)",
			password: "Mot de passe",
			security: "Sécurité",
			securityWpa: "WPA/WPA2",
			securityWep: "WEP",
			securityNone: "Aucune (ouvert)",
			hidden: "Réseau masqué"
		},
		email: {
			address: "Adresse e-mail",
			subject: "Objet (facultatif)",
			body: "Corps (facultatif)"
		},
		customization: {
			title: "Personnalisation",
			dotStyle: "Style des points",
			dotColor: "Couleur des points",
			backgroundColor: "Couleur de fond",
			cornerStyle: "Style des coins",
			errorCorrection: "Correction d'erreur",
			size: "Taille (px)",
			logo: "Image du logo",
			logoUpload: "Télécharger un logo",
			logoRemove: "Supprimer le logo",
			logoHint: "PNG ou SVG recommandé. Gardez-le petit pour une bonne lisibilité."
		},
		dotStyles: {
			square: "Carré",
			dots: "Points",
			rounded: "Arrondi",
			extraRounded: "Très arrondi",
			classy: "Élégant",
			classyRounded: "Élégant arrondi"
		},
		cornerStyles: {
			square: "Carré",
			dot: "Point",
			extraRounded: "Très arrondi"
		},
		errorLevels: {
			L: "L — Faible (7%)",
			M: "M — Moyen (15%)",
			Q: "Q — Quartile (25%)",
			H: "H — Élevé (30%)"
		},
		download: {
			title: "Télécharger",
			png: "Télécharger PNG",
			svg: "Télécharger SVG",
			jpg: "Télécharger JPG"
		},
		share: {
			title: "Partager",
			shareImage: "Partager l'image QR",
			sharing: "Partage en cours…",
			copy: "Copier le contenu",
			copied: "Copié !"
		},
		preview: {
			empty: "Votre QR code apparaîtra ici",
			scanHint: "Scannez avec n'importe quelle caméra"
		},
		action: {
			reset: "Réinitialiser le QR Code"
		},
		nav: {
			buyMeCoffee: "Offrez-moi un café",
			myQRCodes: "Mes QR Codes"
		},
		footer: {
			privacy: "Vos données ne quittent jamais votre appareil.",
			github: "GitHub",
			builtWith: "Construit avec",
			madeWith: "Fait en pensant à la confidentialité.",
			rights: "Tout le traitement s'effectue localement dans votre navigateur."
		},
		feedback: {
			title: "Envoyer un avis",
			chooseCategory: "Quel type d'avis est-ce ?",
			categoryBug: "Bug",
			categoryBugDesc: "Quelque chose ne fonctionne pas",
			categorySuggestion: "Suggestion",
			categorySuggestionDesc: "Une idée ou une amélioration",
			categoryGeneral: "Général",
			categoryGeneralDesc: "Autre chose",
			placeholder: "Dites-nous ce que vous pensez…",
			placeholderBug: "Décrivez ce qui s'est passé et comment le reproduire…",
			placeholderSuggestion: "Partagez votre idée ou amélioration…",
			placeholderGeneral: "Dites-nous ce que vous pensez…",
			send: "Envoyer",
			sending: "Envoi en cours…",
			close: "Fermer le panneau d'avis",
			back: "Retour",
			cancel: "Annuler",
			addScreenshot: "Capture",
			removeScreenshot: "Supprimer la capture",
			screenshotPreviewAlt: "Aperçu de la capture",
			screenshotInstruction: "Cliquez et faites glisser pour sélectionner la zone à capturer",
			captureBtn: "Capturer",
			capturing: "Capture en cours…",
			successTitle: "Merci pour votre avis !",
			successBody: "Votre message a été transmis.",
			errorGeneric: "Une erreur s'est produite. Veuillez réessayer."
		},
		a11y: {
			qrPreview: "Aperçu du QR code généré",
			downloadPng: "Télécharger le QR code en PNG",
			downloadSvg: "Télécharger le QR code en SVG",
			downloadJpg: "Télécharger le QR code en JPG",
			shareImage: "Partager le QR code comme image",
			copyContent: "Copier le contenu du QR code",
			removeLogoAriaLabel: "Supprimer le logo",
			uploadLogoAriaLabel: "Télécharger une image de logo",
			feedbackCharCount: "{{remaining}} caractères restants",
			editQR: "Modifier {{title}}",
			deleteQR: "Supprimer {{title}}"
		},
		save: {
			button: "Sauvegarder le QR code",
			sectionTitle: "Sauvegarder",
			dialogTitle: "Sauvegarder le QR code",
			dialogEdit: "Modifier le QR code sauvegardé",
			titleLabel: "Titre",
			titlePlaceholder: "ex. : WiFi Maison, Mon Portfolio…",
			descLabel: "Description",
			descPlaceholder: "Notes optionnelles sur ce QR code…",
			categoryLabel: "Catégorie",
			categoryPlaceholder: "Sélectionnez une catégorie…",
			categoryCustom: "✚ Personnalisée…",
			categoryCustomPlaceholder: "Tapez une catégorie personnalisée…",
			save: "Sauvegarder",
			update: "Mettre à jour",
			updateBtn: "Mettre à jour le QR code",
			cancel: "Annuler",
			titleRequired: "Le titre est obligatoire.",
			saved: "Sauvegardé !",
			updated: "Mis à jour !"
		},
		vault: {
			title: "Mes QR Codes",
			subtitle: "Tous vos QR codes sauvegardés au même endroit.",
			empty: "Aucun QR code sauvegardé pour l'instant.",
			emptyHint: 'Générez un QR code et cliquez sur "Sauvegarder le QR code" pour le stocker ici.',
			filterAll: "Tous",
			deleteConfirm: "Supprimer ce QR code ?",
			confirmYes: "Supprimer",
			confirmNo: "Annuler",
			downloadBtn: "Télécharger",
			createFirst: "Créez votre premier QR code"
		},
		storage: {
			ariaLabel: "Stockage : {{percent}}% utilisé",
			warning: "Le stockage se remplit. Pensez à supprimer des QR codes.",
			critical: "Le stockage est presque plein.",
			blocked: "Stockage plein. Supprimez des QR codes pour continuer à sauvegarder."
		},
		faq: {
			title: "Questions Fréquentes",
			subtitle: "Tout ce que vous devez savoir sur QRVault.",
			items: [
				{
					question: "Mes données sont-elles privées ? Y a-t-il des envois vers des serveurs ?",
					answer:
						"Rien ne quitte votre appareil. QRVault génère les QR codes entièrement dans votre navigateur — sans serveurs, sans téléchargements et sans suivi. Vos URLs, mots de passe WiFi et adresses e-mail restent sur votre machine."
				},
				{
					question: "Quels types de contenu puis-je encoder dans un QR code ?",
					answer:
						"QRVault supporte quatre types : URL (toute adresse web), texte brut (notes, coupons, codes produit), e-mail (adresse, objet et corps pré-remplis) et WiFi (SSID, mot de passe et type de sécurité)."
				},
				{
					question: "Qu'est-ce que la correction d'erreur et quel niveau choisir ?",
					answer:
						"La correction d'erreur permet de lire le QR code même s'il est partiellement endommagé. Niveau L récupère 7 %, M 15 %, Q 25 % et H 30 %. Utilisez H lors de l'intégration d'un logo. Utilisez L ou M pour des impressions propres où vous voulez des motifs plus petits."
				},
				{
					question: "Pourquoi mon QR code ne se scanne pas ?",
					answer:
						"Causes courantes : faible contraste entre les points et le fond, code trop petit (imprimez au moins 2,5 cm), correction d'erreur trop faible avec un logo couvrant le centre, ou contenu trop long (utilisez un raccourcisseur d'URL)."
				},
				{
					question: "Quelle est la différence entre PNG, SVG et JPG ?",
					answer:
						"PNG est le choix le plus sûr — sans perte, supporte les fonds transparents. SVG est vectoriel et s'adapte infiniment pour l'impression. JPG utilise une compression avec perte qui peut flouter les bords nécessaires à la lecture — utilisez PNG ou SVG autant que possible."
				},
				{
					question: "Puis-je ajouter un logo ? Des conseils ?",
					answer:
						"Oui — téléchargez un PNG ou SVG via le bouton d'upload. Gardez le fichier en dessous de 200 Ko. Définissez la correction d'erreur sur H avant d'ajouter le logo, car il couvre une partie du code et le niveau élevé garantit une lecture correcte."
				},
				{
					question: "Puis-je utiliser QRVault hors ligne ?",
					answer:
						"Une fois la page chargée, QRVault fonctionne entièrement hors ligne — aucune connexion internet requise. Tout le traitement est local."
				}
			]
		}
	}
};

export default fr;
