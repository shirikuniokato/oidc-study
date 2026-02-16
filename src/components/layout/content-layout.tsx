import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

export interface ContentLayoutProps {
	readonly title?: string;
	readonly description?: string;
	readonly badge?: string;
	readonly section?: string;
	readonly children: ReactNode;
}

export function ContentLayout({
	title,
	description,
	badge,
	children,
}: ContentLayoutProps) {
	return (
		<div className="mx-auto max-w-4xl px-6 py-12">
			{title && (
				<header className="mb-10">
					<div className="mb-3 flex items-center gap-3">
						<h1 className="text-3xl font-bold tracking-tight text-foreground">
							{title}
						</h1>
						{badge && <Badge variant="secondary">{badge}</Badge>}
					</div>
					{description && (
						<p className="text-lg leading-relaxed text-muted-foreground">
							{description}
						</p>
					)}
				</header>
			)}
			<main className="space-y-8">{children}</main>
		</div>
	);
}
