# 非エンジニア向け Markdown 記事入稿ガイド

## 1. このガイドでできること

この手順で、ブログ記事を `Markdown（.mdx）` 形式で入稿できます。  
コードを書けなくても、テンプレートに沿ってテキストを入れるだけで公開できます。

実際の表示サンプル: `/blog/blog-rich-content-sample`

## 2. 先に覚えること（3つだけ）

1. 記事ファイルは `content/blog/` に置く  
2. ファイル名は URL になる（`slug`）  
3. 先頭の「frontmatter（--- で囲まれた設定）」は必須

## 3. 入稿の全体フロー

1. テンプレート `content/blog/_template.mdx` をコピー  
2. ファイル名を `YYYY-MM-DD-記事スラッグ.mdx` に変更  
3. 先頭の設定項目（title/date/category など）を埋める  
4. 本文を書く  
5. 画像を `public/blog/images/` に置く（使う場合）  
6. 変更を保存して公開（GitHubに反映）

## 4. ファイル名ルール

- 形式: `YYYY-MM-DD-英小文字ハイフン.mdx`
- 例: `2026-02-20-tarot-card-meaning-beginners.mdx`
- NG例:
  - 日本語ファイル名
  - 大文字
  - アンダースコア `_`

## 5. frontmatter 設定ルール

記事の先頭に、次のような設定を書きます。

```yaml
---
title: "大アルカナ22枚の意味一覧｜初心者向け"
description: "タロット大アルカナ22枚の意味を初心者向けにわかりやすく解説。"
date: "2026-02-20"
updated: "2026-02-20"
category: "tarot"
tags: ["タロット", "大アルカナ", "初心者"]
image: "/blog/images/major-arcana-guide.webp"
slug: "tarot-card-meaning-beginners"
---
```

### 必須項目

- `title`
- `description`
- `date`
- `updated`
- `category`
- `slug`

### category の選択肢

- `tarot`
- `kaiun`
- `koyomi`
- `moon`
- `guide`

## 6. 本文の書き方（最低限）

```md
## 見出し2
本文を書きます。

### 見出し3
- 箇条書き1
- 箇条書き2

[アプリページへ](https://example.com/)
```

## 7. 画像を使う場合

1. 画像ファイルを `public/blog/images/` に置く  
2. 本文では次のように書く

```md
![画像の説明](/blog/images/sample.webp)
```

## 8. 動画を使う場合（YouTube / Vimeo）

本文に次のように書くと、記事内に動画プレイヤーとして表示されます。

````md
```video
https://www.youtube.com/watch?v=M7lc1UVf-VE
```
````

ポイント:

- `video` のコードブロック名は必須
- URLは1行で入力
- YouTubeかVimeoのURLを使う

## 9. アンカーテキストリンクの入れ方

```md
[吉日の記事を見る](/blog/lucky-day-calendar-basics)
[Google公式ヘルプ](https://support.google.com/analytics/answer/1008080?hl=ja)
```

- `[]` の中が「表示される文字」
- `()` の中が「遷移先URL」
- 外部URL（`https://...`）は別タブで開きます
## 10. 公開手順（GitHub Webだけで完結する方法）

1. GitHubで `content/blog/` を開く  
2. `Add file` -> `Create new file`  
3. ファイル名を入力（例: `2026-02-20-tarot-card-meaning-beginners.mdx`）  
4. テンプレート内容を貼って編集  
5. 画面下の `Commit changes...` を押す  
6. 数分後に自動デプロイで公開

## 11. よくあるミス

- `slug` が他記事と重複している
- `date` の形式が `YYYY-MM-DD` ではない
- `category` が選択肢外
- `image` のパス先に画像がない
- 動画URLを `video` ブロック以外で書いている
- frontmatter の `---` を消してしまう

## 12. 公開前チェックリスト

- [ ] タイトルが60文字以内目安
- [ ] 説明文が155文字以内目安
- [ ] `slug` が英小文字ハイフン
- [ ] 見出しが `h2 -> h3` の順で書けている
- [ ] 目次リンク（H2/H3）が記事内でジャンプする
- [ ] 内部リンク（ブログ/サービスページ）を1つ以上入れた
- [ ] 誤字脱字を確認した

## 13. 困ったとき

- 記事が表示されない: frontmatter の書式ミスを確認
- URLがおかしい: `slug` とファイル名を確認
- 画像が出ない: `public/blog/images/` とパスを確認
- 動画が出ない: `video` コードブロックか・URL形式かを確認
