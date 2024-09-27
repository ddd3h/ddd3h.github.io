---
title: "Maximaを使いこなせるのか"
date: 2023-01-11T20:50:09+09:00
categories:
- 日記
tags:
- 日記
keywords:
- 日記
comments:       false
showMeta:       true
showActions:    false
draft: true
---

今日は，数式処理ソフトであるMaximaについてまとめます．

# What's Maxima ??

Maxima (マキシマ) は数式処理ソフトと呼ばれ，代数演算などが可能です．LISP (リスプ) と呼ばれる高水準プログラミング言語の中でFORTRANに次いで２番目に古いソフトウェアです．

Maximaは，TeXやEmacsといったものを利用してより機能を充実させています．またMaximaにもいくかの種類があります．例えば，MaximaのGUI版をwxMaximaといい，Emacs用のパッケージをimaximaなどと言ったりします．グラフの描画はgnuplot (ニュープロット，グニュープロット) を使用しているので，こちらのインストールも必須です．

# プログラミング

Maximaでは，文末に `;` か `$` を入力します．`;`は計算出力を許可し，`$`は許可しません．

## 四則演算

```lisp
1 + 2
```





