interface LogoProps {
	size?: number;
	className?: string;
}

export function Logo({ size = 36, className = "" }: LogoProps) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 36 36"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			className={className}
		>
			<defs>
				<linearGradient id="qr-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" stopColor="#67e8f9" />
					<stop offset="50%" stopColor="#06b6d4" />
					<stop offset="100%" stopColor="#0891b2" />
				</linearGradient>
			</defs>
			{/* Outer rounded square */}
			<rect
				x="3"
				y="3"
				width="30"
				height="30"
				rx="6"
				fill="url(#qr-logo-gradient)"
				opacity="0.12"
			/>
			<rect
				x="3"
				y="3"
				width="30"
				height="30"
				rx="6"
				stroke="url(#qr-logo-gradient)"
				strokeWidth="1.5"
				fill="none"
			/>
			{/* Top-left QR finder pattern */}
			<rect x="8" y="8" width="8" height="8" rx="1.5" fill="url(#qr-logo-gradient)" opacity="0.9" />
			<rect x="10" y="10" width="4" height="4" rx="0.75" fill="#0d1117" />
			<rect x="11" y="11" width="2" height="2" rx="0.3" fill="url(#qr-logo-gradient)" />
			{/* Top-right QR finder pattern */}
			<rect
				x="20"
				y="8"
				width="8"
				height="8"
				rx="1.5"
				fill="url(#qr-logo-gradient)"
				opacity="0.9"
			/>
			<rect x="22" y="10" width="4" height="4" rx="0.75" fill="#0d1117" />
			<rect x="23" y="11" width="2" height="2" rx="0.3" fill="url(#qr-logo-gradient)" />
			{/* Bottom-left QR finder pattern */}
			<rect
				x="8"
				y="20"
				width="8"
				height="8"
				rx="1.5"
				fill="url(#qr-logo-gradient)"
				opacity="0.9"
			/>
			<rect x="10" y="22" width="4" height="4" rx="0.75" fill="#0d1117" />
			<rect x="11" y="23" width="2" height="2" rx="0.3" fill="url(#qr-logo-gradient)" />
			{/* Data dots (bottom-right area) */}
			<rect
				x="20"
				y="20"
				width="2"
				height="2"
				rx="0.4"
				fill="url(#qr-logo-gradient)"
				opacity="0.8"
			/>
			<rect
				x="23"
				y="20"
				width="2"
				height="2"
				rx="0.4"
				fill="url(#qr-logo-gradient)"
				opacity="0.8"
			/>
			<rect
				x="26"
				y="20"
				width="2"
				height="2"
				rx="0.4"
				fill="url(#qr-logo-gradient)"
				opacity="0.5"
			/>
			<rect
				x="20"
				y="23"
				width="2"
				height="2"
				rx="0.4"
				fill="url(#qr-logo-gradient)"
				opacity="0.5"
			/>
			<rect
				x="26"
				y="23"
				width="2"
				height="2"
				rx="0.4"
				fill="url(#qr-logo-gradient)"
				opacity="0.8"
			/>
			<rect
				x="23"
				y="26"
				width="2"
				height="2"
				rx="0.4"
				fill="url(#qr-logo-gradient)"
				opacity="0.8"
			/>
			<rect
				x="26"
				y="26"
				width="2"
				height="2"
				rx="0.4"
				fill="url(#qr-logo-gradient)"
				opacity="0.5"
			/>
		</svg>
	);
}
