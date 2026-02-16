# OIDC/OAuth 2.0 学習サイト 実装計画

## Context

OIDC と OAuth 2.0 を初心者が完全に理解するための学習サイトを構築する。単なるドキュメントサイトではなく、モック OIDC プロバイダーによるフロー体験、インタラクティブなシーケンス図、JWT デコーダー、クイズなど、多角的な学習手段を提供する「最高の学習サイト」を目指す。

- 言語: 日本語
- デザイン: モダン・ミニマル（shadcn/ui ベース）
- スコープ: 全機能一括実装

---

## 技術スタック

| 技術 | 用途 |
|------|------|
| Next.js (App Router) | フレームワーク |
| TypeScript (strict) | 型安全 |
| Tailwind CSS v4 | スタイリング |
| shadcn/ui | UIコンポーネント |
| Framer Motion | フロー図アニメーション |
| jose | JWT 署名・検証・JWK 生成 |
| Biome | Lint + Format |
| Vitest | ユニットテスト |
| pnpm | パッケージマネージャ |

Mock OIDC プロバイダーは Next.js Route Handlers で実装（別サーバー不要）。
状態管理はインメモリ Map（教育用途なので永続化不要）。

---

## ページ構成

### ランディング
- `/` - トップページ（学習ロードマップ概要、各セクションへの導線）

### コンセプト解説 (`/concepts/`)
| パス | 内容 |
|------|------|
| `/concepts` | コンセプト一覧 |
| `/concepts/the-problem` | OAuth が解決する問題（パスワード共有の危険性） |
| `/concepts/auth-vs-authz` | 認証 vs 認可の違い |
| `/concepts/roles` | 4つの役割（リソースオーナー、クライアント、認可サーバー、リソースサーバー） |
| `/concepts/tokens` | トークンの概要（アクセストークン、IDトークン、リフレッシュトークン） |
| `/concepts/scopes-and-claims` | スコープとクレーム |
| `/concepts/endpoints` | 各エンドポイントの役割 |
| `/concepts/client-types` | 機密クライアント vs パブリッククライアント |

### フロー解説 (`/flows/`)
| パス | 内容 |
|------|------|
| `/flows` | フロー一覧 + 比較表 |
| `/flows/authorization-code` | 認可コードフロー |
| `/flows/authorization-code-pkce` | 認可コード + PKCE |
| `/flows/implicit` | インプリシットフロー（非推奨の理由付き） |
| `/flows/client-credentials` | クライアントクレデンシャルフロー |
| `/flows/device-authorization` | デバイス認可フロー |
| `/flows/refresh-token` | リフレッシュトークンフロー |

### OIDC (`/oidc/`)
| パス | 内容 |
|------|------|
| `/oidc` | OIDC 概要 |
| `/oidc/id-token` | IDトークン詳解 |
| `/oidc/discovery` | ディスカバリドキュメント |
| `/oidc/userinfo` | UserInfo エンドポイント |

### セキュリティ (`/security/`)
| パス | 内容 |
|------|------|
| `/security` | セキュリティ概要 |
| `/security/state-csrf` | state パラメータと CSRF 防止 |
| `/security/pkce` | PKCE の仕組み |
| `/security/token-storage` | トークンの安全な保存方法 |
| `/security/common-attacks` | よくある攻撃と対策 |

### インタラクティブツール
| パス | 内容 |
|------|------|
| `/simulator` | フローシミュレーター（フロー選択画面） |
| `/simulator/[flow]` | 各フローのインタラクティブシミュレーション |
| `/playground` | JWTデコーダー / トークンインスペクター |
| `/playground/token-builder` | JWTを手動で構築するツール |
| `/playground/pkce-generator` | PKCE code_verifier/challenge 生成ツール |
| `/quiz` | クイズ一覧 |
| `/quiz/[topic]` | トピック別クイズ |

---

## プロジェクト構造

