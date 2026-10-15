---
title: "後輩のためのLinux知識"
description: "Linuxの仕組みから、ファイル操作・パイプ・ユーザー・パーミッション・プロセス・パッケージ管理・ネットワーク・SSH・シェルスクリプトまで、図を交えて順番に学べる初心者向けガイドです。"
date: 2023-07-27
lang: ja
tags:
  - linux
  - 初心者
  - シェル
---

## はじめに

この記事は、Linuxをほとんど触ったことがない後輩のために書いた入門ガイドです。研究室のサーバーに初めてログインする人が、自分で調べながら作業できるようになることを目標にしています。

コマンドの暗記を目指してはいません。「Linuxの中で何が起きているのか」を先に理解して、コマンドはその道具として覚えます。そのため、仕組みの説明を図で補い、コマンドのオプションは本当によく使うものだけに絞りました。細かいオプションは `man` コマンド(後述)で調べれば十分です。

### 前提と読み方

- 環境はUbuntu(22.04 / 24.04)を想定しています。DebianやMacのターミナルでもほぼ同じです。
- 前から順に読むと、前の章の知識が次の章で使われる構成になっています。すでに知っている章は飛ばして構いません。
- コードブロックの `$` は「入力待ちの印(プロンプト)」です。`$` は入力せず、その右側だけを打ちます。
- `[ ]` で囲んだ部分は「自分の値に置き換える場所」です。`[ファイル名]` なら、実際のファイル名を入れます。
- 練習用のユーザーとホスト名は、`alice` と `server` で統一しています。

### 目次

