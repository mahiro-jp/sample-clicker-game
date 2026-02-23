// ① データを保存する箱（変数）を用意する
let score = 0;

// ② HTMLに書いた「ID」を目印にして、操作したいパーツをJavaScriptに持ってくる
const scoreDisplay = document.getElementById('score');
const clickButton = document.getElementById('click-btn');

// ③ ボタンがクリックされたときの処理を作る
clickButton.addEventListener('click', ( event) => {
    // スコアを1増やす
    score = score + 1;
    // HTMLの「0」と書かれていた部分のテキストを、新しいスコアに書き換える
    scoreDisplay.textContent = score;
    // 残高チェック
    checkFunds();
    // セーブ
    saveGame();

    // event.pageX と event.pageY には、クリックした瞬間のマウスのX・Y座標が入っています
    createFloatingText( event.pageX, event.pageY);
});

// ====== ここからショップと自動化のプログラム ======

// ① 新しいデータを保存する箱（変数）を用意する
let autoCount = 0; // 持っている装置の数
let autoCost = 10; // 次に装置を買うために必要なスコア（最初は10）

// ② HTMLに書いた新しい「ID」を目印にして、パーツを持ってくる
const autoCountDisplay = document.getElementById('auto-count');
const autoCostDisplay = document.getElementById('auto-cost');
const buyAutoBtn = document.getElementById('buy-auto-btn');

// ③ 「装置を買う」ボタンが押されたときの処理
buyAutoBtn.addEventListener('click', () => {
    // もし（if）スコアがコスト以上だったら、購入できる！
    if ( score >= autoCost) {
        // 1. スコアを消費する（スコアからコストを引く）
        score = score - autoCost;
        // 2. 装置の数を1つ増やす
        autoCount = autoCount + 1;
        // 3. 次のコストを値上げする（インフレ要素：1.5倍にして小数点を切り捨てる）
        autoCost = Math.floor( autoCost * 1.5);
        // 4. 変化した数字をすべて画面に反映させる
        scoreDisplay.textContent = score;
        autoCountDisplay.textContent = autoCount;
        autoCostDisplay.textContent = autoCost;

        // 残高チェック
        checkFunds();
        // セーブ
        saveGame();
    }
});

// ④ 毎秒自動でスコアが増える魔法のタイマー
setInterval( () => {
    // もし装置を1台以上持っていたら
    if ( autoCount > 0) {
        // 装置の数だけスコアを増やす
        score = score + autoCount;
        // 画面のスコアを更新する
        scoreDisplay.textContent = score;

        // 残高チェック
        checkFunds();
        // セーブ
        saveGame();
    }
}, 1000); // 1000ミリ秒 ＝ 1秒ごとにこの中の処理を繰り返す

// ⑤ 資金（スコア）が足りているかチェックして、ボタンのON/OFFを切り替える関数
function checkFunds() {
    if ( score >= autoCost) {
        buyAutoBtn.disabled = false;
    } else {
        buyAutoBtn.disabled = true;
    }
}

// ⑥ 現在の資産状況をブラウザに保存する（記帳する）関数
function saveGame() {
    localStorage.setItem( 'myScore', score);
    localStorage.setItem( 'myAutoCount', autoCount);
    localStorage.setItem( 'myAutoCost', autoCost);
}

// ⑦ 保存されたデータを読み込む関数
function loadGame() {
    const savedScore = localStorage.getItem( 'myScore');

    // もしデータが保存されていれば（初めてのプレイでなければ）読み込む
    if ( savedScore !== null) {
        // LocalStorageはデータを「文字」として保存してしまうため、parseIntで「数値」に変換して戻す
        score = parseInt( localStorage.getItem( 'myScore'));
        autoCount = parseInt( localStorage.getItem( 'myAutoCount'));
        autoCost = parseInt( localStorage.getItem( 'myAutoCost'));

        // 読み込んだデータで画面の表示を更新する
        scoreDisplay.textContent = score;
        autoCountDisplay.textContent =autoCount;
        autoCostDisplay.textContent = autoCost;
    }
}

// ⑧ ページを開いたときに、ロードと資金チェックを実行する
loadGame();
// 最初にページを開いたときにも1回チェックしておく
checkFunds();

// ⑨ リセットボタンの処理
const resetBtn = document.getElementById( 'reset-btn');

resetBtn.addEventListener( 'click', () => {
    // ブラウザ標準の「確認ポップアップ」を出す
    // 「OK」なら true、「キャンセル」なら false が isSure という箱に入ります
    const isSure = confirm( "本当にすべてのデータを消去して最初からやり直しますか？");

    // もし（if）プレイヤーが「OK」を押したときだけ、以下の初期化処理を行う
    if ( isSure) {
        // 1. 金庫（LocalStorage）のデータを消去する
        localStorage.removeItem( 'myScore');
        localStorage.removeItem( 'myAutoCount');
        localStorage.removeItem( 'myAutoCost');
        // 2. 裏側のデータ（変数）を最初の状態に戻す
        score = 0;
        autoCount = 0;
        autoCost = 10;
        // 3. 表側の見た目（HTML）を最初の状態に戻す
        scoreDisplay.textContent = score;
        autoCountDisplay.textContent = autoCount;
        autoCostDisplay.textContent = autoCost;
        // 4. ボタンのON/OFF状態を再チェックする（購入ボタンを灰色に戻す）
        checkFunds();
    }
});

// ⑩ +1エフェクトを画面に生み出す関数
// (x, y) は、マウスがクリックされた画面上の座標（位置）を受け取ります
function createFloatingText( x, y) {
    // 1. 新しい span 要素（文字の箱）を空っぽの状態で作成する
    const floatEL = document.createElement( 'span');
    // 2. 箱の中に「+1」という文字を入れる
    floatEL.textContent = '+1';
    // 3. 先ほどCSSで作った「floating-text」というクラス（デザインとアニメ）をくっつける
    floatEL.className = 'floating-text';
    // 4. マウスの座標に合わせて位置を設定する（少し指の先から出るようにズラしています）
    floatEL.style.left = ( x - 10) + 'px';
    floatEL.style.top = ( y - 20) + 'px';
    // 5. 完成した要素を、画面（body）の中にポンッと追加する
    document.body.appendChild( floatEL);
    // 6. ゴミ箱処理：アニメーションが終わる1秒後（1000ミリ秒後）に、HTMLから削除する
    setTimeout( () => {
        floatEL.remove();
    }, 1000)
}
