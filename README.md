# 空手技自動解析システム『SAMURAI』
このアプリケーションは試合映像を機械学習で識別を行い、攻撃技ごとにトリミング＆トリミングを自動実行いたします。

# デモ
こちらからデモが実行できます。

https://samurai.bellt.me
（Google Chrome・Microsoft Edge推奨）

※JavaScriptを使用しているため、処理速度はお使いの端末に依存します。

# 使用モデル
本アプリケーションでは骨格検出・技検出の2段階で予測をおこなっており、それぞれ異なるモデルを使用しております。
## 骨格検出
骨格検出には以下のモデルが使用できます。
### PoseNet
Google TensorFlowが提供するモデルです。ResNet50アーキテクチャを使用したモデルとなっており、量子化数や出力ストライドなど詳細のパラメーターを設定することができます。
### BlazePose
Google MediaPipeが提供するモデルです。3D予測に対応しており、奥行きの移動を伴う予測に適しております。
### MoveNet
Google TensorFlowが提供するモデルです。PoseNetと比較し高速化を実現しております。モデルはLight（軽量）モデルとThunder（正確）モデルが用意されており、両方ともMobileNet V2アーキテクチャを使用しております。

※複数人検出に対応しているのは現時点では**PoseNetとMoveNet Lightモデルのみ**です。

予測する映像や条件などに応じて使い分けてみてください。

## 技予測
技予測時に使用するモデルの準備において、以下3つの方法があります。

* 用意されたモデルを使用する
* 自身で用意したモデルを使用する
* 用意された学習データ（または自身の学習データ）で新たなモデルを作成し、それを使用する

### 用意されたモデルを使用する
このアプリケーションには開発者が用意した『MIYABI』モデルが用意されています。 単にアプリケーションを使用したい際はこちらを使用してください。

（MIYABIモデルの仕様は[こちら](https://github.com/ImBellT/samurai/blob/main/model/miyabi_v1/README.md)）

### 自身で用意したモデルを使用する
用意されたものとは別に、自身で用意したモデルをアップロードして予測に用いることもできます。

過去に一度こちらでモデルを作成しダウンロードをしたことがある場合は、ここからモデルをアップロードすると前回と同じ設定・データで予測が実行できます。

アップロードできるモデルの形式等は[こちら](https://github.com/ImBellT/samurai/blob/main/manual/custom-model.md)を参照ください。（通常のモデルとは仕様が異なりますのでご注意ください。）

### 新たなモデルを作成する
研究目的等で新たなモデルを作成したい場合は、学習データを用意すればモデルを作成することができます。（作成したモデルはそのまま予測に使用されます）

モデル作成に関して詳細は[こちら](https://github.com/ImBellT/samurai/blob/main/manual/make-model.md)を参照ください。

# 論文
本システムの論文は後日arXiv.orgにて公開いたします。