1. [Linuxとは何か](#1-linuxとは何か)
2. [ターミナルとシェルの基本](#2-ターミナルとシェルの基本)
3. [ファイルシステムの考え方](#3-ファイルシステムの考え方)
4. [移動と一覧](#4-移動と一覧)
5. [ファイルとディレクトリの操作](#5-ファイルとディレクトリの操作)
6. [中身を見る・探す](#6-中身を見る探す)
7. [入出力とパイプ](#7-入出力とパイプ)
8. [エディタ](#8-エディタ)
9. [ユーザーとグループ](#9-ユーザーとグループ)
10. [パーミッション](#10-パーミッション)
11. [プロセスと環境変数](#11-プロセスと環境変数)
12. [パッケージ管理](#12-パッケージ管理)
13. [サービスとログ](#13-サービスとログ)
14. [ネットワークの基礎](#14-ネットワークの基礎)
15. [SSHでリモート接続](#15-sshでリモート接続)
16. [シェルスクリプト入門](#16-シェルスクリプト入門)
17. [まとめとコマンド早見表](#17-まとめとコマンド早見表)

---

## 1. Linuxとは何か

この章では、Linuxの全体像をつかみます。

### Linuxを作った人

<div style="display:flex;flex-wrap:wrap;gap:1.5rem;align-items:flex-end;margin:1rem 0">
<figure style="margin:0">
<img src="/blog/linux-for-juniors-ja/linus-torvalds.jpg" alt="リーナス・トーバルズの顔写真" width="200" style="margin:0">
<figcaption style="font-size:0.75rem;line-height:1.5;color:var(--muted);margin-top:0.3rem">リーナス・トーバルズ<br>Photo: Krd / Von Sprat, <a href="https://commons.wikimedia.org/wiki/File:LinuxCon_Europe_Linus_Torvalds_03_(cropped).jpg" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a></figcaption>
</figure>
<figure style="margin:0">
<img src="/blog/linux-for-juniors-ja/tux.svg" alt="Linuxのマスコットキャラクター、ペンギンのTux" width="160" style="margin:0">
<figcaption style="font-size:0.75rem;line-height:1.5;color:var(--muted);margin-top:0.3rem">Linuxのマスコット「Tux(タックス)」<br>Original: Larry Ewing, The GIMP</figcaption>
</figure>
</div>

Linuxは、**リーナス・トーバルズ(Linus Torvalds)** が作りました。1969年にフィンランドで生まれた彼は、1991年、大学生だった21歳のときに、趣味でOSのカーネルを作り始めました。

当時、パソコンで動くUnix系のOSは高価で、学生には手が届きませんでした。そこで、自分のパソコンで動く自由なOSを作り、ソースコードをインターネットに公開しました。すると、世界中の開発者が改良に参加し、今では、スマートフォン(Android)やスーパーコンピュータ、Webサーバーの大半を支える存在になっています。

リーナスは、今もLinuxカーネルの開発を取りまとめています。ソースコードを管理するツールの **Git** も、彼がLinuxの開発のために作ったものです。

名前の「Linux」は、Linus と Unix を合わせたものです。

なお、Linuxのマスコットは、ペンギンの **Tux(タックス)** です。リーナスがペンギン好きだったことから採用され、1996年のロゴコンテストで、Larry Ewing さんの作品が選ばれました。

### OSとカーネル

パソコンやサーバーのハードウェア(CPU・メモリ・ディスク・ネットワークカード)は、そのままでは複雑すぎて、アプリが直接扱えません。そこで間に入って面倒を見るのが **OS(オペレーティングシステム)** で、その中心部分を **カーネル** と呼びます。

Linuxとは、正確にはこのカーネルの名前です。

<figure class="diagram">
<svg class="dg" viewBox="130 0 460 236" style="max-width:460px;min-width:0" role="img" aria-labelledby="dg1t">
<title id="dg1t">Linuxの層構造。ユーザー、アプリとシェル、カーネル、ハードウェアの順に重なっている。</title>
<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="head" d="M0 0L10 5L0 10z"/></marker></defs>
<rect class="box" x="140" y="8" width="440" height="40" rx="2"/>
<text class="mid bold" x="360" y="33">あなた(ユーザー)</text>
<rect class="box" x="140" y="68" width="440" height="40" rx="2"/>
<text class="mid bold" x="360" y="86">アプリ・シェル</text>
<text class="mid mut" x="360" y="102" font-size="12">bash / vim / ssh / python など</text>
<rect class="acc" x="140" y="128" width="440" height="40" rx="2"/>
<text class="mid bold link" x="360" y="146">カーネル(Linux本体)</text>
<text class="mid mut" x="360" y="162" font-size="12">プロセス・メモリ・ファイル・ネットワークの管理</text>
<rect class="box" x="140" y="188" width="440" height="40" rx="2"/>
<text class="mid bold" x="360" y="206">ハードウェア</text>
<text class="mid mut" x="360" y="222" font-size="12">CPU / メモリ / ディスク / ネットワークカード</text>
<path class="ln" d="M360 48V68" marker-end="url(#ah)"/>
<path class="ln" d="M360 108V128" marker-end="url(#ah)"/>
<path class="ln" d="M360 168V188" marker-end="url(#ah)"/>
<text class="mut" x="372" y="122" font-size="12">システムコール(お願い)</text>
</svg>
<figcaption>図1 アプリはカーネルにお願いしてハードウェアを使う。ユーザーはアプリやシェルを通じてカーネルに指示を出す。</figcaption>
</figure>

たとえばアプリがファイルを保存したいとき、ディスクを直接操作するのではなく、カーネルに「このデータを保存して」とお願いします。このお願いを **システムコール** と呼びます。

### ディストリビューション

カーネルだけでは使えません。コマンド群、パッケージ管理の仕組み、設定の初期値などをまとめて配布しているものを **ディストリビューション(ディストロ)** と呼びます。

| 系統 | 代表例 | 特徴 |
|------|--------|------|
| Debian系 | <img class="logo" src="/blog/linux-for-juniors-ja/logos/ubuntu.svg" alt="" width="18" height="18"> <a href="https://ubuntu.com/" target="_blank" rel="noopener noreferrer">Ubuntu</a><br><img class="logo" src="/blog/linux-for-juniors-ja/logos/debian.svg" alt="" width="18" height="18"> <a href="https://www.debian.org/" target="_blank" rel="noopener noreferrer">Debian</a> | 利用者が多く情報も多い。この記事の想定環境 |
| Red Hat系 | <img class="logo" src="/blog/linux-for-juniors-ja/logos/redhat.svg" alt="" width="18" height="18"> <a href="https://www.redhat.com/ja/technologies/linux-platforms/enterprise-linux" target="_blank" rel="noopener noreferrer">RHEL</a><br><img class="logo" src="/blog/linux-for-juniors-ja/logos/rockylinux.svg" alt="" width="18" height="18"> <a href="https://rockylinux.org/" target="_blank" rel="noopener noreferrer">Rocky Linux</a><br><img class="logo" src="/blog/linux-for-juniors-ja/logos/fedora.svg" alt="" width="18" height="18"> <a href="https://fedoraproject.org/" target="_blank" rel="noopener noreferrer">Fedora</a> | 企業・スーパーコンピュータでよく使われる |
| その他 | <img class="logo" src="/blog/linux-for-juniors-ja/logos/archlinux.svg" alt="" width="18" height="18"> <a href="https://archlinux.org/" target="_blank" rel="noopener noreferrer">Arch Linux</a><br><img class="logo" src="/blog/linux-for-juniors-ja/logos/alpinelinux.svg" alt="" width="18" height="18"> <a href="https://alpinelinux.org/" target="_blank" rel="noopener noreferrer">Alpine</a> | 用途に特化したもの |

ディストロが違っても、コマンドの大半は共通です。違いが出やすいのは、ソフトの入れ方(12章)くらいです。

### ターミナル・シェル・コマンド

Linuxサーバーは画面(GUI)を持たず、文字だけで操作することが多いです。そのときに出てくる言葉を整理しておきます。

- **ターミナル**: 文字を入力して結果を表示する「窓」です。

  <figure class="diagram">
  <img src="/blog/linux-for-juniors-ja/terminal.png" alt="Ubuntuのターミナルの画面例。alice@server:~$ の後ろにコマンドを入力し、次の行に結果が表示されている。" width="560">
  <figcaption>ターミナルの例(Ubuntu風)。プロンプトの右にコマンドを打つと、次の行に結果が出る。</figcaption>
  </figure>

- **シェル**: 入力された文字を解釈して、カーネルやプログラムに橋渡しするプログラムです。`bash` や `zsh` が有名です。
- **コマンド**: シェルに渡す1行の指示です。`ls` や `cd` などがあたります。

「ターミナルという窓の中で、シェルというプログラムが動いていて、そこにコマンドを打っている」と覚えてください。

---

## 2. ターミナルとシェルの基本

この章では、コマンドの書き方と、迷ったときの調べ方を学びます。

### プロンプトの読み方

ターミナルを開くと、次のような表示が出ます。

```bash
alice@server:~$
```

左から順に、次の意味です。

| 表示 | 意味 |
|------|------|
| `alice` | 今ログインしているユーザー名 |
| `server` | このマシンの名前(ホスト名) |
| `~` | 今いる場所。`~` は自分のホームディレクトリを表す |
| `$` | 一般ユーザーであることを表す。rootのときは `#` になる |

### コマンドの書き方

ほとんどのコマンドは、同じ形をしています。

<figure class="diagram">
<svg class="dg" viewBox="0 0 720 140" role="img" aria-labelledby="dg2t">
<title id="dg2t">コマンドの構文。ls -l /var/log を、コマンド、オプション、引数の3つに分解している。</title>
<rect class="box" x="40" y="14" width="130" height="44" rx="2"/>
<text class="mid mono" x="105" y="43" font-size="20">ls</text>
<rect class="box" x="230" y="14" width="130" height="44" rx="2"/>
<text class="mid mono" x="295" y="43" font-size="20">-l</text>
<rect class="box" x="420" y="14" width="230" height="44" rx="2"/>
<text class="mid mono" x="535" y="43" font-size="20">/var/log</text>
<text class="mid mut" x="200" y="42" font-size="12">␣</text>
<text class="mid mut" x="390" y="42" font-size="12">␣</text>
<text class="mid bold" x="105" y="88">コマンド</text>
<text class="mid mut" x="105" y="108" font-size="12">何をするか</text>
<text class="mid bold" x="295" y="88">オプション</text>
<text class="mid mut" x="295" y="108" font-size="12">やり方を変える</text>
<text class="mid bold" x="535" y="88">引数</text>
<text class="mid mut" x="535" y="108" font-size="12">何に対して行うか</text>
</svg>
<figcaption>図2 コマンドの基本形。区切りには半角スペース(␣)を使う。</figcaption>
</figure>

- **コマンド**: 実行するプログラムの名前です。
- **オプション**: 動作を変える指定です。`-l` のようにハイフン1つ+1文字か、`--help` のようにハイフン2つ+単語で書きます。`-l -a` を `-la` とまとめて書くこともできます。
- **引数**: 操作の対象です。ファイルやディレクトリの名前を入れます。

大事な注意が2つあります。

- 区切りは **半角スペース** です。全角スペースだと、1つの長い単語と見なされてエラーになります。
- **大文字と小文字は区別されます。** `Memo.txt` と `memo.txt` は別のファイルです。

### 入力を楽にするキー操作

打ち間違いを減らし、手数を減らすために、次のキーは最初に覚えてください。

| キー | 動作 |
|------|------|
| `Tab` | ファイル名やコマンド名を補完する。2回押すと候補を一覧表示 |
| `↑` / `↓` | 過去に打ったコマンドを呼び出す |
| `Ctrl + R` | 過去のコマンドを文字で検索する |
| `Ctrl + C` | 実行中のコマンドを中断する |
| `Ctrl + L` | 画面をきれいにする(`clear` と同じ) |
| `Ctrl + D` | 入力を終了する。シェルなら、ログアウトする |
| `Ctrl + A` / `Ctrl + E` | 行の先頭 / 末尾へ移動する |

特に `Tab` 補完は、ファイル名をすべて手打ちしなくて済むうえ、打ち間違いも防げます。「長い名前は打たずに `Tab`」を習慣にしてください。

### 困ったときの調べ方

コマンドの使い方は、そのコマンド自身に聞くことができます。

```term
$ ls --help        # 短い説明を表示する
$ man ls           # マニュアルを表示する(q で終了、/ で検索)
```

オプションを丸暗記する必要はありません。「こういうことがしたい」という目的を覚えておいて、細かい指定は `man` で調べます。

---

## 3. ファイルシステムの考え方

この章では、Linuxがファイルをどう整理しているかを学びます。以降のすべての章の土台になります。

### すべての起点は「/」

Linuxのファイルは、**1本の木(ツリー)** で管理されます。木の根を **ルートディレクトリ** と呼び、`/` で表します。WindowsのようなC:やD:といったドライブの区別はありません。USBメモリやHDDも、この木のどこかに「接続(マウント)」して使います。

<figure class="diagram">
<svg class="dg" viewBox="0 0 720 280" role="img" aria-labelledby="dg3t">
<title id="dg3t">Linuxのディレクトリツリー。ルートの下に home、etc、var、usr、tmp があり、/home/alice/Documents へ至る道筋が強調されている。</title>
<path class="ln" d="M360 40V56M100 56H620M100 56V70M230 56V70M360 56V70M490 56V70M620 56V70"/>
<path class="ln" d="M230 114V150M360 114V150M100 114V150M100 184V197H170V210"/>
<path class="ln-acc" d="M360 40V56H100V70M100 114V150M100 184V197H60V210"/>
<rect class="acc" x="330" y="10" width="60" height="30" rx="2"/>
<text class="mid mono bold link" x="360" y="30">/</text>
<rect class="acc" x="55" y="70" width="90" height="44" rx="2"/>
<text class="mid mono bold link" x="100" y="89">home</text>
<text class="mid mut" x="100" y="106" font-size="11">ユーザーの家</text>
<rect class="box" x="185" y="70" width="90" height="44" rx="2"/>
<text class="mid mono bold" x="230" y="89">etc</text>
<text class="mid mut" x="230" y="106" font-size="11">設定ファイル</text>
<rect class="box" x="315" y="70" width="90" height="44" rx="2"/>
<text class="mid mono bold" x="360" y="89">var</text>
<text class="mid mut" x="360" y="106" font-size="11">ログなど</text>
<rect class="box" x="445" y="70" width="90" height="44" rx="2"/>
<text class="mid mono bold" x="490" y="89">usr</text>
<text class="mid mut" x="490" y="106" font-size="11">プログラム本体</text>
<rect class="box" x="575" y="70" width="90" height="44" rx="2"/>
<text class="mid mono bold" x="620" y="89">tmp</text>
<text class="mid mut" x="620" y="106" font-size="11">一時ファイル</text>
<rect class="acc" x="55" y="150" width="90" height="34" rx="2"/>
<text class="mid mono bold link" x="100" y="172">alice</text>
<rect class="box" x="185" y="150" width="90" height="34" rx="2"/>
<text class="mid mono" x="230" y="172">passwd</text>
<rect class="box" x="315" y="150" width="90" height="34" rx="2"/>
<text class="mid mono" x="360" y="172">log</text>
<rect class="acc" x="10" y="210" width="100" height="34" rx="2"/>
<text class="mid mono bold link" x="60" y="232">Documents</text>
<rect class="box" x="130" y="210" width="80" height="34" rx="2"/>
<text class="mid mono" x="170" y="232">.ssh</text>
<text class="link bold" x="250" y="228">絶対パス: /home/alice/Documents</text>
<text class="mut" x="250" y="248" font-size="12">alice の中にいるなら、相対パスは Documents だけでよい</text>
</svg>
<figcaption>図3 ディレクトリツリーの一部。強調した線は、ルートから Documents まで順にたどる道筋を表す。</figcaption>
</figure>

> **Windowsとの違い**: Windowsでは、ディスクごとに `C:` や `D:` と文字を振ります。これは、フロッピーディスクの時代(A:とB:が使われ、ハードディスクがC:になった)の名残りです。古いソフトを動かし続けるために、今も残っています。Linuxは最初から「木は1本」で設計されているので、ディスクを増やしても、パスの書き方は変わりません。

### 主なディレクトリの役割

最初から全部覚える必要はありません。「設定は `/etc`、ログは `/var/log`、自分のファイルは `/home` の下」の3つだけ押さえれば十分です。

| ディレクトリ | 役割 |
|--------------|------|
| `/home` | 一般ユーザーの作業場所。`/home/alice` が alice の「ホームディレクトリ」 |
| `/root` | 管理者(root)のホームディレクトリ |
| `/etc` | システムやソフトの設定ファイルを置く |
| `/var` | ログなど、使うたびに増えたり変わったりするデータを置く |
| `/usr` | インストールしたプログラムやライブラリの本体を置く |
| `/bin` `/sbin` | 基本的なコマンド。最近は `/usr/bin` へのリンクになっていることが多い |
| `/tmp` | 一時ファイル置き場。再起動で消えることがある |
| `/dev` | ディスクやキーボードなどの機器を表す特別なファイル |
| `/proc` | 実行中のプロセスやシステムの状態を見るための仮想的なファイル |

### Everything is a file: すべてはファイル

Linuxには、「**Everything is a file(あらゆるものをファイルとして扱う)**」という設計思想があります。ふつうのファイルだけでなく、ディレクトリ、キーボードやディスクなどの機器、実行中のプロセスの情報までも、ファイルと同じ「開く・読む・書く」という操作で扱えるようにしたものです。

操作が1種類に統一されているので、新しい道具を覚えなくても、これまで学んだ `cat` や `ls` がそのまま使えます。

| 対象 | ファイルとしての見え方 | 例 |
|------|------------------------|----|
| 通常のデータ | 文書、画像、プログラムなど | `/home/alice/memo.txt` |
| ディレクトリ | 「ファイルの一覧を持つファイル」 | `/home/alice` |
| 機器(デバイス) | `/dev` の下の特別なファイル | `/dev/sda`(ディスク)、`/dev/null`(何でも捨てる穴) |
| プロセスやカーネルの状態 | `/proc` や `/sys` の下の仮想的なファイル | `/proc/cpuinfo`(CPUの情報)、`/proc/meminfo`(メモリの情報) |

#### なぜこの設計が嬉しいのか

プログラムが「ファイルを読む」操作さえ作れば、相手がファイルでも、キーボードでも、機器でも動きます。データの出入り口の形が揃っているので、道具を組み合わせやすくなるのです。

たとえば `cat` は、ファイルを表示するコマンドですが、機器でも同じように読めます。

```term
$ cat /proc/cpuinfo | head -n 5    # CPUの情報を、ファイルのように読む
$ cat /proc/meminfo | head -n 3    # メモリの状態も同じ
$ echo "いらない出力" > /dev/null    # 書き込んだ内容は消える(第7章)
```

第7章のリダイレクト(`>`)やパイプ(`|`)が自然に使えるのも、入出力がすべて「ファイル」として揃っているからです。

#### 種類は ls -l の1文字目で分かる

第10章で読む `ls -l` の1文字目は、「ファイルの種類」を表します。機器も、ふつうのファイルと並んで見えます。

```term
$ ls -l /dev/null /dev/tty /etc/passwd
crw-rw-rw- 1 root root 1, 3 Oct  9 20:45 /dev/null
crw-rw-rw- 1 root root 5, 0 Oct  9 20:45 /dev/tty
-rw-r--r-- 1 root root 2.1K Sep 20 09:00 /etc/passwd
```

| 1文字目 | 種類 | 例 |
|---------|------|----|
| `-` | 普通のファイル | `/etc/passwd` |
| `d` | ディレクトリ | `/home` |
| `l` | シンボリックリンク | `/dev/stdin` |
| `c` | キャラクタデバイス(1文字ずつ流れる機器) | `/dev/null`、`/dev/tty` |
| `b` | ブロックデバイス(ディスクのように、まとまった単位で読み書きする機器) | `/dev/sda` |

#### /dev: 機器のファイル

`/dev` の下には、便利な特別ファイルがいくつもあります。

| ファイル | 読んだとき | 書いたとき |
|----------|------------|------------|
| `/dev/null` | 何も出てこない(すぐ終わる) | 何を書いても消える |
| `/dev/zero` | `0` のバイトが延々と出てくる | 何を書いても消える |
| `/dev/urandom` | ランダムなバイトが延々と出てくる | (使わない) |
| `/dev/tty` | キーボードの入力 | 今の端末の画面に表示される |

使い道の例です。

```term
$ head -c 16 /dev/urandom | base64          # ランダムな文字列を作る
$ dd if=/dev/zero of=test.img bs=1M count=10    # 10MBの空ファイルを作る
$ echo "hello" > /dev/tty                   # パイプの途中でも、必ず画面に出す
```

`/dev/sda` のような**ディスクのファイル**は、中身がディスクの生のデータそのものです。誤って書き込むと、ファイルシステムが壊れて復旧できなくなります。`sudo` で触れる場合も、むやみに書き込まないでください。

#### /proc と /sys: システムの状態をのぞく窓

`/proc` の中身は、ディスクに保存されたデータではありません。読もうとした瞬間にカーネルが現在の状態を作って返します。「ファイルの形をした窓口」だと考えると分かりやすいです。

```term
$ cat /proc/uptime            # 起動してからの秒数
$ cat /proc/loadavg           # 負荷の平均
$ ls /proc | head             # 数字のディレクトリがたくさんある
```

`/proc` の下にある**数字のディレクトリ**は、プロセスのID(PID)に対応しています。`/proc/1234` を開くと、PIDが1234のプロセスの情報が見えます。

```term
$ echo $$                          # 今のシェル自身のPID(例: 1234)
1234
$ cat /proc/$$/cmdline             # このプロセスを起動したときのコマンド
$ ls -l /proc/$$/cwd               # このプロセスが今いるディレクトリ
$ ls -l /proc/$$/fd                # このプロセスが開いているファイル一覧
```

`ps`(第11章)のようなコマンドは、まさにこの `/proc` を読んで表示しています。特別なシステムコールではなく、**ファイルを読んでいるだけ**です。

`/sys` も同じ仕組みで、機器やドライバの情報をファイルとして見せます。たとえばノートPCなら、`/sys/class/power_supply/BAT0/capacity` を読むと、バッテリー残量が分かります(環境により異なります)。

#### 標準入出力もファイル

第7章で学んだ「3本の通り道」も、実はファイルとして見えます。

```term
$ ls -l /dev/stdin /dev/stdout /dev/stderr
lrwxrwxrwx 1 root root 15 Oct 15 03:13 /dev/stderr -> /proc/self/fd/2
lrwxrwxrwx 1 root root 15 Oct 15 03:13 /dev/stdin -> /proc/self/fd/0
lrwxrwxrwx 1 root root 15 Oct 15 03:13 /dev/stdout -> /proc/self/fd/1
```

`/proc/self` は「自分自身のプロセス」を指す特別な名前です。`fd/0`、`fd/1`、`fd/2` が、標準入力・標準出力・標準エラー出力に対応します。ファイル名を引数に取るコマンドに、`/dev/stdout` を渡せば、画面に出力できます。

```term
$ cp memo.txt /dev/stdout       # コピー先が画面になる(cat と同じ結果)
```

#### 例外と限界

「すべてがファイル」は、**できるだけそう見えるよう揃えてある**という方針です。たとえば、ネットワーク通信(ソケット)の多くは、`/dev` の下に名前を持ちません。また、機器のファイルは、`cat` で読めても意味のあるデータにならないものがあります。「ファイルのように open / read / write できる」ことと、「中身が人間に読める」ことは別の話です。

> **覚えておくこと**: 迷ったら、まず `ls -l` で種類を見て、次に `cat` で読んでみます。読んで危ないのは、ディスクのようなブロックデバイスへの**書き込み**です。

### 場所の書き方: 絶対パスと相対パス

ファイルの場所を文字で表したものを **パス** と呼びます。書き方は2種類あります。

| 種類 | 見分け方 | 例 | 意味 |
|------|----------|----|------|
| 絶対パス | `/` で始まる | `/home/alice/Documents` | ルートからの道筋。どこで実行しても同じ場所を指す |
| 相対パス | `/` 以外で始まる | `Documents` | 今いる場所からの道筋。実行する場所で意味が変わる |

住所にたとえると、絶対パスは「東京都〇〇区…」の完全な住所、相対パスは「この家から見て2軒隣」という言い方です。

相対パスには、便利な特殊記号があります。

| 記号 | 意味 |
|------|------|
| `.` | 今いるディレクトリ |
| `..` | 1つ上(親)のディレクトリ |
| `~` | 自分のホームディレクトリ(例: `/home/alice`) |
| `-` | 直前にいたディレクトリ(`cd -` で使う) |

たとえば `/home/alice` にいるときの `../bob` は、1つ上の `/home` に戻ってから `bob` に入るので、`/home/bob` を指します。

### 隠しファイル

名前が `.` で始まるファイルは、`ls` で普通は表示されません。設定ファイルは、`.bashrc` や `.ssh` のように、この形式で置かれることが多いです。見たいときは `ls -a` を使います(次章)。

---

## 4. 移動と一覧

この章では、ディレクトリの間を動き回り、中身を確認する方法を学びます。

### pwd: 今いる場所を確認する

「Print Working Directory」の略です。迷子になったらまずこれです。

```term
$ pwd
/home/alice
```

今いるディレクトリを **カレントディレクトリ** と呼びます。

### cd: ディレクトリを移動する

「Change Directory」の略です。移動先をパスで指定します。

```term
$ cd /var/log        # 絶対パスで移動
$ cd ..              # 1つ上へ
$ cd Documents       # 相対パスで移動(今いる場所の下の Documents へ)
$ cd ~               # ホームへ戻る(引数なしの cd でも同じ)
$ cd -               # 直前にいた場所へ戻る
```

### ls: 中身を一覧する

「list」の略です。何も付けなければ、カレントディレクトリの中身を表示します。

```term
$ ls
Documents  Downloads  memo.txt
```

よく使うオプションは次の3つです。

| オプション | 効果 |
|------------|------|
| `-l` | 詳細表示(権限・所有者・サイズ・更新日時)。10章で詳しく読み解く |
| `-a` | `.` で始まる隠しファイルも表示する |
| `-h` | サイズを `4.0K` `2.3M` のように読みやすくする(`-l` と併用) |

```term
$ ls -lah
total 20K
drwxr-x--- 4 alice alice 4.0K Oct  1 10:12 .
drwxr-xr-x 5 root  root  4.0K Sep 20 09:00 ..
-rw------- 1 alice alice  220 Sep 20 09:00 .bash_history
drwxr-xr-x 2 alice alice 4.0K Oct  1 10:12 Documents
-rw-r--r-- 1 alice alice   42 Oct  1 10:10 memo.txt
```

オプションはまとめて書けるので、`ls -l -a -h` は `ls -lah` と同じです。ディレクトリ(`d` で始まる行)の見分け方は、10章で説明します。

### tree: 階層を一目で見る

ディレクトリの構造を木の形で表示します。標準では入っていないことがあり、その場合は12章の方法で導入してください(`sudo apt install tree`)。

```term
$ tree -L 2 ~
/home/alice
├── Documents
│   └── report.txt
├── Downloads
└── memo.txt
```

`-L 2` は「2階層まで」という指定です。深い場所で何も付けずに実行すると、大量に表示されるので注意してください。

---

## 5. ファイルとディレクトリの操作

この章では、ファイルを作る・コピーする・動かす・消すという基本操作を学びます。

### touch: 空のファイルを作る

```term
$ touch memo.txt
```

すでにあるファイルに実行すると、中身は変えずに更新日時だけが現在の時刻になります。

### mkdir: ディレクトリを作る

```term
$ mkdir project
$ mkdir -p project/data/raw     # 途中のディレクトリもまとめて作る
```

`-p` を付けないと、途中の `project/data` が存在しない場合にエラーになります。

### cp: コピーする

「copy」の略です。**コピー元 → コピー先** の順に書きます。

```term
$ cp memo.txt memo_backup.txt        # ファイルをコピー
$ cp memo.txt Documents/             # ディレクトリの中へコピー
$ cp -r project project_backup       # ディレクトリは -r(中身ごと)が必要
```

### mv: 移動する・名前を変える

「move」の略です。Linuxには「名前変更」専用のコマンドはなく、同じ場所の中で `mv` することが名前変更にあたります。

```term
$ mv memo.txt Documents/             # 移動
$ mv memo.txt note.txt               # 名前の変更
```

行き先に同名のファイルがあると、確認なしで上書きされます。心配なときは `-i`(上書き前に確認)を付けます。

### rm: 削除する

「remove」の略です。

```term
$ rm memo.txt                # ファイルを削除
$ rm -r project              # ディレクトリを中身ごと削除
$ rm -i memo.txt             # 消す前に確認する
```

> **警告**: `rm` で消したものは、ごみ箱に入りません。**基本的に元へは戻せません。** 特に `rm -rf` は、確認なしで中身ごと消します。`rm -rf /` やスペースの打ち間違い(`rm -rf / home/alice/tmp` のように、`/` の後ろにスペースが入る)は、システム全体を壊します。Enterを押す前に、必ずもう一度、引数を読み返してください。

### find: 条件でファイルを探す

ファイル名や種類などの条件で、ディレクトリの下を探します。

```term
$ find . -name "*.txt"             # 今の場所から、拡張子が .txt のものを探す
$ find /var/log -type d            # ディレクトリだけを探す(f ならファイル)
```

### ワイルドカードと特殊文字

シェルには、「複数のファイルをまとめて指定する」ための記号があります。これを **ワイルドカード** と呼びます。

| 記号 | 意味 | 例 |
|------|------|----|
| `*` | 任意の文字列(0文字以上) | `*.txt` は `.txt` で終わるものすべて |
| `?` | 任意の1文字 | `data?.csv` は `data1.csv` `dataA.csv` に一致 |

この記号の展開は、コマンドではなく **シェルが行います**。`rm *.txt` は、シェルが先に `rm a.txt b.txt c.txt` に書き換えてから、`rm` に渡されます。

ファイル名にスペースや記号が含まれる場合は、`\` を前に置くか、引用符で囲みます。

```term
$ ls my\ file.txt         # スペースの前に \ を付ける
$ ls "my file.txt"        # 引用符で囲む
```

ファイル名にスペースを入れないほうが、あとで困りません。名前は半角英数字と `_` `-` で付けるのがおすすめです。

---

## 6. 中身を見る・探す

この章では、ファイルの内容を確認する方法と、文字列で検索する方法を学びます。

### cat: 全体を表示する

```term
$ cat memo.txt
今日の実験メモ
温度は20度
```

短いファイルならこれで十分です。長いファイルだと、画面を流れていって読めません。

### head / tail: 先頭と末尾だけを見る

```term
$ head -n 5 data.csv        # 先頭の5行
$ tail -n 5 data.csv        # 末尾の5行
```

`tail -f` は、ファイルの更新を見張り続けます。ログの確認でよく使います。`Ctrl + C` で止まります。

```term
$ tail -f /var/log/syslog
```

### less: ページをめくって読む

長いファイルは、`less` で読みます。

```term
$ less data.csv
```

| キー | 動作 |
|------|------|
| `Space` / `b` | 1画面進む / 戻る |
| `↑` `↓` | 1行ずつ移動 |
| `/文字列` | 検索する(次の候補は `n`) |
| `q` | 終了 |

`man` で開くマニュアルも、実は `less` で表示されています。同じキーが使えます。

### wc: 数える

行数・単語数・バイト数を数えます。行数だけなら `-l` です。

```term
$ wc -l data.csv
1024 data.csv
```

### grep: 文字列で探す

ファイルの中から、指定した文字列を含む **行** だけを取り出します。

```term
$ grep "error" app.log              # error を含む行を表示
$ grep -n "error" app.log           # 行番号も付ける
$ grep -i "error" app.log           # 大文字・小文字を区別しない
$ grep -r "TODO" ./src              # ディレクトリの下をまとめて探す
```

`grep` は、次の章のパイプと組み合わせると真価を発揮します。

---

## 7. 入出力とパイプ

この章では、コマンド同士をつなぎ合わせる仕組みを学びます。Linuxらしさが最も出る部分で、使いこなせると作業効率が大きく変わります。

### 3本のデータの通り道

Linuxのコマンドは、起動すると3本の通り道を持っています。

- **標準入力(stdin, 0番)**: データの入り口。普段はキーボードにつながっています。
- **標準出力(stdout, 1番)**: 結果の出口。普段は画面につながっています。
- **標準エラー出力(stderr, 2番)**: エラーメッセージの出口。普段は画面につながっています。

<figure class="diagram">
<svg class="dg" viewBox="0 0 720 150" role="img" aria-labelledby="dg4t">
<title id="dg4t">コマンドの入出力。キーボードから標準入力を受け取り、標準出力と標準エラー出力を画面へ出す。</title>
<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="head" d="M0 0L10 5L0 10z"/></marker></defs>
<rect class="box" x="20" y="50" width="120" height="50" rx="2"/>
<text class="mid bold" x="80" y="80">キーボード</text>
<rect class="acc" x="270" y="20" width="180" height="110" rx="2"/>
<text class="mid bold link" x="360" y="80">コマンド</text>
<rect class="box" x="580" y="20" width="120" height="110" rx="2"/>
<text class="mid bold" x="640" y="80">画面</text>
<path class="ln" d="M140 75H270" marker-end="url(#ah)"/>
<text class="mid" x="205" y="66">標準入力 (0)</text>
<path class="ln" d="M450 50H580" marker-end="url(#ah)"/>
<text class="mid" x="515" y="42">標準出力 (1)</text>
<path class="ln" d="M450 105H580" marker-end="url(#ah)"/>
<text class="mid" x="515" y="97">標準エラー (2)</text>
</svg>
<figcaption>図4 コマンドの入出力。つなぎ先は後から差し替えられる。</figcaption>
</figure>

この「つなぎ先」を、後から自由に切り替えられるのがポイントです。

### リダイレクト: 出力をファイルへ

`>` を使うと、画面に出るはずだった出力を、ファイルに書き出せます。

| 書き方 | 意味 |
|--------|------|
| `コマンド > file` | 標準出力を file に書き込む(**すでにあれば上書き**) |
| `コマンド >> file` | 標準出力を file の末尾に追記する |
| `コマンド 2> file` | 標準エラー出力を file に書き込む |
| `コマンド < file` | file の内容を標準入力として渡す |

```term
$ ls -l > list.txt              # 一覧をファイルに保存
$ echo "実験開始" >> log.txt     # ログに1行追記
$ find / -name "*.conf" 2> /dev/null   # エラーを捨てて、結果だけ見る
```

`/dev/null` は、書き込んだものがすべて消える特別なファイルです。要らない出力の捨て場として使います。

### パイプ: コマンドをつなぐ

`|`(パイプ)は、左のコマンドの **標準出力** を、右のコマンドの **標準入力** に渡します。

<figure class="diagram">
<svg class="dg" viewBox="0 0 720 176" role="img" aria-labelledby="dg5t">
<title id="dg5t">パイプとリダイレクト。cat app.log の出力を grep error に渡し、その結果を wc -l に渡す。下段は grep の結果を errors.txt に保存する例。</title>
<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="head" d="M0 0L10 5L0 10z"/></marker></defs>
<rect class="box" x="20" y="14" width="170" height="40" rx="2"/>
<text class="mid mono" x="105" y="39">cat app.log</text>
<rect class="box" x="275" y="14" width="170" height="40" rx="2"/>
<text class="mid mono" x="360" y="39">grep error</text>
<rect class="box" x="530" y="14" width="170" height="40" rx="2"/>
<text class="mid mono" x="615" y="39">wc -l</text>
<path class="ln-acc" d="M190 34H275" marker-end="url(#ah)"/>
<path class="ln-acc" d="M445 34H530" marker-end="url(#ah)"/>
<text class="mid mono bold link" x="232" y="26">|</text>
<text class="mid mono bold link" x="487" y="26">|</text>
<text class="mid mut" x="105" y="74" font-size="12">ログ全体を出力</text>
<text class="mid mut" x="360" y="74" font-size="12">error を含む行だけ通す</text>
<text class="mid mut" x="615" y="74" font-size="12">行数を数える</text>
<rect class="box" x="20" y="112" width="250" height="40" rx="2"/>
<text class="mid mono" x="145" y="137">grep error app.log</text>
<path class="ln" d="M270 132H440" marker-end="url(#ah)"/>
<text class="mid mono bold" x="355" y="124">&gt;</text>
<rect class="box" x="440" y="112" width="170" height="40" rx="2"/>
<text class="mid mono" x="525" y="137">errors.txt</text>
<text class="mut" x="625" y="137" font-size="12">ファイルへ保存</text>
</svg>
<figcaption>図5 上段はパイプ(|)でコマンドをつなぐ流れ、下段はリダイレクト(&gt;)でファイルに保存する流れ。</figcaption>
</figure>

この例では、`app.log` の全行から `error` を含む行だけを取り出し、その行数を数えます。

```term
$ cat app.log | grep error | wc -l
12
```

小さな部品を組み合わせて、大きな処理を作るのがLinuxの流儀です。よく使う組み合わせを挙げます。

```term
$ ls -l | less                         # 長い一覧を、ページ送りで読む
$ history | grep ssh                   # 過去に打った ssh のコマンドを探す
$ ps aux | grep python                 # 動いている python を探す
$ cat names.txt | sort | uniq -c       # 並べ替えて、重複を数える
```

`sort` は行を並べ替え、`uniq -c` は連続した同じ行を数えます。

---

## 8. エディタ

この章では、ターミナルの中でファイルを編集する方法を学びます。サーバー上の設定ファイルを直す場面は、必ず来ます。

### まずは nano

操作が分かりやすい `nano` から始めるのがおすすめです。画面の下に、キー操作の一覧が常に表示されます。

```term
$ nano memo.txt
```

`^` は `Ctrl` キーのことです。

| キー | 動作 |
|------|------|
| `Ctrl + O`、Enter | 保存する |
| `Ctrl + X` | 終了する(未保存なら、保存するか聞かれる) |
| `Ctrl + W` | 検索する |

### vi / vim の最低限

`vi`(`vim`)は、ほぼすべてのサーバーに入っています。nano が入っていない環境でも、vi なら必ず使えます。ただし、初めて触ると **「文字が入力できず、終了もできない」** という状態になりがちです。

原因は、vim が **モード** という考え方を持っているからです。

<figure class="diagram">
<svg class="dg" viewBox="0 0 720 168" role="img" aria-labelledby="dg6t">
<title id="dg6t">vimのモード遷移。ノーマルモードからiで挿入モード、コロンでコマンドラインモードに移り、Escまたは実行後にノーマルモードへ戻る。</title>
<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="head" d="M0 0L10 5L0 10z"/></marker></defs>
<rect class="box" x="20" y="40" width="170" height="64" rx="2"/>
<text class="mid bold" x="105" y="66">挿入モード</text>
<text class="mid mut" x="105" y="88" font-size="12">文字を入力できる</text>
<rect class="acc" x="275" y="40" width="170" height="64" rx="2"/>
<text class="mid bold link" x="360" y="66">ノーマルモード</text>
<text class="mid mut" x="360" y="88" font-size="12">起動直後。移動・削除など</text>
<rect class="box" x="530" y="40" width="170" height="64" rx="2"/>
<text class="mid bold" x="615" y="66">コマンドモード</text>
<text class="mid mono" x="615" y="88" font-size="12">:wq  :q!</text>
<path class="ln" d="M275 62H190" marker-end="url(#ah)"/>
<text class="mid mono bold" x="232" y="54">i</text>
<path class="ln" d="M190 84H275" marker-end="url(#ah)"/>
<text class="mid mono bold" x="232" y="102">Esc</text>
<path class="ln" d="M445 62H530" marker-end="url(#ah)"/>
<text class="mid mono bold" x="487" y="54">:</text>
<path class="ln" d="M530 84H445" marker-end="url(#ah)"/>
<text class="mid mono bold" x="487" y="102">Enter</text>
<text class="mid mut" x="360" y="140" font-size="12">迷ったら Esc を2回押せば、ノーマルモードに戻れる</text>
</svg>
<figcaption>図6 vim のモード。文字を打つには挿入モード、保存や終了にはコマンドモードを使う。</figcaption>
</figure>

最低限、次の流れを覚えれば編集できます。

1. `vim memo.txt` で開く(この時点はノーマルモード)。
2. `i` を押す。左下に `-- INSERT --` と出れば、文字を入力できる。
3. 編集が終わったら `Esc` でノーマルモードに戻る。
4. `:wq` と打って Enter。保存して終了する。

| コマンド | 動作 |
|----------|------|
| `:w` | 保存する |
| `:q` | 終了する |
| `:wq` | 保存して終了する |
| `:q!` | 保存せずに強制終了する(**失敗したときの脱出口**) |
| `/文字列` | 検索する(ノーマルモードで入力) |

### おすすめのエディタ: AstroNvim

ここからは、僕のおすすめの話です。vim の仲間に、vim を作り直した **Neovim(`nvim`)** というエディタがあります。僕は、この Neovim を使いやすく設定済みにした **[AstroNvim](https://astronvim.com/)** を使っています。

<figure class="diagram">
<img src="/blog/linux-for-juniors-ja/astronvim.jpg" alt="AstroNvimの画面例。左にファイルの一覧、中央にコード、右にコードの構造が表示され、明るい配色と暗い配色の3種類が重なっている。" width="640">
<figcaption>AstroNvim の画面例。ファイル一覧とコードの構造が、ターミナルの中に並ぶ。(画像: <a href="https://astronvim.com/" target="_blank" rel="noopener noreferrer">AstroNvim 公式サイト</a>)</figcaption>
</figure>

操作の基本は vim と同じなので、ここまでの `i`、`Esc`、`:wq` は、そのまま使えます。そのうえで、色分けやファイル一覧、補完が、入れるだけで使えるようになります。自分で設定ファイルを1から書く必要はありません。

```term
$ git clone --depth 1 https://github.com/AstroNvim/template ~/.config/nvim
$ nvim
```

初回の起動時に、必要なプラグインが自動で入ります。詳しい手順や前提条件は、公式サイトで確認してください。

とはいえ、サーバーで設定ファイルを少し直すだけなら、nano か vim の最低限で十分です。AstroNvim は、**エディタを使い込みたくなってから** 試せば間に合います。

---

## 9. ユーザーとグループ

この章では、Linuxが「誰が何をしてよいか」を管理する、土台の仕組みを学びます。パーミッション(10章)の理解にも必要です。

### ユーザー・グループ・root

- **ユーザー**: Linuxを使う人(またはプログラム)に与えられる名前です。内部では、番号(UID)で管理されます。
- **グループ**: 複数のユーザーをまとめた単位です。「研究室のメンバー」のように、同じ権限を与えたい人をまとめます。
- **root**: UIDが0の、**何でもできる管理者** です。ファイルを消すのも、他人の設定を変えるのも自由です。

普段の作業を一般ユーザーで行い、管理者権限が必要なときだけ `sudo` で一時的に借りる、というのが安全な使い方です。

> **小ネタ：** 初めて `sudo` を使うと、環境によっては、次のメッセージが出ることがあります(macOS では有名です)。
>
> ```
> We trust you have received the usual lecture from the local System Administrator.
> It usually boils down to these three things:
>
>     #1) Respect the privacy of others.
>     #2) Think before you type.
>     #3) With great power comes great responsibility.
> ```
>
> 日本語にすると、「他人のプライバシーを尊重すること」「打つ前に考えること」「大いなる力には、大いなる責任が伴うこと」の3つです。管理者の権限は、何でも壊せる強力なものなので、使う前に一呼吸おくように、という忠告です。
> 最後の言葉は、映画『スパイダーマン』でベンおじさんがピーターに言う、あの名セリフとして有名です。`sudo` の開発者が、これを引用して遊び心を入れたものと思われます。

<figure class="diagram">
<svg class="dg" viewBox="0 0 720 208" role="img" aria-labelledby="dg7t">
<title id="dg7t">ユーザーとグループの関係。aliceはsudoグループとlabグループに所属、bobはlabグループに所属、carolはどちらにも所属しない。sudoグループは管理者コマンドを実行でき、labグループは共有ディレクトリを読み書きできる。</title>
<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="head" d="M0 0L10 5L0 10z"/></marker><marker id="aha" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="head-acc" d="M0 0L10 5L0 10z"/></marker></defs>
<text class="mut" x="20" y="16" font-size="12">ユーザー</text>
<text class="mut" x="290" y="16" font-size="12">グループ</text>
<text class="mut" x="560" y="16" font-size="12">できること</text>
<rect class="box" x="20" y="28" width="130" height="36" rx="2"/>
<text class="mid mono" x="85" y="51">alice</text>
<rect class="box" x="20" y="86" width="130" height="36" rx="2"/>
<text class="mid mono" x="85" y="109">bob</text>
<rect class="box" x="20" y="144" width="130" height="36" rx="2"/>
<text class="mid mono" x="85" y="167">carol</text>
<rect class="box" x="290" y="40" width="130" height="36" rx="2"/>
<text class="mid mono" x="355" y="63">sudo</text>
<rect class="box" x="290" y="116" width="130" height="36" rx="2"/>
<text class="mid mono" x="355" y="139">lab</text>
<path class="ln-acc" d="M150 46L290 58" marker-end="url(#aha)"/>
<path class="ln" d="M150 50L290 128" marker-end="url(#ah)"/>
<path class="ln" d="M150 104L290 140" marker-end="url(#ah)"/>
<path class="ln-acc" d="M420 58H560" marker-end="url(#aha)"/>
<path class="ln" d="M420 134H560" marker-end="url(#ah)"/>
<text x="566" y="54" font-size="12">sudo で管理者の</text>
<text x="566" y="70" font-size="12">コマンドを実行できる</text>
<text x="566" y="130" font-size="12">共有ディレクトリを</text>
<text x="566" y="146" font-size="12">読み書きできる</text>
<text class="mut" x="20" y="200" font-size="11">carol はどのグループにも入っていないので、特別な権限を持たない</text>
</svg>
<figcaption>図7 ユーザーは複数のグループに所属でき、権限はグループ単位で与えられる。</figcaption>
</figure>

### 設定はファイルに書かれている

ユーザーとグループの情報は、ただのテキストファイルです。

| ファイル | 内容 |
|----------|------|
| `/etc/passwd` | ユーザーの一覧(名前・UID・ホームの場所・使うシェルなど) |
| `/etc/shadow` | パスワードの暗号化データ。root しか読めない |
| `/etc/group` | グループの一覧と、メンバーの名前 |

```term
$ whoami                     # 自分のユーザー名
alice
$ id                         # UID・所属グループを確認する
uid=1000(alice) gid=1000(alice) groups=1000(alice),27(sudo),1001(lab)
$ groups                     # 所属グループだけを表示
alice sudo lab
```

### ユーザーの追加と削除

追加と削除には管理者権限が必要なので、先頭に `sudo` を付けます。

```term
$ sudo useradd -m -s /bin/bash bob     # bob を作る(-m: ホームも作成)
$ sudo passwd bob                      # bob のパスワードを設定
$ sudo userdel -r bob                  # bob を削除(-r: ホームごと削除)
```

`-m` を付けないと、ホームディレクトリが作られません。`-s /bin/bash` はログインに使うシェルの指定です。Ubuntuでは、これらを対話形式で聞いてくれる `adduser` コマンドのほうが手軽です。

```term
$ sudo adduser bob
```

<figure class="diagram">
<img src="/blog/linux-for-juniors-ja/adduser.png" alt="sudo adduser bob を実行したときのターミナルの画面。ユーザーとグループとホームディレクトリが作られ、パスワードと名前などの入力を求められる。" width="600">
<figcaption>`adduser` の実行例(イメージ)。ホームディレクトリの作成から、パスワードや名前の入力まで、順番に聞いてくれる。</figcaption>
</figure>

パスワードを2回入力したあと、「Full Name」などの情報は、空のまま Enter で飛ばして構いません。最後の確認は `Y` で進めます。

### パスワードの変更

```term
$ passwd                  # 自分のパスワードを変更
$ sudo passwd bob         # 他人のパスワードは、管理者が変更する
```

パスワード入力中は、画面に何も表示されません。故障ではなく、仕様です。

### su と sudo: 別の権限で実行する

| コマンド | 動作 |
|----------|------|
| `sudo コマンド` | そのコマンドだけ、管理者権限で実行する(**自分のパスワードを入力**) |
| `sudo -i` | 管理者のシェルを開く(終了は `exit`)。rootになる |
| `su - bob` | bob のシェルに切り替える(**bob のパスワードが必要**)。`-` を付けると bob の環境で開く |

`sudo` は、あらかじめ許可されたユーザー(`sudo` グループのメンバー)だけが使えます。作業が終わったら、`exit` で元のユーザーに戻ってください。

### グループの操作

ユーザーをグループに追加するには `gpasswd` か `usermod` を使います。

```term
$ sudo gpasswd -a bob sudo       # bob を sudo グループに追加(sudo 権限を与える)
$ sudo gpasswd -d bob sudo       # bob を sudo グループから外す
$ sudo usermod -aG lab bob       # bob を lab グループに追加(別の方法)
```

> **注意**: グループの変更は、そのユーザーが **ログインし直して初めて反映** されます。追加した直後に権限が効かなくても、慌てないでください。

---

## 10. パーミッション

この章では、ファイルやディレクトリに設定されている「誰が何をしてよいか」の読み方と、変更の仕方を学びます。9章の「ユーザー」「グループ」が前提になります。

### 3種類の権限、3種類の相手

すべてのファイルには、**所有者**(ユーザー)と **所有グループ** が1つずつ決まっています。そのうえで、次の3つの相手ごとに、権限が設定されます。

| 相手 | 記号 | 意味 |
|------|------|------|
| 所有者 | `u`(user) | そのファイルを持っているユーザー |
| グループ | `g`(group) | 所有グループに入っている人 |
| その他 | `o`(other) | それ以外の全員 |

権限は3種類です。ファイルとディレクトリで、意味が少し変わります。

| 記号 | ファイルの場合 | ディレクトリの場合 |
|------|----------------|--------------------|
| `r`(read) | 中身を読める | 中の一覧を見られる(`ls`) |
| `w`(write) | 中身を書き換えられる | 中のファイルを作る・消す・名前を変えられる |
| `x`(execute) | プログラムとして実行できる | 中に入れる(`cd`) |

ディレクトリの `x` が「入れる」権限であるのは、見落としがちな点です。

### ls -l で読む

`ls -l` の出力は、1行がファイル1つに対応しています。

```term
$ ls -l run.sh
-rwxr-xr-- 1 alice lab 1024 Oct  1 10:10 run.sh
```

<figure class="diagram">
<svg class="dg" viewBox="0 0 720 232" role="img" aria-labelledby="dg8t">
<title id="dg8t">ls -l の1行の読み方。左から権限、リンク数、所有ユーザー、所有グループ、サイズ、更新日時、名前。権限の10文字は、種別1文字と、所有者・グループ・その他それぞれ3文字に分かれる。</title>
<g class="mid" font-size="12">
<text x="80" y="16">権限</text>
<text x="174" y="16">リンク数</text>
<text x="246" y="16">所有ユーザー</text>
<text x="330" y="16">所有グループ</text>
<text x="408" y="16">サイズ</text>
<text x="507" y="16">更新日時</text>
<text x="614" y="16">名前</text>
</g>
<rect class="acc" x="20" y="26" width="120" height="30" rx="2"/>
<rect class="box" x="152" y="26" width="44" height="30" rx="2"/>
<rect class="box" x="208" y="26" width="76" height="30" rx="2"/>
<rect class="box" x="296" y="26" width="68" height="30" rx="2"/>
<rect class="box" x="376" y="26" width="64" height="30" rx="2"/>
<rect class="box" x="452" y="26" width="110" height="30" rx="2"/>
<rect class="box" x="574" y="26" width="80" height="30" rx="2"/>
<g class="mid mono" font-size="14">
<text class="link bold" x="80" y="46">-rwxr-xr--</text>
<text x="174" y="46">1</text>
<text x="246" y="46">alice</text>
<text x="330" y="46">lab</text>
<text x="408" y="46">1024</text>
<text x="507" y="46">Oct  1 10:10</text>
<text x="614" y="46">run.sh</text>
</g>
<path class="ln dash" d="M20 56V96M140 56L470 96"/>
<rect class="box" x="20" y="96" width="60" height="34" rx="2"/>
<rect class="box" x="90" y="96" width="120" height="34" rx="2"/>
<rect class="box" x="220" y="96" width="120" height="34" rx="2"/>
<rect class="box" x="350" y="96" width="120" height="34" rx="2"/>
<g class="mid mono" font-size="16">
<text x="50" y="119">-</text>
<text x="150" y="119">rwx</text>
<text x="280" y="119">r-x</text>
<text x="410" y="119">r--</text>
</g>
<g class="mid bold">
<text x="50" y="152">種別</text>
<text x="150" y="152">所有者 (u)</text>
<text x="280" y="152">グループ (g)</text>
<text x="410" y="152">その他 (o)</text>
</g>
<g class="mid mut" font-size="11">
<text x="150" y="170">alice は</text>
<text x="150" y="185">読む・書く・実行</text>
<text x="280" y="170">lab の人は</text>
<text x="280" y="185">読む・実行</text>
<text x="410" y="170">他の人は</text>
<text x="410" y="185">読むだけ</text>
</g>
<g class="mut" font-size="11">
<text x="20" y="170">- ファイル</text>
<text x="20" y="185">d ディレクトリ</text>
<text x="20" y="200">l リンク</text>
</g>
<text class="mut" x="500" y="119" font-size="12">r=読む  w=書く  x=実行</text>
<text class="mut" x="500" y="139" font-size="12">許可されていない所は - になる</text>
</svg>
<figcaption>図8 ls -l の1行。先頭の10文字が「権限」で、1+3+3+3文字に分けて読む。</figcaption>
</figure>

先頭の1文字は種別で、`-` が普通のファイル、`d` がディレクトリ、`l` がシンボリックリンク(ショートカットのようなもの)です。

### 数字で表す

権限は、`r=4`、`w=2`、`x=1` と数字にして、足し算で表すこともできます。3つの相手ごとに1桁ずつ、合計3桁で書きます。

<figure class="diagram">
<svg class="dg" viewBox="0 0 720 208" role="img" aria-labelledby="dg9t">
<title id="dg9t">権限の数字表現。所有者 rwx は 4+2+1 で 7、グループ r-x は 4+0+1 で 5、その他 r-x は 4+0+1 で 5。合わせて 755 になる。</title>
<g class="mid bold">
<text x="112" y="16">所有者 (u)</text>
<text x="362" y="16">グループ (g)</text>
<text x="612" y="16">その他 (o)</text>
</g>
<g>
<rect class="box" x="20" y="28" width="56" height="32" rx="2"/>
<rect class="box" x="84" y="28" width="56" height="32" rx="2"/>
<rect class="box" x="148" y="28" width="56" height="32" rx="2"/>
<rect class="box" x="270" y="28" width="56" height="32" rx="2"/>
<rect class="plain dash" x="334" y="28" width="56" height="32" rx="2"/>
<rect class="box" x="398" y="28" width="56" height="32" rx="2"/>
<rect class="box" x="520" y="28" width="56" height="32" rx="2"/>
<rect class="plain dash" x="584" y="28" width="56" height="32" rx="2"/>
<rect class="box" x="648" y="28" width="56" height="32" rx="2"/>
</g>
<g class="mid mono" font-size="16">
<text x="48" y="50">r</text><text x="112" y="50">w</text><text x="176" y="50">x</text>
<text x="298" y="50">r</text><text class="mut" x="362" y="50">-</text><text x="426" y="50">x</text>
<text x="548" y="50">r</text><text class="mut" x="612" y="50">-</text><text x="676" y="50">x</text>
</g>
<g class="mid mut mono" font-size="12">
<text x="48" y="78">4</text><text x="112" y="78">2</text><text x="176" y="78">1</text>
<text x="298" y="78">4</text><text x="362" y="78">0</text><text x="426" y="78">1</text>
<text x="548" y="78">4</text><text x="612" y="78">0</text><text x="676" y="78">1</text>
</g>
<g class="mid mono">
<text x="112" y="104">4+2+1</text>
<text x="362" y="104">4+0+1</text>
<text x="612" y="104">4+0+1</text>
</g>
<g class="ln-acc">
<path d="M112 112V124M362 112V124M612 112V124"/>
</g>
<rect class="acc" x="84" y="126" width="56" height="40" rx="2"/>
<rect class="acc" x="334" y="126" width="56" height="40" rx="2"/>
<rect class="acc" x="584" y="126" width="56" height="40" rx="2"/>
<g class="mid mono bold link" font-size="22">
<text x="112" y="154">7</text><text x="362" y="154">5</text><text x="612" y="154">5</text>
</g>
<text class="mid mono" x="360" y="198" font-size="14">chmod 755 run.sh</text>
</svg>
<figcaption>図9 権限は、相手ごとに 4+2+1 を足して 1桁にする。755 は「所有者は全部、他は読んで実行」。</figcaption>
</figure>

よく見る数字は、次のとおりです。

| 数字 | 記号 | 主な使いどころ |
|------|------|----------------|
| `644` | `rw-r--r--` | 普通のファイル。自分だけ書ける |
| `600` | `rw-------` | 秘密のファイル。**SSHの秘密鍵はこれ** |
| `755` | `rwxr-xr-x` | プログラムやスクリプト、公開ディレクトリ |
| `700` | `rwx------` | 自分専用のディレクトリ |

### chmod: 権限を変える

権限の変更は、所有者(またはroot)だけができます。指定の方法は2通りあります。

```term
$ chmod 755 run.sh          # 数字で一気に指定する
$ chmod u+x run.sh          # 所有者(u)に実行権限(x)を追加する
$ chmod go-w memo.txt       # グループ(g)とその他(o)から書き込み(w)を外す
$ chmod a=r memo.txt        # 全員(a)を、読み取りだけに揃える
```

記号で書くときは、「誰に(`u` `g` `o` `a`)」「どうする(`+` 追加、`-` 削除、`=` 指定)」「何を(`r` `w` `x`)」の順に並べます。ディレクトリの中身までまとめて変えるには、`-R` を付けます。

### chown / chgrp: 持ち主を変える

ファイルの所有者や所有グループを変えるコマンドです。**管理者権限が必要** なので、`sudo` を付けます。

```term
$ sudo chown bob memo.txt              # 所有者を bob にする
$ sudo chown bob:lab memo.txt          # 所有者を bob、グループを lab にする
$ sudo chgrp lab memo.txt              # グループだけを lab にする
$ sudo chown -R alice:alice project/   # ディレクトリの中身すべてに適用
```

### 特殊な権限(余裕があれば)

通常の `rwx` の他に、3つの特殊な権限があります。今はこんなものがあると知っておけば十分です。

- **SUID(`s`)**: 実行すると、そのファイルの「所有者」の権限で動きます。`passwd` コマンドがその例です。
- **SGID(`s`)**: 実行すると「所有グループ」の権限で動きます。ディレクトリに付けると、作成したファイルが同じグループになります。
- **スティッキービット(`t`)**: ディレクトリに付けると、中のファイルを所有者本人しか消せなくなります。`/tmp` がその例です。

### 「Permission denied」が出たら

権限がないと、`Permission denied` というエラーになります。次の順で確認してください。

1. `ls -l` で、対象のファイルの所有者・グループ・権限を確認する。
2. `id` で、自分がどのグループに入っているかを確認する。
3. 必要な権限が足りなければ、`chmod` で足す。それでも必要なら、`chown` や `sudo` を検討する。

安易に `chmod 777`(全員が全部できる)にするのは避けてください。**その場しのぎで解決したように見えて、セキュリティの穴になります。**

---

## 11. プロセスと環境変数

この章では、動いているプログラムの管理と、シェルが持つ設定値について学びます。

### プロセス

実行中のプログラムを **プロセス** と呼びます。それぞれに **PID(プロセス番号)** が付き、親が子を起動する親子関係を持ちます。

<figure class="diagram">
<svg class="dg" viewBox="0 0 720 150" role="img" aria-labelledby="dg10t">
<title id="dg10t">プロセスの親子関係。systemd(PID 1)が sshd を起動し、sshd が bash を起動し、bash が python と sleep を起動している。</title>
<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="head" d="M0 0L10 5L0 10z"/></marker></defs>
<rect class="box" x="20" y="52" width="120" height="46" rx="2"/>
<text class="mid mono bold" x="80" y="72">systemd</text>
<text class="mid mut" x="80" y="90" font-size="11">PID 1</text>
<rect class="box" x="190" y="52" width="120" height="46" rx="2"/>
<text class="mid mono bold" x="250" y="72">sshd</text>
<text class="mid mut" x="250" y="90" font-size="11">PID 842</text>
<rect class="acc" x="360" y="52" width="120" height="46" rx="2"/>
<text class="mid mono bold link" x="420" y="72">bash</text>
<text class="mid mut" x="420" y="90" font-size="11">PID 9123</text>
<rect class="box" x="570" y="14" width="130" height="46" rx="2"/>
<text class="mid mono bold" x="635" y="34">python3</text>
<text class="mid mut" x="635" y="52" font-size="11">PID 9201</text>
<rect class="box" x="570" y="90" width="130" height="46" rx="2"/>
<text class="mid mono bold" x="635" y="110">sleep</text>
<text class="mid mut" x="635" y="128" font-size="11">PID 9202</text>
<path class="ln" d="M140 75H190" marker-end="url(#ah)"/>
<path class="ln" d="M310 75H360" marker-end="url(#ah)"/>
<path class="ln" d="M480 75H525V37H570" marker-end="url(#ah)"/>
<path class="ln" d="M525 75V113H570" marker-end="url(#ah)"/>
<text class="mut" x="20" y="130" font-size="12">起動 = 親が子を作る</text>
<text class="mut" x="20" y="146" font-size="12">矢印は親から子へ</text>
</svg>
<figcaption>図10 プロセスの親子関係。ログインすると、sshd が自分用の bash を起動する。</figcaption>
</figure>

```term
$ ps aux | grep python            # 動いている python を探す
alice   9201  0.3  1.2 ... python3 train.py
$ top                             # 実行中のプロセスをリアルタイム表示(q で終了)
```

`ps` の2列目が PID で、`top` では CPU やメモリを多く使っているプロセスが上に並びます。

### プロセスを止める: kill

```term
$ kill 9201            # 終了をお願いする(まずはこれ)
$ kill -9 9201         # 強制的に終了させる(最後の手段)
$ pkill python3        # 名前で指定して終了させる
```

`kill` は、実は「プロセスに信号(シグナル)を送る」コマンドです。普通の `kill` は「そろそろ終わってください」とお願いする信号で、プロセスは片づけをしてから終了できます。`-9` は問答無用で止めるので、保存途中のデータが壊れることがあります。

### フォアグラウンドとバックグラウンド

画面を占有して動かすのが **フォアグラウンド**、裏で動かすのが **バックグラウンド** です。

```term
$ python3 train.py &       # 末尾に & を付けると、裏で動く
$ jobs                     # 裏で動いている仕事の一覧
$ fg %1                    # 1番の仕事を前面に戻す
```

実行中に `Ctrl + Z` で一時停止し、`bg` で裏での再開もできます。

> **よくある失敗**: SSHで接続して長い処理を裏で動かしても、接続が切れると一緒に止まることがあります。長時間の処理は、`tmux` や `screen` というツールの中で動かすと、切断しても続きます。`nohup コマンド &` で動かす方法もあります。

### ディスクとメモリの確認

サーバーが重いときや、保存できないときに見るコマンドです。

```term
$ df -h                 # ディスクの空き容量(ファイルシステムごと)
$ du -sh ~/project      # ディレクトリ1つが使っている容量
$ free -h               # メモリの使用状況
```

### 環境変数

シェルは、名前と値のペアを覚えています。これを **変数** と呼び、特に、実行するプログラムにも引き継がれるものを **環境変数** と呼びます。値は、`$` を付けて参照します。

```term
$ echo $HOME                 # ホームディレクトリ
/home/alice
$ NAME=alice                 # 変数を作る(= の両側にスペースを入れない)
$ echo "Hello, $NAME"
Hello, alice
$ export DATA_DIR=/data      # 環境変数にする(起動するプログラムにも渡る)
$ env                        # 環境変数の一覧
```

シェルを閉じると、設定した変数は消えます。毎回使いたい設定は、`~/.bashrc` に書きます。

```term
$ nano ~/.bashrc             # 末尾に export や alias を書く
$ source ~/.bashrc           # 書き換えた内容を、今のシェルに反映する
```

### PATH: コマンドを探す場所

`ls` のようにコマンド名だけを書いて実行できるのは、環境変数 **PATH** のおかげです。シェルは、PATHに書かれたディレクトリを **左から順に** 探し、最初に見つかったものを実行します。

<figure class="diagram">
<svg class="dg" viewBox="0 0 720 160" role="img" aria-labelledby="dg11t">
<title id="dg11t">PATHの検索。python3 と入力すると、PATHに並んだディレクトリを左から順に探す。/usr/local/bin にはなく、/usr/bin で見つかり、/usr/bin/python3 が実行される。</title>
<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="head" d="M0 0L10 5L0 10z"/></marker><marker id="aha" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="head-acc" d="M0 0L10 5L0 10z"/></marker></defs>
<text class="mut" x="190" y="16" font-size="12">$PATH の左から順に探す</text>
<rect class="box" x="20" y="30" width="120" height="40" rx="2"/>
<text class="mid mono" x="80" y="55">python3</text>
<rect class="box" x="190" y="30" width="140" height="40" rx="2"/>
<text class="mid mono" x="260" y="55">/usr/local/bin</text>
<rect class="acc" x="380" y="30" width="140" height="40" rx="2"/>
<text class="mid mono link bold" x="450" y="55">/usr/bin</text>
<rect class="plain dash" x="570" y="30" width="130" height="40" rx="2"/>
<text class="mid mono mut" x="635" y="55">/bin ...</text>
<path class="ln" d="M140 50H190" marker-end="url(#ah)"/>
<path class="ln" d="M330 50H380" marker-end="url(#ah)"/>
<text class="mid mut" x="355" y="42" font-size="11">なし</text>
<path class="ln dash" d="M520 50H570"/>
<path class="ln-acc" d="M450 70V102" marker-end="url(#aha)"/>
<text class="link" x="460" y="92" font-size="12">見つかった</text>
<rect class="acc" x="350" y="104" width="200" height="40" rx="2"/>
<text class="mid mono" x="450" y="129">/usr/bin/python3 を実行</text>
<text class="mut" x="570" y="86" font-size="11">ここから先は探さない</text>
</svg>
<figcaption>図11 コマンド名だけで実行できるのは、PATH のディレクトリを順に探してくれるから。</figcaption>
</figure>

```term
$ echo $PATH
/usr/local/bin:/usr/bin:/bin
$ which python3                  # 実際に実行されるファイルの場所
/usr/bin/python3
```

`command not found` が出たら、そのコマンドが入っていないか、PATHに含まれていないかのどちらかです。自分のスクリプトをカレントディレクトリで実行するには、PATHに `.` が含まれないため、`./run.sh` のように場所を明示します。

---

## 12. パッケージ管理

この章では、ソフトウェアを安全に入れる・消す・更新する方法を学びます。

### パッケージとリポジトリ

Linuxでは、ソフトを配布サイトからダウンロードして実行するのではなく、**パッケージ管理システム** を通して入れるのが基本です。

- **パッケージ**: ソフト本体と、動かすのに必要な情報をまとめたものです。
- **リポジトリ**: パッケージが置かれている、公式の保管庫です。
- **依存関係**: 「このソフトには、あのライブラリが必要」という関係です。パッケージ管理システムが、必要なものを自動でまとめて入れてくれます。

<figure class="diagram">
<svg class="dg" viewBox="0 0 720 150" role="img" aria-labelledby="dg12t">
<title id="dg12t">パッケージ管理の流れ。apt update でリポジトリから一覧を取得し、apt install でパッケージと依存関係をダウンロードして自分のマシンにインストールする。</title>
<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="head" d="M0 0L10 5L0 10z"/></marker></defs>
<rect class="box" x="20" y="30" width="190" height="70" rx="2"/>
<text class="mid bold" x="115" y="58">リポジトリ</text>
<text class="mid mut" x="115" y="78" font-size="12">インターネット上の保管庫</text>
<rect class="box" x="265" y="30" width="190" height="70" rx="2"/>
<text class="mid bold" x="360" y="58">パッケージ一覧</text>
<text class="mid mut" x="360" y="78" font-size="12">手元にある「目録」</text>
<rect class="acc" x="510" y="30" width="190" height="70" rx="2"/>
<text class="mid bold link" x="605" y="58">インストール済みソフト</text>
<text class="mid mut" x="605" y="78" font-size="12">依存関係もまとめて</text>
<path class="ln" d="M210 55H265" marker-end="url(#ah)"/>
<path class="ln" d="M455 55H510" marker-end="url(#ah)"/>
<text class="mid mono" x="237" y="46" font-size="11">update</text>
<text class="mid mono" x="483" y="46" font-size="11">install</text>
<path class="ln" d="M115 100V124H560V100" marker-end="url(#ah)"/>
<text class="mid mut" x="338" y="140" font-size="12">install のとき、本体と依存パッケージをダウンロード</text>
</svg>
<figcaption>図12 update で目録を最新にし、install で本体をダウンロードして入れる。</figcaption>
</figure>

### apt(Debian系: Ubuntuなど)

インストールや削除には管理者権限が必要なので、`sudo` を付けます。

```term
$ sudo apt update                  # パッケージ一覧を最新にする(まずこれ)
$ sudo apt install tree            # tree を入れる
$ sudo apt upgrade                 # 入っているソフトを、すべて最新にする
$ sudo apt remove tree             # 削除する
$ apt search keyword               # キーワードでパッケージを探す
```

`update` はソフトを更新するのではなく、**目録を更新するだけ** です。`install` や `upgrade` の前には、その習慣として `update` を実行します。

### dnf(Red Hat系)

Red Hat系では、コマンド名が変わるだけで、考え方は同じです。

| やりたいこと | apt | dnf |
|--------------|-----|-----|
| 一覧の更新 | `apt update` | (インストール時に自動) |
| インストール | `apt install` | `dnf install` |
| 削除 | `apt remove` | `dnf remove` |
| 全体の更新 | `apt upgrade` | `dnf upgrade` |

### 気を付けること

- 公式のリポジトリにあるものを、まず使ってください。ネットの手順で見かける `curl ... | sudo bash` は、中身を確認せずに管理者として実行する危険な方法です。
- 研究室の共有サーバーでは、管理者でなければ `sudo` は使えません。その場合は、Python の `venv` や `conda` のように、**自分のホームディレクトリの中だけで完結する方法** を使います。

---

## 13. サービスとログ

この章では、裏で動き続けるプログラム(サービス)の管理と、困ったときのログの読み方を学びます。

### サービスとは

Webサーバー、SSHサーバー、データベースなど、**裏で動き続けて、要求を待っているプログラム** を、サービス(デーモン)と呼びます。サーバーに接続できるのは、`sshd` というサービスが待ち受けているからです。

最近のLinuxでは、サービスの管理を **systemd** が担当します。systemd は、起動時に最初に動く親プロセス(PID 1)で、サービスを起動・停止・監視します。操作には `systemctl` を使います。

<figure class="diagram">
<svg class="dg" viewBox="0 0 720 160" role="img" aria-labelledby="dg13t">
<title id="dg13t">サービスの状態。停止中のサービスは start で実行中になり、stop で停止中に戻る。enable を設定すると、次回の起動時に自動で実行中になる。</title>
<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="head" d="M0 0L10 5L0 10z"/></marker></defs>
<rect class="box" x="40" y="40" width="190" height="60" rx="2"/>
<text class="mid bold" x="135" y="66">停止中 (inactive)</text>
<text class="mid mut" x="135" y="86" font-size="12">動いていない</text>
<rect class="acc" x="490" y="40" width="190" height="60" rx="2"/>
<text class="mid bold link" x="585" y="66">実行中 (active)</text>
<text class="mid mut" x="585" y="86" font-size="12">要求を待っている</text>
<path class="ln" d="M230 58H490" marker-end="url(#ah)"/>
<text class="mid mono bold" x="360" y="50">start</text>
<path class="ln" d="M490 84H230" marker-end="url(#ah)"/>
<text class="mid mono bold" x="360" y="104">stop</text>
<rect class="plain dash" x="250" y="124" width="220" height="30" rx="2"/>
<text class="mid mono" x="360" y="144" font-size="12">enable: 起動時に自動で start</text>
</svg>
<figcaption>図13 start / stop は「今」の操作、enable は「次の起動から」の設定。</figcaption>
</figure>

### systemctl

```term
$ systemctl status ssh              # 状態を確認する(誰でも可能)
$ sudo systemctl start ssh          # 今、起動する
$ sudo systemctl stop ssh           # 今、停止する
$ sudo systemctl restart ssh        # 再起動する(設定を変えた後に使う)
$ sudo systemctl enable ssh         # マシンの起動時に、自動で起動するようにする
$ sudo systemctl disable ssh        # 自動起動をやめる
```

`status` の画面では、`Active: active (running)` と出ていれば、正常に動いています。`q` で抜けられます。

> **注意**: SSHで接続している最中に `ssh` サービスを `stop` すると、次から接続できなくなります。サーバーの前に行けない場合は、とても困ります。

### ログを読む

何かがうまくいかないとき、原因はたいていログに書いてあります。

```term
$ journalctl -u ssh                 # ssh サービスのログ
$ journalctl -u ssh -n 50           # 最新の50行だけ
$ journalctl -u ssh -f              # 追いかけて表示(Ctrl + C で終了)
$ ls /var/log                       # ログファイルが置かれている場所
$ sudo tail -f /var/log/auth.log    # ログインの記録(Ubuntu)
```

エラーが出たときは、**メッセージを最後まで読む** ことが解決の近道です。最後の数行に原因が書いてあり、そのまま検索すると、同じ悩みの人の記事が見つかります。

---

## 14. ネットワークの基礎

この章では、コンピューター同士がどう通信しているかの基本と、確認用のコマンドを学びます。

### IPアドレス・ポート・DNS

ネットワーク上のマシンを特定するために、3つの考え方を使います。

- **IPアドレス**: マシンの住所です。`192.168.1.20` のような数字の並びです。
- **ホスト名とDNS**: 数字は覚えにくいので、`example.com` のような名前を付けます。名前からIPアドレスを調べる仕組みが **DNS** です。
- **ポート番号**: 1台のマシンの中の、サービスごとの窓口です。住所が建物なら、ポートは部屋番号にあたります。

<figure class="diagram">
<svg class="dg" viewBox="0 0 720 196" role="img" aria-labelledby="dg14t">
<title id="dg14t">クライアントからサーバーへの通信。ホスト名を DNS でIPアドレスに変換し、サーバーのポート22番のsshdと通信する。同じサーバーのポート80ではWebサーバーが待っている。</title>
<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="head" d="M0 0L10 5L0 10z"/></marker><marker id="aha" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="head-acc" d="M0 0L10 5L0 10z"/></marker></defs>
<rect class="box" x="20" y="66" width="130" height="60" rx="2"/>
<text class="mid bold" x="85" y="92">クライアント</text>
<text class="mid mut" x="85" y="110" font-size="12">あなたのPC</text>
<rect class="box" x="250" y="8" width="150" height="40" rx="2"/>
<text class="mid bold" x="325" y="33">DNSサーバー</text>
<path class="ln dash" d="M110 66L250 34" marker-end="url(#ah)"/>
<text class="mut" x="14" y="40" font-size="11">① server.example は?</text>
<path class="ln dash" d="M340 44L150 84" marker-end="url(#ah)"/>
<text class="mut" x="262" y="80" font-size="11">② 192.168.1.20</text>
<rect class="box" x="470" y="20" width="230" height="156" rx="2"/>
<text class="bold" x="486" y="42">サーバー 192.168.1.20</text>
<rect class="acc" x="486" y="56" width="198" height="40" rx="2"/>
<text class="mono" x="498" y="80">ポート 22 : sshd</text>
<rect class="box" x="486" y="112" width="198" height="40" rx="2"/>
<text class="mono" x="498" y="136">ポート 80 : Webサーバー</text>
<path class="ln-acc" d="M150 108L486 78" marker-end="url(#aha)"/>
<text class="link" x="250" y="112" font-size="12">③ ssh で接続(ポート22)</text>
</svg>
<figcaption>図14 名前をDNSでIPアドレスに直し、IPアドレスで建物(マシン)を、ポートで部屋(サービス)を特定する。</figcaption>
</figure>

よく見るポート番号は、`22`(SSH)、`80`(HTTP)、`443`(HTTPS)です。

### 自分のネットワーク設定を見る

```term
$ ip a                          # IPアドレスの確認(a は address の略)
2: eth0: ...
    inet 192.168.1.20/24 ...
$ hostname                      # このマシンの名前
```

出力の中の `inet` の後ろにあるのが、IPv4のアドレスです。`lo`(127.0.0.1)は、自分自身を指す特別なアドレスです。

### つながっているか確認する

```term
$ ping -c 3 example.com        # 通信できるか確認(-c 3: 3回だけ試す)
64 bytes from 93.184.216.34: icmp_seq=1 ttl=56 time=11.2 ms
$ curl -I https://example.com  # Webサーバーに、ヘッダだけ問い合わせる
HTTP/2 200
$ curl -O https://example.com/data.csv   # ファイルをダウンロードして保存する
```

`ping` が返らないなら、ネットワークの問題です。`ping` は通るのに `curl` が失敗するなら、DNS・ポート・相手サービスなどに原因があるかもしれません。このように、原因を段階的に切り分けます。

### 待ち受けているポートを調べる

サーバー側で「どのサービスが、どのポートで待っているか」を調べるには、`ss` を使います。

```term
$ ss -tln                       # TCPで待ち受けているポートの一覧
State   Local Address:Port
LISTEN  0.0.0.0:22
LISTEN  127.0.0.1:5432
```

`0.0.0.0:22` は、外部からの接続を受け付ける状態です。`127.0.0.1:5432` は、同じマシンの中からしか受け付けません。

---

## 15. SSHでリモート接続

この章では、離れたサーバーに安全に接続して作業する、SSHの使い方を学びます。研究室のサーバーに入るために、最初に使うことになる道具です。

### SSHとは

**SSH(Secure Shell)** は、通信を暗号化したうえで、離れたマシンのシェルを操作する仕組みです。サーバー側では `sshd` というサービス(13章)が待ち受けています。

### 昔の方法: telnet

SSHが広まる前は、離れたマシンの操作に **telnet(テルネット)** が使われていました。使い方はSSHとほとんど同じで、サーバーのシェルをこちらの画面に映し、コマンドを打てます。ポート番号は `23` 番です。

ただし、telnet は通信を **暗号化しません**。ログインに使うユーザー名とパスワードも、そのままの文字で、ネットワークを流れます。同じネットワークにいる人が通信を覗くと(盗聴)、パスワードが丸見えになります。

<figure class="diagram">
<svg class="dg" viewBox="0 0 720 230" role="img" aria-labelledby="dg15at">
<title id="dg15at">telnet と SSH の違い。telnet ではパスワードが平文のまま流れ、盗聴者に読まれる。SSH では暗号化された文字列が流れ、盗聴者には読めない。</title>
<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="head" d="M0 0L10 5L0 10z"/></marker><marker id="aha" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="head-acc" d="M0 0L10 5L0 10z"/></marker></defs>
<text class="bold" x="20" y="22">telnet(ポート23)</text>
<rect class="box" x="20" y="34" width="110" height="44" rx="2"/>
<text class="mid" x="75" y="61">自分のPC</text>
<rect class="box" x="590" y="34" width="110" height="44" rx="2"/>
<text class="mid" x="645" y="61">サーバー</text>
<path class="ln" d="M130 56H590" marker-end="url(#ah)"/>
<rect class="box" x="270" y="42" width="180" height="28" rx="2"/>
<text class="mid mono" x="360" y="61">password: pass1234</text>
<text class="mut" x="20" y="100" font-size="12">途中で覗かれると、そのまま読める → パスワードが盗まれる</text>
<text class="bold" x="20" y="142">SSH(ポート22)</text>
<rect class="box" x="20" y="154" width="110" height="44" rx="2"/>
<text class="mid" x="75" y="181">自分のPC</text>
<rect class="box" x="590" y="154" width="110" height="44" rx="2"/>
<text class="mid" x="645" y="181">サーバー</text>
<path class="ln-acc" d="M130 176H590" marker-end="url(#aha)"/>
<rect class="box" x="270" y="162" width="180" height="28" rx="2"/>
<rect class="acc" x="270" y="162" width="180" height="28" rx="2"/>
<text class="mid mono link" x="360" y="181">Zk3#9fQ&amp;x7Lp…</text>
<text class="mut" x="20" y="220" font-size="12">暗号化されているので、覗かれても意味が分からない</text>
</svg>
<figcaption>図15 telnet は文字がそのまま流れ、SSH は暗号化して流れる。</figcaption>
</figure>

SSHは、この問題を解決するために1995年に作られました。今は、**サーバーへのログインに telnet を使うことはありません。** サーバー側で telnet が有効になっている場合も、無効にするのが基本です。

一方で、`telnet` コマンドは「相手のポートが開いているか」を確かめる道具として、今も使われることがあります。

```term
$ telnet server.example.com 22
Connected to server.example.com.
SSH-2.0-OpenSSH_9.6
```

このように、接続できて、相手のあいさつ(SSHのバージョン)が返れば、そのポートは開いています。確認が終わったら、`Ctrl + ]` のあとに `quit` と打って抜けます。

### 接続する

```term
$ ssh alice@server.example.com             # ユーザー名@ホスト名
$ ssh -p 2222 alice@server.example.com     # ポートが22番以外のとき
```

初めてのサーバーでは、次のような確認が出ます。

```bash
The authenticity of host 'server.example.com (192.168.1.20)' can't be established.
ED25519 key fingerprint is SHA256:xxxxxxxx...
Are you sure you want to continue connecting (yes/no)?
```

これは「このサーバーは、本物ですか?」という確認です。管理者から聞いたフィンガープリントと合っていることを確かめてから、`yes` と答えます。以後は、サーバーの情報が `~/.ssh/known_hosts` に記録され、**偽物に入れ替わっていないか** を自動でチェックします。

### 公開鍵認証

パスワードの代わりに、**鍵のペア** を使うのが、安全で便利な方法です。

- **秘密鍵**: 自分のPCだけに置く、絶対に他人へ渡さない鍵です。
- **公開鍵**: サーバーに登録する、見られても構わない鍵です。

<figure class="diagram">
<svg class="dg" viewBox="0 0 720 210" role="img" aria-labelledby="dg15t">
<title id="dg15t">公開鍵認証の流れ。自分のPCで鍵のペアを作り、公開鍵をサーバーに登録する。接続時にサーバーが送るチャレンジに、秘密鍵で署名して返すと、公開鍵で検証されてログインできる。</title>
<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="head" d="M0 0L10 5L0 10z"/></marker><marker id="aha" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="head-acc" d="M0 0L10 5L0 10z"/></marker></defs>
<rect class="box" x="20" y="20" width="220" height="150" rx="2"/>
<text class="bold" x="36" y="44">自分のPC</text>
<rect class="acc" x="36" y="60" width="188" height="36" rx="2"/>
<text class="mid mono" x="130" y="83" font-size="12">秘密鍵 id_ed25519</text>
<rect class="box" x="36" y="112" width="188" height="36" rx="2"/>
<text class="mid mono" x="130" y="135" font-size="12">公開鍵 id_ed25519.pub</text>
<rect class="box" x="480" y="20" width="220" height="150" rx="2"/>
<text class="bold" x="496" y="44">サーバー</text>
<rect class="box" x="496" y="112" width="188" height="36" rx="2"/>
<text class="mid mono" x="590" y="135" font-size="12">~/.ssh/authorized_keys</text>
<path class="ln" d="M224 148H496" marker-end="url(#ah)"/>
<text class="mid" x="360" y="140" font-size="12">① 公開鍵を登録(ssh-copy-id)</text>
<path class="ln-acc" d="M496 66H224" marker-end="url(#aha)"/>
<text class="mid link" x="360" y="58" font-size="12">② 接続時に「確認用の問題」を送る</text>
<path class="ln-acc dash" d="M224 104H496" marker-end="url(#aha)"/>
<text class="mid link" x="360" y="96" font-size="12">③ 秘密鍵で署名して返す</text>
<text class="mid mut" x="360" y="196" font-size="12">④ サーバーが公開鍵で検証。合っていればログイン成功</text>
</svg>
<figcaption>図16 秘密鍵そのものはネットワークに流れない。署名だけを送って、本人であることを証明する。</figcaption>
</figure>

手順は次のとおりです。

```term
$ ssh-keygen -t ed25519                   # 鍵のペアを作る(パスフレーズを付けるのがおすすめ)
$ ssh-copy-id alice@server.example.com    # 公開鍵をサーバーに登録する
$ ssh alice@server.example.com            # 以後は鍵でログインできる
```

> **警告**: 秘密鍵(`id_ed25519`、拡張子なしのほう)は、メールや共有ストレージに **絶対に置かないでください**。GitHubに公開リポジトリとして上げてしまう事故もあります。権限は、`600` でないと、sshが使用を拒否します(10章)。

### 設定ファイルで楽をする

`~/.ssh/config` に書いておくと、長いコマンドが短くなります。

```
Host lab
    HostName server.example.com
    User alice
    Port 22
    IdentityFile ~/.ssh/id_ed25519
```

こう書いた後は、次のように接続できます。

```term
$ ssh lab
```

### scp: ファイルを送受信する

SSHの仕組みを使って、ファイルをコピーします。`cp` と同じく、**コピー元 → コピー先** の順で書き、リモート側は `ユーザー@ホスト:パス` の形にします。

```term
$ scp data.csv lab:~/project/              # 手元 → サーバー
$ scp lab:~/project/result.png .           # サーバー → 手元(. は今いる場所)
$ scp -r results/ lab:~/project/           # ディレクトリごと送る(-r)
```

リモートの `*` を使いたい場合は、手元のシェルが先に展開しないよう、引用符で囲みます(5章)。

```term
$ scp "lab:~/project/*.png" .
```

大量のファイルや、差分だけの同期には `rsync` が向いています。

### 接続の切り方

`exit` か、`Ctrl + D` で切断します。

---

## 16. シェルスクリプト入門

この章では、毎回打っているコマンドを、ファイルにまとめて自動化する方法を学びます。

### 最初のスクリプト

コマンドを1行ずつファイルに書き並べたものが、**シェルスクリプト** です。ファイルを作ります。

```term
$ nano hello.sh
```

```bash
#!/bin/bash
# あいさつをするスクリプト
name="alice"
echo "Hello, $name"
```

1行目の `#!/bin/bash` は **シバン** と呼ばれ、「このファイルを bash で実行してください」という宣言です。`#` で始まる行は、コメントです。

そのままでは実行できないので、10章の実行権限を付けます。

```term
$ chmod +x hello.sh
$ ./hello.sh
Hello, alice
```

`./` を付けるのは、現在のディレクトリが PATH に入っていないからです(11章)。

### 引数を受け取る

スクリプトに渡した値は、`$1`、`$2` のように受け取れます。

```bash
#!/bin/bash
echo "ファイル名: $1"
wc -l "$1"
```

```term
$ ./count.sh data.csv
ファイル名: data.csv
1024 data.csv
```

変数を使うときは、スペースを含む名前でも壊れないように、`"$1"` のように **引用符で囲む** のが基本です。

### 条件分岐

```bash
#!/bin/bash
if [ -f "$1" ]; then
    echo "$1 は存在します"
else
    echo "$1 は存在しません"
fi
```

`[ -f ファイル ]` は、「ファイルが存在するか」の判定です。`[` の内側と `]` の前には、必ずスペースを入れます。

### 繰り返し

```bash
#!/bin/bash
for f in *.txt; do
    echo "処理中: $f"
    cp "$f" "$f.bak"
done
```

`*.txt` が、シェルによって `a.txt b.txt ...` に展開され(5章)、1つずつ `f` に入って処理されます。

### 終了ステータス

コマンドは、終わるときに「成功したか」を数字で返します。`0` が成功、それ以外が失敗です。直前のコマンドの結果は、`$?` で見られます。

```term
$ ls /no/such/dir
ls: cannot access '/no/such/dir': No such file or directory
$ echo $?
2
```

これを利用して、`&&`(成功したら次を実行)や `||`(失敗したら次を実行)でコマンドをつなげます。

```term
$ mkdir project && cd project        # 作成に成功したら、移動する
```

---

## 17. まとめとコマンド早見表

### コマンド早見表

| 分類 | コマンド | 用途 |
|------|----------|------|
| 場所 | `pwd` `cd` `ls` `tree` | 現在地の確認、移動、一覧 |
| 操作 | `touch` `mkdir` `cp` `mv` `rm` | 作成、コピー、移動、削除 |
| 検索 | `find` `grep` | ファイル名、文字列を探す |
| 閲覧 | `cat` `head` `tail` `less` `wc` | 中身の確認、行数の計測 |
| 編集 | `nano` `vim` | ファイルの編集 |
| ユーザー | `whoami` `id` `useradd` `passwd` `su` `sudo` `gpasswd` | ユーザーとグループの管理 |
| 権限 | `ls -l` `chmod` `chown` `chgrp` | パーミッションの確認と変更 |
| プロセス | `ps` `top` `kill` `jobs` `fg` | 実行中のプログラムの管理 |
| 資源 | `df` `du` `free` | ディスクとメモリの確認 |
| パッケージ | `apt` `dnf` | ソフトの導入と更新 |
| サービス | `systemctl` `journalctl` | サービスの管理とログの確認 |
| ネットワーク | `ip` `ping` `curl` `ss` | 通信の確認 |
| リモート | `ssh` `scp` `ssh-keygen` | 接続とファイル転送 |
| 調べる | `man` `--help` `which` | 使い方とコマンドの場所 |

### 困ったときの進め方

1. **エラーメッセージを最後まで読む。** 原因が、そのまま書いてあることが多いです。
2. **`pwd` と `ls` で、今どこにいるのかを確認する。** ファイルが見つからない原因の半分は、場所の勘違いです。
3. **`man` や `--help` で調べる。** 目的に合うオプションが見つかります。
4. **エラーメッセージをそのまま検索する。** 同じ悩みの記事が見つかります。
5. **危ない操作の前は、ひと呼吸おく。** `rm -rf` や `chmod -R`、`sudo` の付いたコマンドは、実行前にもう一度、引数を読み返してください。

分からなくなったら、この記事を最初から読み直すより、自分が「何をしたいのか」を言葉にしてから、該当する章を開くのが近道です。あなたがLinuxを怖がらずに使えるようになることを願っています。
