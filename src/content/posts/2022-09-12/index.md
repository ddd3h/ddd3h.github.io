---
title: "便利なFish Shellをインストールしよう"
date: 2022-09-12T20:50:09+09:00
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

さていつものように `brew install fish` をしてみるが、残念ながら買ったばっかりのMacにはHomebrewは入っていない。

## Homebrewをインストールする

そこでHomebrewのインストールから始めなくてはいけない。

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"```
```

HomebrewはMacユーザーにとっては便利なツールであるからインストールしておいて損はないだろう。

さて、インストールできたらここからが本番である。

私のMacはすでにデフォルトでZshが採用されている．以前のMacではBashを使い続け、Appleからの「Zshに変更しましょう」みたいなやつを無視し続けてきた。

（こういうところで「新しい」Macというのを感じることになるとは……）

さてインストールが完了するとこんなエラーが出た。

```bash
Warning: /opt/homebrew/bin is not in your PATH.
  Instructions on how to configure your shell for Homebrew
  can be found in the 'Next steps' section below.
==> Installation successful!

==> Homebrew has enabled anonymous aggregate formulae and cask analytics.
Read the analytics documentation (and how to opt-out) here:
  https://docs.brew.sh/Analytics
No analytics data has been sent yet (nor will any be during this install run).

==> Homebrew is run entirely by unpaid volunteers. Please consider donating:
  https://github.com/Homebrew/brew#donations

==> Next steps:
- Run these two commands in your terminal to add Homebrew to your PATH:
    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> /Users/daisuke/.zprofile
    eval "$(/opt/homebrew/bin/brew shellenv)"
- Run brew help to get started
- Further documentation:
    https://docs.brew.sh
```

PATHが通らなかったらしい。とりあえず，PATHを通そう。

ここでzshにはbashと同様に `.zshrc` と `zprofile` という2つが存在する。zshrcはログインシェルとインタラクティブシェルの場合だけ読み込まれる。 `zprofile` はログインシェルの場合に１度だけ読み込まれる。

```bash
vi ~/.zprofile
```

この中に

```bash
export PATH=/opt/homebrew/bin:$PATH
```

を最終行に追記してください。

## ようやくfishをインストール。

さてbrewをインストールすることができたのでfishをインストールするぞ。

あ、自分でPathを通しておいて気づきませんでしたが、`brew`は、Apple Siliconでは `/opt/homebrew/bin/brew` にあるそうです。

まじかよ。。。

それが本当に最適かどうかは分からないのですが、とりあえずfishを動かすためにshellのPathを変更します。

```bash
sudo vi /etc/shells   #  末尾に /opt/homebrew/bin/fish を追加
chsh -s /opt/homebrew/bin/fish
```

自分はHyperをターミナルに使用しているのですが、Mac本体の再起動が必要そうです。

同じようにGitHubで嘆いている人を見かけたのですが、論破されてました。

> In the words of my school IT director, "did you doa restart?”

[Hyper doesn't use default shell on MacOS · Issue #4266 · vercel/hyper](https://github.com/vercel/hyper/issues/4266#issuecomment-971099990)

本当にそうですね。同じように問題が起こった人は、再起動をしましょう。

この後、fish側の環境変数やらの設定をしましょう。

同じことを２度もしてるような感じもするので、面倒臭ければzshをdefaultのshellにして、起動とともにfishを起動するようにしてもいいかも知れません。

fishの設定は `~/.config/fish/config.fish` に記述します。

私はPython等の都合もあり、以下のようにしました。

```bash
if status is-interactive
    # Commands to run in interactive sessions can go here
    set -x PATH /opt/homebrew/bin $PATH
    set -x PATH /Library/Frameworks/Python.framework/Versions/3.10/bin $PATH
    alias python 'python3'
    alias pip 'pip3'
end
```

これを書いた後は、fishをより便利におしゃれにしていきます。

## 自分好みのfishに変更する

私は `oh-my-fish` のテーマを使います。

フォントもそれに対応したものをインストールしましょう。

インストールが完了したら、使用されてるターミナルからフォントを変更してください。

```bash
fisher install oh-my-fish/theme-bobthefish
git clone https://github.com/powerline/fonts.git
cd fonts
./install.sh
cd
rm -rf ./fonts
```

## パッケージマネジャーfisherをインストールする

fisherは便利なので入れとくといいです。

```bash
curl https://git.io/fisher --create-dirs -sLo ~/.config/fish/functions/fisher.fish
```

## プラグインをインストールする

### z

今回はディレクトリの履歴から検索して表示してくれるzというプラグインのみを入れます。めちゃ便利です。

```bash
brew install z
fisher install jethrokuan/z
```

## 頑張った成果を見よう

Apple Siliconの環境設定頑張ったので

```bash
fisher install laughedelic/fish_logo
fish_logo
```

をして達成感を味わいましょう笑

```bash
                 ___
  ___======____=---=)
/T            \_--===)
[ \ (O)   \~    \_-==)
 \      / )J~~    \-=)
  \\___/  )JJ~~~   \)
   \_____/JJJ~~~~    \
   / \  , \J~~~~~     \
  (-\)\=|\\\~~~~       L__
  (\\)  (\\\)_           \==__
   \V    \\\) ===_____   \\\\\\
          \V)     \_) \\\\JJ\J\)
                      /J\JT\JJJJ)
                      (JJJ| \UUU)
```