```
src/
├── app/
│   ├── layout.tsx                    # ルートレイアウト
│   ├── page.tsx                      # ランディング
│   ├── globals.css
│   ├── concepts/                     # コンセプト解説ページ群
│   ├── flows/                        # フロー解説ページ群
│   ├── oidc/                         # OIDC解説ページ群
│   ├── security/                     # セキュリティ解説ページ群
│   ├── simulator/                    # インタラクティブシミュレーター
│   ├── playground/                   # トークンプレイグラウンド
│   ├── quiz/                         # クイズ
│   └── api/mock-oidc/               # Mock OIDCプロバイダー
│       ├── .well-known/openid-configuration/route.ts
│       ├── authorize/route.ts
│       ├── token/route.ts
│       ├── userinfo/route.ts
│       ├── jwks/route.ts
│       ├── device/authorize/route.ts
│       └── revoke/route.ts
├── components/
│   ├── ui/                           # shadcn/ui コンポーネント
│   ├── layout/                       # ヘッダー、フッター、サイドバー
│   ├── diagrams/                     # シーケンス図コンポーネント
│   │   ├── sequence-diagram.tsx      # アニメーション付きシーケンス図
│   │   ├── actor.tsx                 # アクター表示（ブラウザ、サーバー等）
│   │   ├── message-arrow.tsx         # メッセージ矢印
│   │   └── http-detail-panel.tsx     # HTTP詳細パネル
│   ├── simulator/                    # シミュレーター固有コンポーネント
│   │   ├── flow-stepper.tsx          # ステップ制御（Next/Prev/Reset）
│   │   ├── mock-browser.tsx          # ブラウザクローム模擬
│   │   ├── mock-login-page.tsx       # モックログイン画面
│   │   ├── mock-consent-page.tsx     # 同意画面
│   │   ├── request-inspector.tsx     # HTTPリクエスト表示
│   │   ├── response-inspector.tsx    # HTTPレスポンス表示
│   │   ├── url-bar.tsx               # URL表示（パラメータハイライト）
│   │   └── security-callout.tsx      # セキュリティ注意事項
│   ├── token/                        # トークン関連コンポーネント
│   │   ├── jwt-decoder.tsx           # JWTデコーダー
│   │   ├── jwt-header-view.tsx
│   │   ├── jwt-payload-view.tsx
│   │   ├── jwt-signature-view.tsx
│   │   ├── claim-badge.tsx           # クレームバッジ（ツールチップ付き）
│   │   └── token-timeline.tsx        # iat/exp/nbf タイムライン表示
│   ├── comparison/                   # フロー比較コンポーネント
│   │   ├── flow-comparison-table.tsx
│   │   └── feature-matrix.tsx
│   └── quiz/                         # クイズコンポーネント
│       ├── quiz-container.tsx
│       ├── question-card.tsx
│       ├── multiple-choice.tsx
│       ├── drag-drop-ordering.tsx    # ステップ並び替え問題
│       └── quiz-results.tsx
├── lib/
│   ├── oidc/                         # Mock OIDCプロバイダーのロジック
│   │   ├── types.ts                  # 型定義
│   │   ├── config.ts                 # ディスカバリドキュメント設定
│   │   ├── keys.ts                   # RSA鍵ペア生成・JWKエクスポート
│   │   ├── token-issuer.ts           # JWT発行
│   │   ├── token-validator.ts        # JWT検証（教育表示用）
│   │   ├── authorization-code-store.ts
│   │   ├── session-store.ts
│   │   ├── pkce.ts                   # PKCE ユーティリティ
│   │   └── device-code-store.ts
│   ├── flows/                        # フロー定義データ
│   │   ├── types.ts                  # FlowStep, FlowDefinition, Actor
│   │   ├── authorization-code.ts
│   │   ├── authorization-code-pkce.ts
│   │   ├── implicit.ts
│   │   ├── client-credentials.ts
│   │   ├── device-authorization.ts
│   │   └── refresh-token.ts
│   ├── quiz/                         # クイズデータ
│   │   ├── types.ts
│   │   ├── questions/                # トピック別問題
│   │   └── scoring.ts
│   └── utils/
│       ├── base64url.ts
│       ├── random.ts
│       └── http-formatter.ts
└── hooks/
    ├── use-flow-simulator.ts         # シミュレーター状態管理
    ├── use-jwt-decode.ts
    └── use-quiz.ts
```

---

## 核心設計

### 1. フロー定義を Single Source of Truth にする

フロー解説ページとシミュレーターは同じデータから描画する:

```typescript
// src/lib/flows/types.ts
type Actor = 'user-agent' | 'client' | 'authorization-server' | 'resource-server';

interface FlowStep {
  readonly id: string;
  readonly order: number;
  readonly title: string;           // 「認可リクエスト送信」
  readonly description: string;     // 詳しい説明
  readonly from: Actor;
  readonly to: Actor;
  readonly request: HttpExchange;
  readonly response?: HttpExchange;
  readonly securityNotes: ReadonlyArray<string>;
  readonly highlightParams: ReadonlyArray<string>;
}

interface FlowDefinition {
  readonly id: string;
  readonly name: string;            // 「認可コードフロー」
  readonly description: string;
  readonly actors: ReadonlyArray<Actor>;
  readonly steps: ReadonlyArray<FlowStep>;
  readonly whenToUse: ReadonlyArray<string>;
  readonly whenNotToUse: ReadonlyArray<string>;
  readonly securityConsiderations: ReadonlyArray<string>;
}
```

### 2. Mock OIDC プロバイダー

教育用の認可サーバーを Route Handlers で実装:

