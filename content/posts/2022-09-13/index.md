---
title: "TeX打ちの最高環境を構築したい"
date: 2022-09-13T20:50:09+09:00
categories:
- 日記
tags:
- 日記
keywords:
- 日記
comments:       false
showMeta:       true
showActions:    false
---

※ Windowsの方はTeXstudioを脳筋でインストールしてコンパイラ設定とビルド設定していただけば使えます。また、後日、通常のコンパイル速度の10倍高速にコンパイルできる方法の記事を上げたいと思います。

## 新しくMac/Linuxを用意したのなら

MacTeXをインストールします

[MacTeX - TeX Users Group](https://tug.org/mactex/mactex-download.html)

TeXstudioをIDEとしていつも使用しているのですが、残念ながら最新版のv4.3.1はなぜか、<mark>Google日本語入力での入力ができません</mark>（Mac純正のIMEをご利用の方は気にせず最新版をインストールしてください）。

<img src="/img/genkiwifi_googleime-10.jpg" width="300px">

そこでv3.1.2をインストールすることにしました（このバージョンに特段理由はありません）。こちらからダウンロードできます。

[TeXstudio - A LaTeX Editor - Browse /3.1.2 at SourceForge.net](https://sourceforge.net/projects/texstudio/files/3.1.2/)

最新版はこちらです。

https://www.texstudio.org/

## TeXstudioの設定

### コンパイルシステムの変更

ダウンロードが完了したら、TeXstudio > 環境設定 > コマンド からLaTeXのコンパイルシステムをuplatexに変更します。設定は以下のように変更します。

```bash
uplatex -synctex=1 -interaction=nonstopmode %.tex
```

platex等でもいいですし、Latexでもいいと思いますが、基本的に日本語を入力する場合は、高速にコンパイルでき、unicodeに対応したuplatexをオススメします。

ducumentclassのオプションにuplatexを入れるのを忘れずに！

### ビルドの変更

環境設定の中の「ビルド＆表示」を「DVI->PDFチェーン」にします。

「規定のコンパイラ」が「LaTeX」でない場合は、変更します。

## 組み込みPDFビュアーで日本語を見れるようにする

次に組み込みPDFビュアーで日本語を表示できるようにします。以下のコマンドでpopplerというPDFドキュメントの閲覧エンジンの場所が分かります。

```bash
strings -a /Applications/texstudio.app/Contents/Frameworks/libpoppler.*.dylib | grep poppler
```

このコマンドでどこにあるかが表示されます。それに合わせて、poppler-dataをダウンロードしましょう。私は次のように表示されました。

```
/usr/local/Cellar/poppler/21.05.0/share/poppler
Unknown CID font collection, please report to poppler bugzilla.
%Produced by poppler pdftops version: {0:s} ([http://poppler.freedesktop.org](http://poppler.freedesktop.org/))
```

<mark>一行目をよく覚えておきましょう！</mark>

poppler-dataは、最新版が0.4.11です(2022年9月現在)。なので、poppler-data-0.4.11.tar.gzをダウンロードしましょう。

```bash
curl -kO https://poppler.freedesktop.org/poppler-data-0.4.11.tar.gz
tar xvf poppler-data-0.4.11.tar.gz
```

これで、poppler-dataをダウンロードし、展開することができました。

次に先程覚えてもらった場所に、以下のコマンドでフォルダを作成して、poppler-dataをコピーします。

```bash
sudo mkdir -p /usr/local/Cellar/poppler/21.05.0/share/poppler
sudo cp -pR ~/poppler-data-0.4.11/* /usr/local/Cellar/poppler/21.05.0/share/poppler
```

これが完了したら、ダウンロードフォルダーにあるpoppler-dataは削除していただいて結構です。TeXstudioを開くと日本語がPDFビュアーに表示されると思います。

## スタイルをよくする

ここでは私好みにテーマ等を変更する方法を教えます。

スタイルはOrion Darkにして行の折り返しを以下のように設定します．

![スクリーンショット 2022-09-28 23.11.18.png](/img/texstudio.png)

行の折り返しで「最大文字数」に設定することで，TeXstudioのバグを克服しています．

## バックスラッシュ「\」で自動補完が使えない方へ

私は今回からUSキーボードにしたのでこの問題は解消されました。しかし、大半の方はJISキーボードでしょうから、もしかしたら、バックスラッシュを押しても自動補完がされないかもしれません。

そこで「karabiner-elements」をインストールして「￥」と「＼」を置換します。

ここから最新版をインストールしてください。

https://karabiner-elements.pqrs.org/

### 設定

Preferences の Complex Modifications のタブを開き、 画面下の "Add rule" をおすとダイアログが表示されるので、 ダイアログ上部の "Import more rules from internet (open a web browser)" ボタンを押します。

そうすると、予め準備されたルール一覧のページがブラウザで表示されるので、"Swap ¥ and \ always on JIS Keyboards" というルールを探して、そのルールの "Import" ボタンを押します。

![](/img/68747470733a2f2f71696974612d696d6167652d73746f72652e73332e616d617a6f6e6177732e636f6d2f302f3131313933342f33353432356462312d636231622d333631342d336239322d3031313739666165353233352e706e67.png)

Karabiner-Elements.app を開くかどうかのポップアップが表示されるので、 "Karabiner-Elements.app を開く" ボタンを押します。

ボタンを押すと、Karabiner-Elements 側で import するか聞かれるので、"Import" ボタンを押します。

Importを行うと、もともと例として表示されている3つのルールの下に、 "Swap ¥ and \ always on JIS Keyboards" ルールの2つのサブルールが表示されるので、 "Enable All" ボタンを押して、2つともEnableにしてください。

![](/img/68747470733a2f2f71696974612d696d6167652d73746f72652e73332e616d617a6f6e6177732e636f6d2f302f3131313933342f66303436343235382d366238612d303235362d303837662d3239323935643434386532392e706e67.png)

これで完了です。