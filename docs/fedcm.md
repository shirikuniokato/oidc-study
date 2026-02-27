# FedCM (Federated Credential Management API) 勉強会資料

> **対象**: ゲームプラットフォーム側チームメンバー（FedCM 導入済みサービス）
> **前提知識**: Web 開発の基礎知識があれば OK。Cookie や認証の深い知識は不要
> **最終更新**: 2026-02-28

---

## 目次

1. [はじめに — なぜこの勉強会が必要なのか](#1-はじめに--なぜこの勉強会が必要なのか)
2. [Cookie の基礎知識](#2-cookie-の基礎知識)
3. [3rd Party Cookie 廃止の経緯](#3-3rd-party-cookie-廃止の経緯)
4. [3rd Party Cookie がなくなると何が壊れるのか](#4-3rd-party-cookie-がなくなると何が壊れるのか)
5. [FedCM とは何か](#5-fedcm-とは何か)
6. [FedCM のフロー詳細](#6-fedcm-のフロー詳細)
7. [FedCM の主要機能](#7-fedcm-の主要機能)
8. [FedCM と OAuth 2.0 / OIDC の関係](#8-fedcm-と-oauth-20--oidc-の関係)
9. [ブラウザサポート状況](#9-ブラウザサポート状況)
10. [ハンズオン — 実サービスでの動作確認](#10-ハンズオン--実サービスでの動作確認)
11. [参考資料](#11-参考資料)

---

## 1. はじめに — なぜこの勉強会が必要なのか

**一言でいうと**: ブラウザが 3rd Party Cookie を廃止・制限する流れの中で、従来の「Cookie に依存したフェデレーション認証（SSO やソーシャルログイン）」が壊れ始めている。FedCM はブラウザが仲介役になることでこの問題を解決する新しい Web API。

我々のサービスは FedCM を導入済みだが、「なぜ FedCM が必要なのか」「何を解決しているのか」を正しく理解していないと、今後の仕様変更やトラブルシューティングで手詰まりになる。

---

## 2. Cookie の基礎知識

### 2.1 1st Party Cookie と 3rd Party Cookie

Cookie 自体に「1st Party」「3rd Party」という属性はない。**どのコンテキストで使われるか**によって決まる。

```
ユーザーが shop.example を訪問している場合:

┌─────────────────────────────────────────────────────────┐
│  ブラウザのアドレスバー: https://shop.example            │
│                                                         │
│  shop.example が設定した Cookie                          │
│  → アドレスバーと同じドメイン → 1st Party Cookie         │
│                                                         │
│  ┌─────────────────────────────────────────────┐        │
│  │  <iframe src="https://tracker.example">     │        │
│  │  tracker.example が設定した Cookie           │        │
│  │  → アドレスバーと違うドメイン                 │        │
│  │  → 3rd Party Cookie                         │        │
│  └─────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────┘
```

**同じ Cookie でもコンテキストが変われば呼び方が変わる。** `tracker.example` を直接訪問すれば、そのサイトの Cookie は 1st Party になる。

### 2.2 SameSite 属性

Cookie の `SameSite` 属性はクロスサイトでの送信を制御する。

| 値 | 動作 | 用途 |
|---|---|---|
| **`Strict`** | 同一サイトからのリクエストでのみ送信。外部リンクからの遷移でも送られない | CSRF 保護が最優先の場面 |
| **`Lax`** (デフォルト) | 同一サイト + クロスサイトの GET トップレベルナビゲーション時に送信 | 一般的なセッション Cookie |
| **`None`** | すべてのコンテキストで送信。**`Secure` 属性（HTTPS）が必須** | 3rd Party Cookie として使いたい場合 |

```http
Set-Cookie: session=abc123; SameSite=Lax; Secure; HttpOnly
Set-Cookie: tracking=xyz; SameSite=None; Secure
```

### 2.3 Partitioned Cookie (CHIPS)

`SameSite=None` の Cookie にさらに `Partitioned` 属性を付けると、**トップレベルサイトごとに分離**される。

```http
Set-Cookie: __Host-widget=abc; SameSite=None; Secure; Partitioned
```

```
widget.example の Cookie が Partitioned の場合:

shop.example に埋め込み   → Cookie jar: (shop.example, widget.example)
news.example に埋め込み   → Cookie jar: (news.example, widget.example)
                           ↑ 別々の Cookie jar。相互に見えない
```

これにより、正当なクロスサイト用途（決済ウィジェットなど）を維持しつつ、サイト横断トラッキングを防げる。

### 2.4 iframe・リダイレクトと Cookie の関係

| シナリオ | Cookie の扱い |
|---|---|
| **iframe 内の Cookie** | 3rd Party 扱い。`SameSite=None; Secure` が必要。Safari はブロック、Firefox はパーティション化 |
| **トップレベルリダイレクト** | リダイレクト先では 1st Party 扱い。ただし中間ドメインを経由する「バウンストラッキング」は Firefox Strict モードでブロック対象 |
| **fetch / XHR** | クロスオリジンの `credentials: "include"` は `SameSite=None; Secure` が必要 |

---

## 3. 3rd Party Cookie 廃止の経緯

### 3.1 なぜ廃止されるのか

3rd Party Cookie の最大の問題は**クロスサイトトラッキング**。

```
ユーザーが Site A を訪問
  → tracker.example の広告が読み込まれる
  → tracker.example が Cookie を設定: user_id=12345

ユーザーが Site B を訪問
  → tracker.example の広告が読み込まれる
  → 同じ Cookie (user_id=12345) が送信される
  → tracker.example は「Site A と Site B を訪問した同一人物」と特定

ユーザーが Site C を訪問...（以下同様）
```

ユーザーが明示的に同意していないのに、Web 上の行動が横断的に追跡される。ブラウザベンダーはこれをプライバシーの根本的な問題と判断し、対策に動いた。

### 3.2 各ブラウザの対応タイムライン

#### Safari — ITP (Intelligent Tracking Prevention)

**最も積極的。2020 年 3 月に全面ブロック済み。**

| 時期 | バージョン | 内容 |
|---|---|---|
| 2017年 9月 | ITP 1.0 | 3rd Party Cookie の寿命を 24 時間に制限 |
| 2018年 6月 | ITP 2.0 | 24 時間制限を撤廃し、原則ブロック。Storage Access API 導入 |
| 2019年 2月 | ITP 2.1 | `document.cookie` で設定した 1st Party Cookie も 7 日で失効 |
| **2020年 3月** | **Safari 13.1** | **3rd Party Cookie を完全ブロック**（業界初） |
| 2020年 11月 | Safari 14 | CNAME クローキングによる回避も対策 |

#### Firefox — ETP (Enhanced Tracking Protection)

**パーティション化（分離）アプローチを採用。**

| 時期 | 内容 |
|---|---|
| 2019年 6月 | ETP Standard モードをデフォルト有効化。既知トラッカーをブロック |
| 2021年 2月 | Total Cookie Protection 導入（Strict モード） |
| **2022年 6月** | **Total Cookie Protection を全ユーザーにデフォルト有効化** |

Firefox は Cookie を完全にブロックするのではなく、**トップレベルサイトごとに Cookie jar を分離**する。`tracker.example` の Cookie は Site A と Site B で別物になり、サイト横断のトラッキングができなくなる。

#### Chrome — Privacy Sandbox

**紆余曲折の末、廃止を断念。**

| 時期 | 内容 |
|---|---|
| 2019年 8月 | Privacy Sandbox 構想を発表 |
| 2020年 1月 | 「2022 年までに 3rd Party Cookie を廃止」と宣言 |
| 2022年 7月 | 廃止を 2024 年後半に延期 |
| 2023年 12月 | 全ユーザーの 1%（約 3000 万人）で試験的にブロック |
| **2024年 7月** | **方針転換: 3rd Party Cookie の廃止を撤回。ユーザー選択制を提案** |
| 2025年 4月 | ユーザー選択プロンプト案も撤回。既存設定で管理する方針に |
| **2025年 10月** | **Privacy Sandbox を公式に終了。残存 10 技術を廃止** |

#### 現在の状況（2026 年初頭）

| ブラウザ | 3rd Party Cookie の扱い | シェア目安 |
|---|---|---|
| **Safari** | **完全ブロック**（2020年〜） | ~18% |
| **Firefox** | **パーティション化**（デフォルト）、Strict モードで完全ブロック | ~3% |
| **Chrome** | 有効（ユーザーが設定で無効化可能） | ~65% |
| **Edge** | 有効（Chrome に追従） | ~5% |
| **Brave** | 完全ブロック | ~1% |

**重要**: Chrome では 3rd Party Cookie が生きているが、Safari + Firefox の合計で **約 20% のユーザーはすでにブロック済み**。iOS では全ブラウザが WebKit ベースのため、iOS ユーザー全員が 3rd Party Cookie をブロックされている。

---

## 4. 3rd Party Cookie がなくなると何が壊れるのか

フェデレーション認証（SSO・ソーシャルログイン）で使われてきた手法の多くが 3rd Party Cookie に依存している。

### 4.1 サイレントトークンリニューアルが壊れる

SPA がアクセストークンを更新する一般的な方法:

```
RP (shop.example)                          IdP (accounts.idp.example)
      |                                           |
      |  [hidden iframe]                          |
      |  GET /authorize?prompt=none  ────────────>|
      |                                           |  IdP のセッション Cookie を
      |                                           |  読み取ってトークン発行
      |                        <──────────────────|
      |  新しいトークンを受け取る                    |
```

**3rd Party Cookie がブロックされると**: iframe 内の IdP は自身のセッション Cookie にアクセスできない → `prompt=none` は「ログインが必要」エラーを返す → トークン更新に失敗 → ユーザーは毎回フルページリダイレクトで再認証が必要。

### 4.2 iframe ベースの SSO が壊れる

```
RP のページに IdP の iframe を埋め込んで
ログイン状態チェック or "Welcome, Alice" 表示

→ iframe 内の IdP は自身の Cookie が読めない
→ 常に「未ログイン」状態に見える
```

### 4.3 フロントチャネルログアウトが壊れる

OIDC フロントチャネルログアウトは、IdP が各 RP の iframe を読み込んでセッション Cookie をクリアする仕組み。3rd Party Cookie がブロックされると、各 RP の iframe は自身の Cookie にアクセスできず、ログアウトが実行されない。

### 4.4 ソーシャルログインウィジェットが壊れる

「Google でログイン」「Facebook でログイン」などのボタンが、ログイン済みユーザーの名前やアイコンを表示する機能。IdP の iframe/スクリプトが Cookie を読めなくなるため、パーソナライズ表示が不可能に。

---

## 5. FedCM とは何か

### 5.1 概要

**FedCM (Federated Credential Management API)** は、ブラウザが仲介役となってフェデレーション認証を行う Web API。W3C で標準化が進められている。

**従来の方式（Cookie 依存）:**
```
RP  ←──── Cookie / iframe / リダイレクト ────→  IdP
    （ブラウザはただの通信路。内容を理解していない）
```

**FedCM:**
```
RP  ←───→  ブラウザ（仲介）  ←───→  IdP
           │
           │ ブラウザが:
           │ ・IdP のアカウント情報を取得
           │ ・ネイティブ UI で同意画面を表示
           │ ・ユーザーの明示的な同意後にのみ RP にトークンを渡す
```

### 5.2 FedCM が解決すること

| 課題 | FedCM による解決 |
|---|---|
| 3rd Party Cookie なしでトークン更新できない | ブラウザが内部的に IdP に credentialed リクエストを送るため、3rd Party Cookie 制限の影響を受けない |
| iframe ベースの SSO が壊れる | ブラウザネイティブの UI でアカウント選択。iframe 不要 |
| IdP がユーザーの訪問先を追跡できる | accounts エンドポイントには `client_id` や `Origin` が送られないため、IdP はどの RP が問い合わせているか知らない |
| ユーザーの同意なしに認証情報が共有される | ブラウザの UI で明示的に同意した後にのみ RP の情報が IdP に伝わる |

### 5.3 FedCM のプライバシーモデル

FedCM の設計思想は「**ユーザーが明示的に同意するまで、IdP は RP の存在を知らない**」。

```
Step 1: ブラウザが IdP に「今ログインしているアカウント一覧をくれ」と聞く
        → この時点で IdP は「どの RP から聞かれているか」を知らない
        → client_id も Origin も送られない

Step 2: ブラウザがユーザーにネイティブ UI を表示
        「idp.example のアカウント Alice で shop.example にログインしますか?」

Step 3: ユーザーが「はい」を押した後、初めて
        → client_id と Origin 付きで IdP にトークン発行を依頼
        → IdP は「このユーザーが shop.example にログインした」と知る
```

---

## 6. FedCM のフロー詳細

### 6.1 全体フロー図

```
RP (shop.example)              ブラウザ                    IdP (accounts.idp.example)
      |                           |                              |
      | 1. navigator.credentials  |                              |
      |    .get({ identity })     |                              |
      |─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─>|                              |
      |                           |                              |
      |                           | 2. GET /.well-known/         |
      |                           |    web-identity              |
      |                           |  (認証情報なし)               |
      |                           |────────────────────────────>|
      |                           |<────────────────────────────|
      |                           |  { provider_urls: [...] }    |
      |                           |                              |
      |                           | 3. GET /config.json          |
      |                           |  (認証情報なし)               |
      |                           |────────────────────────────>|
      |                           |<────────────────────────────|
      |                           |  { accounts_endpoint,        |
      |                           |    id_assertion_endpoint,    |
      |                           |    ... }                     |
      |                           |                              |
      |                           | 4. Login Status 確認          |
      |                           |                              |
      |                           | 5. GET /accounts             |
      |                           |  (Cookie あり, Origin なし)   |
      |                           |────────────────────────────>|
      |                           |<────────────────────────────|
      |                           |  { accounts: [Alice, Bob] }  |
      |                           |                              |
      |                           | 6. GET /client-metadata      |
      |                           |  (Cookie なし, Origin あり)   |
      |                           |────────────────────────────>|
      |                           |<────────────────────────────|
      |                           |  { privacy_policy_url, ... } |
      |                           |                              |
      |                    ┌──────┴──────┐                       |
      |                    │ 7. ネイティブ │                       |
      |                    │    同意 UI   │                       |
      |                    │             │                       |
      |                    │ [Alice]     │                       |
      |                    │ でログイン?  │                       |
      |                    │             │                       |
      |                    │ [許可][拒否] │                       |
      |                    └──────┬──────┘                       |
      |                           |                              |
      |                           | 8. POST /assertion           |
      |                           |  (Cookie あり, Origin あり,   |
      |                           |   client_id あり)            |
      |                           |────────────────────────────>|
      |                           |<────────────────────────────|
      |                           |  { token: "eyJ..." }        |
      |                           |                              |
      | 9. credential.token       |                              |
      |<─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─|                              |
      |                           |                              |
      | 10. トークンをバックエンドで |                              |
      |     検証・ログイン処理      |                              |
```

### 6.2 各エンドポイントの詳細

| # | エンドポイント | メソッド | Cookie | Origin | 目的 |
|---|---|---|---|---|---|
| 2 | `/.well-known/web-identity` | GET | なし | なし | 有効な configURL の一覧 |
| 3 | Config file | GET | なし | なし | IdP のメタデータとエンドポイント URL |
| 5 | `accounts_endpoint` | GET | **あり** | **なし** | ユーザーのアカウント一覧（RP を知らせない） |
| 6 | `client_metadata_endpoint` | GET | なし | **あり** | RP のプライバシーポリシー等の URL |
| 8 | `id_assertion_endpoint` | POST | **あり** | **あり** | 同意後にトークン発行 |

**セキュリティ上の重要ポイント**: credentialed なエンドポイント（5, 8）は `Sec-Fetch-Dest: webidentity` ヘッダーの検証が必須。これにより、通常のブラウザリクエストからの不正アクセスを防ぐ。

### 6.3 RP 側のコード例

```javascript
// Feature detection
if (!("IdentityCredential" in window)) {
  // FedCM 非対応ブラウザ → 従来のリダイレクトフローにフォールバック
  return fallbackToRedirectFlow();
}

try {
  const credential = await navigator.credentials.get({
    identity: {
      context: "signin",        // UI に表示される文脈（signin / signup / use）
      mode: "active",           // active: ボタンクリック時 / passive: ページロード時
      providers: [{
        configURL: "https://accounts.idp.example/fedcm-config.json",
        clientId: "my-client-id",
        fields: ["name", "email", "picture"],  // 要求するフィールド
        params: {
          nonce: crypto.randomUUID(),
          scope: "openid profile"
        }
      }]
    },
    mediation: "optional"       // optional / silent / required
  });

  // credential.token を RP のバックエンドに送って検証
  await fetch("/api/auth/fedcm-callback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token: credential.token,
      isAutoSelected: credential.isAutoSelected,
    }),
  });
} catch (error) {
  // ユーザーがキャンセル or IdP にログインしていない
  console.error("FedCM sign-in failed:", error);
}
```

### 6.4 IdP 側の実装概要

**well-known ファイル** (`https://idp.example/.well-known/web-identity`):
```json
{
  "provider_urls": ["https://accounts.idp.example/fedcm-config.json"]
}
```

**Config ファイル**:
```json
{
  "accounts_endpoint": "/api/fedcm/accounts",
  "id_assertion_endpoint": "/api/fedcm/assertion",
  "client_metadata_endpoint": "/api/fedcm/client-metadata",
  "disconnect_endpoint": "/api/fedcm/disconnect",
  "login_url": "/login",
  "branding": {
    "background_color": "#4285f4",
    "color": "#ffffff",
    "icons": [{ "url": "https://idp.example/logo.png", "size": 32 }]
  }
}
```

**accounts エンドポイント** (Cookie あり、Origin なし):
```json
{
  "accounts": [
    {
      "id": "user-12345",
      "name": "Alice",
      "email": "alice@example.com",
      "picture": "https://idp.example/photos/alice.jpg",
      "approved_clients": ["my-client-id"],
      "login_hints": ["alice@example.com"],
      "domain_hints": ["example.com"]
    }
  ]
}
```

**id_assertion エンドポイント** (Cookie あり、Origin あり):
```
POST /api/fedcm/assertion
Origin: https://shop.example
Cookie: session=abc123
Sec-Fetch-Dest: webidentity
Content-Type: application/x-www-form-urlencoded

account_id=user-12345&client_id=my-client-id&disclosure_text_shown=true&is_auto_selected=false
```

レスポンス:
```json
{
  "token": "eyJhbGciOiJSUzI1NiIs..."
}
```

---

## 7. FedCM の主要機能

### 7.1 Login Status API

IdP がブラウザに「ユーザーがログイン中かどうか」を伝える仕組み。

**設定方法** — HTTP ヘッダー:
```http
Set-Login: logged-in
Set-Login: logged-out
```

**設定方法** — JavaScript（IdP オリジンから）:
```javascript
navigator.login.setStatus("logged-in");
navigator.login.setStatus("logged-out");
```

**3 つの状態**:
| 状態 | ブラウザの動作 |
|---|---|
| `logged-in` | accounts エンドポイントに問い合わせる |
| `logged-out` | passive モード: 問い合わせずに即座に拒否 / active モード: ログイン画面を表示 |
| `unknown` (初期値) | accounts エンドポイントに問い合わせて判断 |

### 7.2 Auto-Reauthentication（自動再認証）

以下の条件をすべて満たすと、UI を表示せずに自動的に再認証する:

1. ユーザーが以前この RP で FedCM を使ってログインした
2. 全 IdP を通じて returning account が 1 つだけ
3. ユーザーが IdP にログイン中
4. 前回の自動再認証から 10 分以上経過
5. `preventSilentAccess()` が呼ばれていない

```javascript
// 自動再認証のみ試行（UI は表示しない）
const credential = await navigator.credentials.get({
  identity: { providers: [{ ... }] },
  mediation: "silent"
});

// サインアウト時に自動再認証を防止
navigator.credentials.preventSilentAccess();
```

### 7.3 Active モード (ボタンモード) vs Passive モード (ウィジェットモード)

| | Active モード | Passive モード |
|---|---|---|
| **トリガー** | ユーザーのクリックなどのアクションが必要 | ページロード時でも発動可能 |
| **UI** | 画面中央の大きなダイアログ | 画面右上の小さなダイアログ |
| **複数 IdP** | 1 つのみ | 複数 OK |
| **自動再認証** | なし | あり |
| **ログアウト時** | IdP のログイン画面を表示可能 | UI を表示しない |
| **用途** | 「〇〇でログイン」ボタン | ページ表示時の自動ログイン |

```javascript
// Active モード — ボタンクリック時に呼ぶ
document.getElementById("login-btn").addEventListener("click", async () => {
  const credential = await navigator.credentials.get({
    identity: { mode: "active", providers: [{ ... }] }
  });
});

// Passive モード — ページロード時
const credential = await navigator.credentials.get({
  identity: { mode: "passive", providers: [{ ... }] }
});
```

### 7.4 Multiple IdP サポート

Chrome 128 以降、1 つの `get()` 呼び出しで複数の IdP を指定可能:

```javascript
const credential = await navigator.credentials.get({
  identity: {
    providers: [
      { configURL: "https://google.example/config.json", clientId: "abc" },
      { configURL: "https://facebook.example/config.json", clientId: "def" }
    ]
  }
});

// どの IdP が使われたかは configURL で判別
console.log(credential.configURL);
```

> **注意**: 複数 IdP は passive モードでのみサポート。

### 7.5 Error Handling API

IdP がエラーを構造的に返せる（Chrome 120+）:

```json
{
  "error": {
    "code": "access_denied",
    "url": "https://idp.example/error?type=access_denied"
  }
}
```

RP 側のハンドリング:
```javascript
try {
  const credential = await navigator.credentials.get({ identity: { ... } });
} catch (e) {
  // e.error: "access_denied" など
  // e.url: エラー詳細ページの URL
}
```

### 7.6 Fields API / Parameters API

**Fields API** (Chrome 132+) — 必要な属性を明示:
```javascript
fields: ["name", "email", "picture"]
```
ブラウザの同意画面が「名前、メール、プロフィール画像を共有します」と動的に表示される。

**Parameters API** (Chrome 132+) — 任意のパラメータを assertion エンドポイントに渡す:
```javascript
params: {
  nonce: "random-nonce",
  scope: "openid profile calendar.readonly"
}
```

### 7.7 Disconnect API

RP からのアカウント連携解除（Chrome 122+）:

```javascript
await IdentityCredential.disconnect({
  configURL: "https://idp.example/fedcm-config.json",
  clientId: "my-client-id",
  accountHint: "user-12345"
});
```

### 7.8 Continuation API

多段階フロー。assertion エンドポイントがトークンの代わりに URL を返し、ブラウザがポップアップを開く:

```json
{
  "continue_on": "https://idp.example/authorize?scope=calendar"
}
```

IdP はポップアップ内で追加の同意取得やMFA等を行い、完了後に `IdentityProvider.close()` を呼ぶ。

---

## 8. FedCM と OAuth 2.0 / OIDC の関係

FedCM は **OAuth 2.0 / OIDC の代替ではない**。ブラウザが仲介する**トランスポート層**であり、既存の認証・認可プロトコルと組み合わせて使う。

### 推奨される統合パターン（OAuth Profile for FedCM）

```
RP                          ブラウザ（FedCM）              IdP
 |                              |                          |
 | FedCM params に               |                          |
 | code_challenge を含める       |                          |
 |─────────────────────────────>|                          |
 |                              |  [FedCM フロー実行]       |
 |                              |────────────────────────>|
 |                              |                          |
 |                              |  token = 認可コード       |
 |                              |<────────────────────────|
 |                              |                          |
 | credential.token             |                          |
 | = 認可コード                  |                          |
 |<─────────────────────────────|                          |
 |                                                         |
 | [標準の OAuth トークン交換]                               |
 | POST /token                                             |
 |   grant_type=authorization_code                         |
 |   code=<認可コード>                                      |
 |   code_verifier=<PKCE検証値>                             |
 |────────────────────────────────────────────────────────>|
 |                                                         |
 | access_token, refresh_token, id_token                   |
 |<────────────────────────────────────────────────────────|
```

**ポイント**:
- FedCM はユーザーの同意取得と認可コードの受け渡しを担当
- 実際のトークンライフサイクル（access_token / refresh_token / id_token）は標準の OAuth 2.0 / OIDC フローで処理
- PKCE を使うことでセキュリティを確保

---

## 9. ブラウザサポート状況

### 2026 年初頭時点

| ブラウザ | FedCM サポート | 備考 |
|---|---|---|
| **Chrome** | 対応 (108+, 2022年11月〜) | 最も進んでいる。継続的に機能追加中 |
| **Edge** | 対応 | Chromium ベースのため Chrome に追従 |
| **Samsung Internet** | ほぼ対応 (v26+) | Chromium ベース |
| **Opera** | ほぼ対応 (v108+) | Chromium ベース |
| **Firefox** | **未対応** | W3C WG に参加しているが、2025年8月時点で実装を一時停止 |
| **Safari** | **未対応** | WebKit メーリングリストでコンセプトへの支持を表明しているが実装なし |

### 現実的な影響

- **Chromium 系ブラウザ**: デスクトップトラフィックの約 70% をカバー → FedCM が動作
- **Safari**: 特に iOS では全ブラウザが WebKit ベースのため、FedCM は **iOS 全体で使えない**
- **Firefox**: デスクトップシェアは小さいが、プライバシー重視ユーザー層

**現時点の推奨**: FedCM をサポートしつつ、非対応ブラウザ向けに従来のリダイレクトフロー（+ Storage Access API 等）をフォールバックとして維持する。

---

## 10. ハンズオン — 実サービスでの動作確認

### 10.1 前提条件

> **NOTE**: サービス固有の情報（URL、クライアント ID 等）は別途追記予定

- Chrome (108 以降) を使用すること
- サービスの開発/ステージング環境へのアクセス権限

### 10.2 Chrome DevTools での FedCM デバッグ

#### FedCM のリクエスト・レスポンスを確認する

1. Chrome DevTools を開く (`F12` or `Cmd+Option+I`)
2. **Network** タブを開く
3. フィルタに `webidentity` と入力（`Sec-Fetch-Dest: webidentity` のリクエストのみ表示）
4. ログインフローを実行し、以下のリクエストが順に飛ぶことを確認:
   - `/.well-known/web-identity`
   - Config file の URL
   - `accounts_endpoint`
   - `client_metadata_endpoint`
   - `id_assertion_endpoint`

#### Login Status の確認

1. **Application** タブ → 左メニューの **Storage** セクション
2. (Chrome 131+) **FedCM** セクションで IdP ごとのログイン状態を確認可能

#### FedCM ダイアログの自動キャンセルを防ぐ

開発中、DevTools が前面にあると FedCM ダイアログが自動で閉じることがある。以下で回避:

```javascript
// Console で実行
// FedCM の cooldown をリセット
await navigator.credentials.preventSilentAccess();
```

### 10.3 3rd Party Cookie ブロックの影響を確認する

#### Chrome で 3rd Party Cookie を手動ブロック

1. `chrome://settings/cookies` にアクセス
2. 「サードパーティの Cookie をブロックする」を有効化
3. サービスにアクセスし、FedCM **なし** の従来フローが壊れることを確認
4. FedCM フローが 3rd Party Cookie ブロック下でも動作することを確認

#### Safari でテスト

1. Safari で同じサービスにアクセス（3rd Party Cookie はデフォルトでブロック）
2. FedCM は Safari 非対応のため、フォールバックフローが発動することを確認

### 10.4 確認ポイントチェックリスト

#### 基本フローの確認

- [ ] FedCM 対応ブラウザでネイティブの同意 UI が表示される
- [ ] アカウント選択後にログインが完了する
- [ ] IdP にログインしていない状態で active モードのログイン画面が表示される

#### エッジケースの確認

- [ ] FedCM 非対応ブラウザ (Safari) でフォールバックが動作する
- [ ] 3rd Party Cookie ブロック状態で FedCM が正常に動作する
- [ ] ユーザーが FedCM ダイアログをキャンセルした場合のハンドリング
- [ ] IdP セッション切れ時の挙動

#### Auto-Reauthentication の確認

- [ ] 初回ログイン後、同じサイトを再訪問して自動再認証が発動するか
- [ ] サインアウト後に自動再認証が抑制されるか

### 10.5 サービス固有の設定

> **TODO**: 以下をサービスの実情に合わせて記入

```
サービス URL:       [TODO]
IdP Config URL:    [TODO]
Client ID:         [TODO]
テスト用アカウント:  [TODO]
ステージング環境:    [TODO]
フォールバック方式:  [TODO: リダイレクト / Storage Access API / etc.]
```

### 10.6 トラブルシューティング

| 症状 | 原因の可能性 | 確認方法 |
|---|---|---|
| FedCM ダイアログが表示されない | ブラウザ非対応 / IdP 未ログイン / Login Status が `logged-out` | `"IdentityCredential" in window` を Console で確認。Network タブで accounts リクエストの有無を確認 |
| accounts リクエストが 401 | IdP のセッション Cookie が送られていない | Cookie の `SameSite` / `Secure` 設定を確認 |
| assertion リクエストがエラー | `Sec-Fetch-Dest` ヘッダーの検証失敗 / `client_id` 不一致 | リクエストヘッダーとサーバーログを確認 |
| 自動再認証が発動しない | 条件未達（10分ルール、`preventSilentAccess` 等） | ブラウザの FedCM 状態をリセットして再試行 |
| `NetworkError` が発生 | IdP にログインしていない / well-known ファイルが見つからない | IdP の well-known URL に直接アクセスして確認 |

---

## 11. 参考資料

### 公式仕様・ドキュメント

- [W3C FedCM Specification](https://www.w3.org/TR/fedcm/)
- [MDN: Federated Credential Management API](https://developer.mozilla.org/en-US/docs/Web/API/FedCM_API)
- [Chrome for Developers: FedCM Overview](https://developer.chrome.com/docs/identity/fedcm/overview)
- [Chrome for Developers: RP Implementation](https://developer.chrome.com/docs/identity/fedcm/implement/relying-party)
- [Chrome for Developers: IdP Implementation](https://developer.chrome.com/docs/identity/fedcm/implement/identity-provider)

### Cookie / プライバシー関連

- [MDN: Third-party cookies](https://developer.mozilla.org/en-US/docs/Web/Privacy/Guides/Third-party_cookies)
- [web.dev: SameSite cookies explained](https://web.dev/articles/samesite-cookies-explained)
- [Privacy Sandbox: CHIPS](https://privacysandbox.google.com/cookies/chips)
- [WebKit: Full Third-Party Cookie Blocking](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/)
- [Mozilla: Total Cookie Protection](https://blog.mozilla.org/en/mozilla/firefox-rolls-out-total-cookie-protection-by-default-to-all-users-worldwide/)

### FedCM アップデート情報

- [FedCM Chrome 132 Updates (Active Mode, Fields API, Parameters API)](https://privacysandbox.google.com/blog/fedcm-chrome-132-updates)
- [FedCM Chrome 128 Updates (Multiple IdP)](https://privacysandbox.google.com/blog/fedcm-chrome-128-updates)
- [FedCM Chrome 122 Updates (Disconnect API)](https://privacysandbox.google.com/blog/fedcm-chrome-122-updates)
- [FedCM Chrome 120 Updates (Login Status, Error API)](https://developers.google.com/privacy-sandbox/blog/fedcm-chrome-120-updates)

### OAuth + FedCM 統合

- [OAuth Profile for FedCM (Draft)](https://github.com/aaronpk/oauth-fedcm-profile)
