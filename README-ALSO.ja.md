# これはなに？

[GitHubのプロフィールページ](https://github.com/igrep)にある、
「Public contributions」という図を埋める(いわゆる、大草原を生やす)のを支援する私専用のツールです。  
[こちら](https://keep-me-contributing.herokuapp.com/)にある通り、
今日、「Public contributions」を埋める活動をしたかどうかがひと目でわかるよう表示してくれたり、
設定した時刻に「Public contributions」を埋める活動をしたかどうかを通知で教えてくれたりします。

# 開発の動機

私は上記の「Public contributions」を埋めるのが大好きです。  
真面目なOSSへのコミットはもちろん、単なる開発日記であれ、GitHub上で少し活動するだけで埋められるので、
継続して何かをするモチベーションの向上に非常に役立っています。

ところが、結果としてGitHubのプロフィールページを確認するのが癖となり、
毎日contributionしたか気になって仕方がなくなりました。  
そこで、それを少しでも楽にするために作成しました。

## ユースケース例

- 日付が変わった直後、「まだcontributionしてないよ！」と赤く表示することで、今日のcontributionへのやる気を奮い立たせる。
- 退社する時間帯、今日のcontributionについて自動で教えることで、今日や明日どのようなコミットを行うか考えるきっかけを与える。
- 日付が変わる少し前、contributionし忘れていることを気づかせることで、「Current streak」が途切れるリスクを抑える。

# 構成について

下記のようなコンポーネントに分かれています。

- クライアント用アプリケーション (Webブラウザ版)
    - 通知を送るタイミングなどを管理するアプリケーション(app.js)と、
    - バックグラウンドで動作して、指定した時刻に通知を送るWeb Worker(worker.js)に分かれています。
- クライアント用アプリケーション (Apache Cordova版)
    - 基本的には上記と同様ですが、通知を送るのにWorkerではなく[cordova-plugin-local-notifications](https://github.com/katzer/cordova-plugin-local-notifications)を使用しています。
- サーバーアプリケーション (Java 8のSparkを使用)
    - クライアントからのリクエストを受け取り、実際にgithub.comにアクセスして、
      「Public contributions」の図を状況を返します。

当初、Service Workerを使用することで、Webブラウザだけで作成するつもりでいましたが、
[こちらの私のスライド](http://the.igreque.info/slides/2015-10-01-service-worker.html)でも
説明している通り、現状のService Workerでは実装できないことに気づいたため、
Apache Cordovaを代わりに使用することとしました。  
本来Web Workerを使わなくてもよいのにWeb Workerを使ったのは、そのためです。  
あとでまたService Workerで書き換えたいという希望的観測があるため、敢えてそのままにしています。

# その他特記事項

- リポジトリは https://github.com/igrep/keep-me-contributing にあります。
- GitHubが公開していないAPI endpointを使用しているため、念の為あまり多くの人がアクセスしたくならないよう、自分専用としています。
