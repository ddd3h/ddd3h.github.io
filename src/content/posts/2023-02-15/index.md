---
title: '簡単な描画は"gnuplot"で済ませる'
date: 2023-02-15T20:50:09+09:00
categories:
- Linux
comments:       false
showMeta:       true
showActions:    false
draft: true
---
{{< katex >}}

**gnuplot**（ニュープロット しばしばグニュープロットとも）は、2[次元](https://ja.wikipedia.org/wiki/次元)もしくは3次元のグラフを作成するためのアプリケーションソフトウェアである。インターネットにおいて無料で配布されているフリーウェアである。[1986年](https://ja.wikipedia.org/wiki/1986年)に最初のバージョンが開発された。現在では、[Linux](https://ja.wikipedia.org/wiki/Linux)、[UNIX](https://ja.wikipedia.org/wiki/UNIX)、[Windows](https://ja.wikipedia.org/wiki/Microsoft_Windows)、[macOS](https://ja.wikipedia.org/wiki/MacOS)などの多くの[オペレーティングシステム](https://ja.wikipedia.org/wiki/オペレーティングシステム) (OS) に対応したバージョンが開発されている。

gnuplot は画面上に直接出力することができますし、Portable Network Graphics (PNG), Encapsulated PostScript (EPS), Scalable Vector Graphics (SVG), JPEG 等多くのグラフィックファイル形式でも出力することが可能です。また、LaTeXのフォントと強力な数式表記機能を利用して、LaTeX文書に直接含めることができるLaTeXコードを作成することができます。このプログラムは対話的にも、スクリプトを用いたバッチモードでも使用できます[5]。

gnuplot は複数の形式のデータを読み込むことができ、他のプログラム (piping) によって生成されたデータをその場で読み込む機能、一つの画像に複数のプロットを作成する機能、2D、3D、輪郭プロット、パラメトリック方程式、種々の線形および非線形座標系、投影、地理および時間データの読み込みと表示、種々の形式の箱型プロット、ヒストグラム、ラベル、その他の形状、テキスト、画像を含むプロットのカスタム要素 (手動設定、スクリプトによる計算、入力データから自動的に) が可能です。

gnuplot はまた、スクリプト機能、ループ、関数、テキスト処理、変数、マクロ、 入力データの任意の前処理 (通常は列方向)、および非線形多次元多集合重み付けデータ フィッティングを行う機能 (曲線フィッティングと Levenberg-Marquardt アルゴリズムを参照) を提供します。

gnuplot のコアコードは C で書かれています。 Qt, wxWidgets, LaTeX/TikZ/ConTeXt による出力のためのモジュラーサブシステムは C++ と Lua で書かれています。

## 2Dプロットの仕方

```
plot sin(x)
```

### 複数のグラフをプロットする

```
plot sin(x), cos(x)
```

### x範囲を指定する

```
plot [0,2*pi] sin(x)
```



### y範囲を指定する

```
plot [][-1,1] sin(x)
```



### サンプル数の変更

```
set samples 10000 //通常は50点
```



## ユーザー関数の定義

```
f(x) = sin(x)
show functions //定義した関数の一覧を表示
```



## 3Dプロットの仕方



## 関数一覧

| 関数                      | 動作                           |
| ------------------------- | ------------------------------ |
| abs(z)                    | 絶対値  \\( \|z\| \\)                 |
| acos(z)                   | \\( \arccos(z) \\)                |
| acosh(z)                  | \\( \mathrm{arccosh}(z) \\)            |
| asin(z)                   | \\( \arcsin(z) \\)           |
| asinh(z)                  | \\( \mathrm{arcsinh}(z) \\)            |
| atan(z)                   |  \\( \arctan(z) \\)            |
| atan2(z1,z2)              | \\( \arctan \left(\dfrac{z_1}{z_2} \right) \\)               |
| atanh(z)                  |   \\( \mathrm{arctanh}(x) \\)       |
| besj0(x)                  | 0次ベッセル関数 \\( J_0(x) \\)        |
| besj1(x)                  | 1次ベッセル関数 \\( J_1(x) \\) |
| besy0(x)                  | 0次ノイマン関数 \\( Y_0(x) \\) |
| eesy1(x)                  | 1次ノイマン関数 \\( Y_1(x) \\) |
| ceil(rz)                  | \\( z \\)以上の最小の整数を求める関数   |
| cos(z)                    |                                |
| cosh(z)                   |                                |
| erf(rz)                   | (正規化)誤差関数               |
| erfc(rz)                  | を示す関数                     |
| exp(z)                    |                                |
| floor(rz)                 | 以下の最大整数を求める関数     |
| gamma(rz)                 | ガンマ関数                     |
| ibeta(p,q,rz)             | 不完全ベータ関数               |
| igamma(a,rz)              | 不完全ガンマ関数               |
| imag(z)                   | の虚部                         |
| int(rz)                   | rz の整数部を求める関数        |
| inverf(rz)                | erf(rz) の逆関数               |
| invnorm(rz)               | norm(rz) の逆関数              |
| lgamma(rz)                | 対数ガンマ関数                 |
| log(z)                    |                                |
| log10(z) |                                |
| norm(rz)                  | 正規分布関数の累積を求める関数 |
| rand(rz)                  | 擬似乱数を発生させる関数       |
| real(z)                   | zの実部                        |
| sgn(rz)                   | の符号を求める関数             |
| sin(z)   |                                |
| sinh(z)                   |                                |
| sqrt(z)                   |                                |
| tan(z)                    |                                |
| tanh(z)                   |                                |
