---
title: "HEAsoftを高速にダウンロードする"
date: 2023-03-13T15:00:09+09:00
categories:
- Linux
tags:
- linux
keywords:
- Linux
comments:       false
showMeta:       true
showActions:    false
draft: false
---

## "HEAsoft"って何？

HEAsoftは、高エネルギー天体物理学に関連するデータ解析ソフトウェアのパッケージです。このパッケージには、NASAの多くのX線天文衛星ミッションで使用されるデータ解析ソフトウェアが含まれています。たとえば、Chandra X線天文台、XMM-Newton、Suzakuなどが挙げられます。

HEAsoftには、X線天文学に関する多くのツールが含まれており、X線スペクトルの分析、背景の推定、画像処理、時系列解析などが可能です。HEAsoftは、主にUNIXベースのシステムで動作することが意図されていますが、WindowsやMac OS Xなどのプラットフォームでも使用することができます。

HEAsoftは、NASAの高エネルギー天体物理学の研究者や、天文学者、物理学者、コンピューターサイエンティスト、その他の関連分野の研究者によって使用されています。

[http://heasarc.gsfc.nasa.gov/docs/software.html](http://heasarc.gsfc.nasa.gov/docs/software.html)

## ダウンロード

1. NASAのサイトからHEAsoftのSource Codeをダウンロードする。ダウンロードサイトは [https://heasarc.gsfc.nasa.gov/docs/software/lheasoft/download.html](https://heasarc.gsfc.nasa.gov/docs/software/lheasoft/download.html)

2. ダウンロードサイトで
   
   - STEP1：適切な自分のPC環境を選ぶ。
   
   - STEP2：個々のミッションファイルを選ぶ。今後、様々な衛星データを扱う予定ならば「All」でよい。
   
   - 以上が完了したら「Submit」

3. 「tar.gz」ファイルがダウンロードされる。
   
   - tar.gzファイルはtarが非圧縮でファイルをひとまとまりにするもの、gzは圧縮。
   
   - ダウンロード時間（１〜２時間かかる）は長いのでコーヒーブレイクでも楽しむと良い。
     
     - **下に載せたやり方であれば5分足らずで完了する。**
   
   - あまりにも遅い場合、国内サーバーにUbuntuのバージョンのみではあるが、（期間限定で）サーバー上においておくので、そこからダウンロードしてもよい。
     
     - やりかた
       
       - ターミナルで以下のコマンド2行を実行する
         
        ```sh
        wget --keep-session-cookies --save-cookies="cookies.txt" "https://20.gigafile.nu/0621-le3295726dd5b0b45503e5823972cde05"
        wget --load-cookies "cookies.txt" -O "heasoft-6.31.1src.tar.gz" "https://20.gigafile.nu/download.php?file=0621-le3295726dd5b0b45503e5823972cde05"
        ```
       
       - URLの有効期限は2023/6/21です。これ以降ダウンロードされる場合は管理者にご連絡ください。

4. 以下のコマンドでファイルを展開します。
   
   ```sh
   tar xzvf "heasoft-6.31.1src.tar.gz"
   ```
   
   `heasoft-6.31.1`というディレクトリができていることを確認しましょう。

5. `BUILD_DIR`に移動して、インストールを開始します。
   
   - 
     ```sh
     cd heasoft-6.31.1/BUILD_DIR
     ```
   
   - TXTファイルにDUMPする人もいますが、別にエラーなんてその場で見てください。なのでDUMPなんかせず、ただ単に実行します。
     
     ```sh
     ./configure
     ```
     
     - 私の場合は次のエラーが出ました。
       
       ```
       configure: error: Required file /usr/include/X11/Xlib.h not found!
       configure: error: Configure failed in /home/daisuke/heasoft-6.31.1/heacore/BUILD_DIR!
       ```
       
       - Ubuntu 22.04 LTS以降ではデフォルトでGUI(X Window System)やデスクトップ環境が入っていません。なぜこういう古いシステムが好きなんですかね。。。
         
         次のコマンドを実行してインストールします。
         
         ```sh
         sudo apt install xorg-dev
         ```
     
     - エラーを解消したら再度、`./configure`と実行してください。
     
     - 再度、私は次のようなエラーが出ました。
       
       ```
       configure: error: AstroPy unavailable but required for HEASoftPy
       configure: error: Configure failed in /home/daisuke/heasoft-6.31.1/heacore/BUILD_DIR!
       ```
       
       - `AstorPy`つまりPythonのライブラリが入ってなかったようです。なのでご自分のPython環境に合わせてインストールしてください。
         
         ```sh
         pip install astropy
         ```
     
     - エラーを解消すると次`Scipy`です。。。「自動でインストールシステム作れ」と怒りたくなりますが、根気よくインストールしていきます。こちらもPythonですので、上同様に実行してください。
       
       - 念の為、やり方は
         
         ```sh
         pip install scipy
         ```
     
     - またこんなエラーがでました。。。
       
       ```
       configure: error: No curses header-files found
       configure: error: Configure failed for heacore component lynx!
       configure: error: Configure failed in /home/daisuke/heasoft-6.31.1/heacore/BUILD_DIR!
       ```
       
       - たぶんですが一行目にこういったエラーが出たということで予想ですが次のように実行して、エラー祭りを回避します。
         
         ```sh
         sudo apt install libreadline-dev libcurl4 libcurl4-gnutls-dev libncurses5-dev
         ```
     
     - `Finished`が出れば完了です。次のステップに行きましょう。

6. `Make`コマンドでコンパイルをします。おそらく、`configure`を通っているのでエラーは無いと思います。ここでもDUMPせずに進みます。
   
   ```sh
   make
   ```

7. インストールをします。
   
   ```sh
   make install
   ```

8. Pathの設定をする（daisukeはユーザー名ですので適宜変更してください。）
   
   ```sh
   export HEADAS=/home/daisuke/heasoft-6.31.1/x86_64-pc-linux-gnu-libc2.35
   . $HEADAS/headas-init.sh
   alias heainit=". $HEADAS/headas-init.sh"
   heainit
   ```
   
   `.bashrc`等にでも書いておくといい．実際に動くは`fv`と入力して動けば動くということである．

