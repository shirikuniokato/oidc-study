export interface NavItem {
  readonly label: string;
  readonly href: string;
}

export interface NavSection {
  readonly title: string;
  readonly basePath: string;
  readonly items: readonly NavItem[];
}

export const mainNavItems: readonly NavItem[] = [
  { label: "コンセプト", href: "/concepts" },
  { label: "フロー", href: "/flows" },
  { label: "OIDC", href: "/oidc" },
  { label: "セキュリティ", href: "/security" },
  { label: "シミュレーター", href: "/simulator" },
  { label: "プレイグラウンド", href: "/playground" },
  { label: "クイズ", href: "/quiz" },
];

export const sidebarSections: Record<string, NavSection> = {
  concepts: {
    title: "コンセプト",
    basePath: "/concepts",
    items: [
      { label: "概要", href: "/concepts" },
      { label: "OAuth が解決する問題", href: "/concepts/the-problem" },
      { label: "認証 vs 認可", href: "/concepts/auth-vs-authz" },
      { label: "4つの役割", href: "/concepts/roles" },
      { label: "トークン", href: "/concepts/tokens" },
      { label: "スコープとクレーム", href: "/concepts/scopes-and-claims" },
      { label: "エンドポイント", href: "/concepts/endpoints" },
      { label: "クライアントタイプ", href: "/concepts/client-types" },
    ],
  },
  flows: {
    title: "フロー",
    basePath: "/flows",
    items: [
      { label: "概要", href: "/flows" },
      { label: "認可コードフロー", href: "/flows/authorization-code" },
      { label: "認可コード + PKCE", href: "/flows/authorization-code-pkce" },
      { label: "インプリシットフロー", href: "/flows/implicit" },
      {
        label: "クライアントクレデンシャル",
        href: "/flows/client-credentials",
      },
      { label: "デバイス認可", href: "/flows/device-authorization" },
      { label: "リフレッシュトークン", href: "/flows/refresh-token" },
    ],
  },
  oidc: {
    title: "OpenID Connect",
    basePath: "/oidc",
    items: [
      { label: "概要", href: "/oidc" },
      { label: "IDトークン", href: "/oidc/id-token" },
      { label: "ディスカバリ", href: "/oidc/discovery" },
      { label: "UserInfo", href: "/oidc/userinfo" },
    ],
  },
  security: {
    title: "セキュリティ",
    basePath: "/security",
    items: [
      { label: "概要", href: "/security" },
      { label: "state と CSRF", href: "/security/state-csrf" },
      { label: "PKCE", href: "/security/pkce" },
      { label: "トークン保存", href: "/security/token-storage" },
      { label: "よくある攻撃", href: "/security/common-attacks" },
    ],
  },
};

export function getSectionFromPath(pathname: string): string | null {
  const segment = pathname.split("/")[1];
  if (segment && segment in sidebarSections) {
    return segment;
  }
  return null;
}
