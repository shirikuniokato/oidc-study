import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

export const metadata: Metadata = {
	title: "OIDC / OAuth 2.0 学習サイト",
	description:
		"OpenID Connect と OAuth 2.0 を完全に理解するためのインタラクティブ学習サイト",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ja">
			<body className="flex min-h-screen flex-col bg-background text-foreground antialiased">
				<Header />
				<div className="flex-1">{children}</div>
				<Footer />
			</body>
		</html>
	);
}
