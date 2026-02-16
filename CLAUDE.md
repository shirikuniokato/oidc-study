# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Dev server (Turbopack)
pnpm build        # Production build
pnpm check        # Biome lint check (no fix)
pnpm lint         # Biome lint + auto-fix
pnpm format       # Biome format
pnpm test         # Vitest
```

## Stack

Next.js 15 (App Router), React 19, TypeScript (strict), Tailwind CSS v4, Biome (tab indent), jose (JWT), pnpm

## Architecture

OIDC/OAuth 2.0 のインタラクティブ学習サイト。Mock OIDC プロバイダーを内蔵し、フロー定義データを Single Source of Truth として解説ページとシミュレーターの両方を駆動する。

### Flow-Definition-Driven Design

`src/lib/flows/types.ts` の `FlowDefinition` が中核の型。各フロー（認可コード、PKCE、インプリシット等）は `FlowDefinition` として定義され、以下の2箇所で消費される：

1. **解説ページ** (`/flows/[id]`) — `FlowPageLayout` コンポーネントが `FlowDefinition` を受け取り、シーケンス図・ステップ詳細・セキュリティ考慮事項を自動描画
2. **シミュレーター** (`/simulator/[flow]`) — `useFlowSimulator` フックが `FlowDefinition` のステップに沿って Mock OIDC API に実際の HTTP リクエストを送信

新しいフローを追加するには：`src/lib/flows/` に定義ファイルを作成 → `index.ts` の `ALL_FLOWS` に追加 → `/flows/` にページ作成。シミュレーターは自動対応。

### Mock OIDC Provider

`src/lib/oidc/` に認可サーバーの教育用実装。Route Handler (`src/app/api/mock-oidc/`) で7エンドポイントを提供。jose で RS256 署名した実際の JWT を発行する。テストユーザー: Alice / Bob、テストクライアント: `demo-client` / `demo-secret`。全レスポンスに `_debug` フィールドで検証過程を付与。

### Layout Patterns

- **`ContentLayout`** — 汎用ページレイアウト。`section` prop でセクション識別、`title`/`description` はオプショナル
- **`FlowPageLayout`** — `FlowDefinition` を受け取り、シーケンス図・ステップ詳細・使用ガイド・セキュリティ考慮事項を自動描画。children でフロー固有コンテンツを追加可能

### Quiz System

`src/lib/quiz/` に5トピック分の問題データ。`MultipleChoiceQuestion | OrderingQuestion` の判別共用体型。`/quiz/[topic]` でトピック別にレンダリング。

## Key Conventions

- UI は日本語
- ダークテーマ: CSS変数（oklch）で `globals.css` に定義
- UIコンポーネント (`src/components/ui/`) は shadcn/ui スタイル（cva + cn）
- 全型に `readonly` を使用、イミュータブルなデータ構造
- `"use client"` はインタラクティブなページ・コンポーネントのみ
- OIDC ストア（認可コード、セッション、デバイスコード）はインメモリ Map
