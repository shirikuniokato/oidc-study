import { Shield } from "lucide-react";

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield size={14} />
          <span>OIDC / OAuth 2.0 学習サイト</span>
        </div>
        <p className="text-xs text-muted-foreground">
          教育目的のみ。本番環境では使用しないでください。
        </p>
      </div>
    </footer>
  );
}

export { Footer };