- **エンドポイント**: `/api/mock-oidc/authorize`, `/token`, `/userinfo`, `/jwks`, `/.well-known/openid-configuration`, `/device/authorize`, `/revoke`
- **実際の JWT を発行**: `jose` で RS256 署名した本物の JWT
- **デバッグモード**: 全レスポンスに `_debug` フィールドを付与し、サーバー側の検証過程を可視化
- **テストユーザー**: Alice と Bob の2名がハードコード済み（登録不要）
- **セキュリティ教育**: 認可コードは使い捨て（60秒有効）、PKCE 検証を強制、state パラメータをパススルー

### 3. シミュレーター（useFlowSimulator フック）

ステートマシンで管理:
- ステップごとに「次へ」で進む
- 各ステップで実際のHTTPリクエスト/レスポンスを表示
- Mock OIDC プロバイダーに実際のHTTPリクエストを送信
- セキュリティ関連パラメータをハイライト表示
- 自動再生モード対応

### 4. JWT プレイグラウンド

- ペーストまたはシミュレーターから自動入力
- ヘッダー（赤）/ ペイロード（青）/ 署名（緑）で色分け
- 各クレームにツールチップで意味を説明
- `iat`/`exp`/`nbf` のタイムライン視覚化
- Mock プロバイダーの JWK を取得して署名検証

### 5. クイズシステム

- **択一問題**: 「SPAに最適なフローは？」
- **並び替え問題**: フローのステップを正しい順序に
- **穴埋め問題**: HTTPリクエスト/レスポンスを完成させる
- 即時フィードバック（正誤＋解説）
- localStorage で進捗保存

---

## 学習パス（コンテンツの順序）

```
Phase 1: なぜOAuthが必要か
  └─ パスワード共有の問題 → 認証vs認可 → 4つの役割 → トークンの概念

Phase 2: 基本フローを理解する
  └─ 認可コードフロー → スコープと同意 → トークンレスポンス

Phase 3: セキュリティを理解する
  └─ state と CSRF → PKCE → 認可コード + PKCE（現在の標準）

Phase 4: OIDCで認証を追加する
  └─ OAuthだけでは認証できない理由 → IDトークン → クレーム → ディスカバリ

Phase 5: その他のフロー
  └─ クライアントクレデンシャル → デバイス認可 → リフレッシュトークン → 非推奨フロー

Phase 6: セキュリティ深掘り
  └─ トークン検証 → トークン保存 → よくある攻撃 → OAuth 2.1
```

---

## 実装ステップ

### Step 1: プロジェクト初期化
- Next.js + TypeScript + Tailwind CSS + pnpm でプロジェクト作成
- Biome 設定
- shadcn/ui 初期化
- 基本レイアウト（ヘッダー、フッター、サイドバーナビゲーション）

### Step 2: コンテンツページ
- 全コンセプト解説ページを作成（8ページ）
- 全フロー解説ページを作成（6ページ）
- OIDC 解説ページを作成（4ページ）
- セキュリティ解説ページを作成（5ページ）
- 各ページに静的シーケンス図を含める

### Step 3: Mock OIDC プロバイダー
- `src/lib/oidc/` に型定義・鍵生成・トークン発行・ストア実装
- 全 Route Handler 実装（7エンドポイント）
- デバッグモード実装

### Step 4: インタラクティブシミュレーター
- フロー定義データ作成（6フロー分）
- `useFlowSimulator` フック実装
- アニメーション付きシーケンス図コンポーネント
- Mock ブラウザ / URL バー / HTTPインスペクター
- 各フローのシミュレーターページ

### Step 5: トークンプレイグラウンド
- JWT デコーダー
- クレーム解説ツールチップ
- 署名検証機能
- トークンビルダー
- PKCE ジェネレーター

### Step 6: クイズ + 比較ツール + ランディング
- フロー比較表
- クイズデータ作成（5トピック分）
- クイズUI実装
- ランディングページ（学習ロードマップ）

### Step 7: 仕上げ
- 全体の動作確認
- ナビゲーションの整合性チェック
- レスポンシブ対応確認

---

## 検証方法

1. **Mock OIDC プロバイダー**: 各エンドポイントに curl でリクエストを送り、正しいレスポンスが返ることを確認
2. **シミュレーター**: 各フローを最初から最後までステップスルーし、実際の HTTP リクエスト/レスポンスが表示されることを確認
3. **JWT プレイグラウンド**: シミュレーターで発行されたトークンをデコーダーに貼り付け、クレームと署名検証が正しく動くことを確認
4. **クイズ**: 各問題タイプ（択一・並び替え・穴埋め）で正解/不正解の両方をテストし、フィードバックが正しいことを確認
5. **`pnpm build`**: ビルドエラーがないことを確認
6. **`pnpm dev`** で全ページの表示とナビゲーションを確認
