/**
 * グラフ領域内にGoogle Chartを用いて線グラフを描画します。
 * @param {string} chart_div 描画を行うdivタグid
 * @return {object} [描画用chart, 処理データ, オプション]
 */
async function graphInitialize(chart_div) {
    await google.charts.load('current', {packages: ['corechart', 'line']});
    const data = new google.visualization.DataTable();
    data.addColumn('number', '経過フレーム');
    data.addColumn('number', '突き');
    data.addColumn('number', '回し蹴り');
    data.addColumn('number', '正蹴り');

    const options = {
        chartArea: {width: '70%'},
        legend: {position: 'bottom'},
        curveType: 'function',
        vAxis: {
            viewWindowMode: 'explicit',
            viewWindow: {
                max: 1,
                min: 0
            }
        }
    };

    const chart = new google.visualization.LineChart(document.getElementById(chart_div));
    return [chart, data, options];
}

/**
 * グラフデータに新しいデータを追加します。
 * @param graph_var graphInitializeで取得した変数
 * @param add_data 追加するデータ
 * @param val 追加するx軸
 */
function addGraphData(graph_var, add_data, val) {
    let re = [val];
    re = re.concat(add_data)
    re.pop();
    graph_var[1].addRows([re]);
    graph_var[0].draw(graph_var[1], graph_var[2]);
}

// 初期状態を定義
function ResetStyle() {
    if (_Switch[0]) {
        document.getElementById("bone-option-icon").className = "fas fa-angle-up";
        document.getElementById("bone-option").style.display = "table-row-group";
    } else {
        document.getElementById("bone-option-icon").className = "fas fa-angle-down";
        document.getElementById("bone-option").style.display = "none";
    }
    if (_Switch[1]) {
        document.getElementById("dnn-option-icon").className = "fas fa-angle-up";
        document.getElementById("dnn-option").style.display = "table-row-group";
    } else {
        document.getElementById("dnn-option-icon").className = "fas fa-angle-down";
        document.getElementById("dnn-option").style.display = "none";
    }
    ChangeCustomOption();
    ChangeShuffleOption();
    InitializeEditor();
}

// カスタムエディタを初期化
function InitializeEditor() {
    editor_a.setTheme("ace/theme/chrome");
    editor_a.getSession().setMode("ace/mode/javascript");
    editor_a.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        fontSize: "14px"
    });
    editor_a.$blockScrolling = Infinity;
}

// 設定変更時に表示非表示を切り替える
function ChangeCustomOption() {

    function ChangeGroup(custom, my_model) {
        document.getElementById("custom-option1").style.display = custom ? "table-row" : "none";
        document.getElementById("custom-option2").style.display = custom ? "table-row" : "none";
        document.getElementById("custom-option4").style.display = custom ? "table-row" : "none";
        document.getElementById("custom-option5").style.display = custom ? "table-row" : "none";
        document.getElementById("custom-option6").style.display = custom ? "table-row" : "none";
        document.getElementById("custom-option7").style.display = custom ? "table-row" : "none";
        document.getElementById("my-data-option1").style.display = my_model ? "table-row" : "none";
        document.getElementById("my-data-option2").style.display = my_model ? "table-row" : "none";
        document.getElementById("my-data-option3").style.display = my_model ? "table-row" : "none";
        // カスタムのテストデータを使用する場合は表示
        document.getElementById("custom-option3-1").style.display = !document.getElementById("custom_valid").checked && custom ? "table-row" : "none";
        document.getElementById("custom-option3-2").style.display = document.getElementById("custom_valid").checked && custom ? "table-row" : "none";
        // 注意事項を表示
        document.getElementById("custom_caution").style.display = custom ? "block" : "none";
    }

    document.getElementById("posenet-option").style.display = _poseParam.model.value === "pose_net" ? "table-row" : "none";

    switch (document.getElementById("dnn_model").value) {
        case "my_model":
            ChangeGroup(false, true);
            break;
        case "custom":
            ChangeGroup(true, false);
            break;
        default:
            ChangeGroup(false, false);
    }
}

// 設定変更時に表示非表示を切り替える
function ChangeShuffleOption() {
    document.getElementById("data_shuffle_comp_visible").style.display = document.getElementById("data_shuffle").checked ? "grid" : "none";
    document.getElementById("data_shuffle_comp_count_visible").style.display = document.getElementById("data_shuffle_comp").checked ? "grid" : "none";
    document.getElementById("model_comp_visible").style.display = document.getElementById("comp_model").checked ? "grid" : "none";
}

// プレビュー画面を初期化
function ResetPreviewVision() {
    _inputVideo.src = "";
    let defBG = new Image();
    defBG.src = "Assets/Default_BG.png";
    defBG.onload = () => { // 画像を読み込んだ後でないと反応しないのでonloadで発火させる。
        _Canvas.preview.width = defBG.width;
        _Canvas.preview.height = defBG.height;
        _Ctx.preview.drawImage(defBG, 0, 0);
    }
}

// アップロード時の映像をプレビュー
function previewVidData() {
    document.getElementById("vid-file-prv-area").style.display = "block"; // プレビュー画像を表示
    document.getElementById("vid-file-prv-area").src = window.URL.createObjectURL(vid_file.files[0]); // プレビュー画像のソースをinputから取得
    document.getElementById("vid-upload-icon").style.display = "none";
    document.getElementById("vid_file_name").innerHTML = vid_file.files[0].name; // アップロード指示の文章をファイル名に変換
    document.getElementById("vid_file_name").style.color = "black"; // 変換したファイル名を黒文字に変更
    document.getElementById("vid_file_name_sub").innerHTML = "";
    _inputVideo.src = window.URL.createObjectURL(vid_file.files[0]); // 処理用の動画フレームにソースを入れる
    _statusText.main.innerHTML = "動画アップロード完了。処理実行をクリックしてください。";
}

// 入力フィールドを無効・有効化
function ChangeInputAvailability(c) {
    document.getElementById("send_data").disabled = c;
    _poseParam.model.disabled = c;
    _poseParam.stride.disabled = c;
    _poseParam.quant.disabled = c;
    _poseParam.input_res.disabled = c;
    _poseParam.flame_stride.disabled = c;
    _poseParam.threshold.disabled = c;
    document.getElementById("input_threshold_slider").disabled = c;
    document.getElementById("dnn_model").disabled = c;
    document.getElementById("architecture_model").disabled = c;
    document.getElementById("custom_data_file").disabled = c;
    document.getElementById("custom_valid_file").disabled = c;
    if (c) {
        document.getElementById("send_data").title = "";
    } else {
        document.getElementById("send_data").title = "技の予測を開始します";
    }
}

// セレクタでの必要出力層数を定義させる
function CheckOutputSelector() {
    let OutputLayers = 1
    OutputLayers *= document.getElementById("sel-1").checked ? 4 : 1;
    OutputLayers *= document.getElementById("sel-2").checked ? 2 : 1;
    OutputLayers *= document.getElementById("sel-3").checked ? 2 : 1;
    OutputLayers *= document.getElementById("sel-4").checked ? 2 : 1;
    document.getElementById("output_layer_num").innerText = "必要な出力層数：" + String(OutputLayers);
}

// セレクタ変更時のイベントリスナーを定義
document.getElementById("sel-1").addEventListener('change', () => CheckOutputSelector());
document.getElementById("sel-2").addEventListener('change', () => CheckOutputSelector());
document.getElementById("sel-3").addEventListener('change', () => CheckOutputSelector());
document.getElementById("sel-4").addEventListener('change', () => CheckOutputSelector());

// ランダムチェックを入れるとシード連続学習の選択肢を有効化
document.getElementById("data_shuffle").addEventListener('change', () => ChangeShuffleOption());
document.getElementById("data_shuffle_comp").addEventListener('change', () => ChangeShuffleOption());
document.getElementById("comp_model").addEventListener('change', () => ChangeShuffleOption());

/* ドラッグ&ドロップ処理エリア */
// ファイルドラッグ
document.getElementById("vid-upload-area").addEventListener('dragover', (e) => {
    e.preventDefault();
    document.getElementById("vid-upload-area").classList.add('dragover');
});
// ドラッグアウト
document.getElementById("vid-upload-area").addEventListener('dragleave', (e) => {
    e.preventDefault();
    document.getElementById("vid-upload-area").classList.remove('dragover');
});
// ドロップ
document.getElementById("vid-upload-area").addEventListener('drop', (e) => {
    e.preventDefault();
    document.getElementById("vid-upload-area").classList.remove('dragover');

    if (~e.dataTransfer.files[0].type.indexOf("video")) {
        // ドロップしたファイルをinput[type=file]へ
        vid_file.files = e.dataTransfer.files;
        // プレビュー画像の表示処理
        previewVidData();
    } else {
        // 動画ファイル以外だった場合の対処
        ResetPreviewVision();
        document.getElementById("vid-file-prv-area").style.display = "none"; // プレビュー画像を表示
        document.getElementById("vid-upload-icon").style.display = "inline";
        document.getElementById("vid-upload-icon").style.textAlign = "center";
        document.getElementById("vid_file_name").innerHTML = "[ERROR 01]アップロードされたファイルが動画ファイルではありません"; // アップロード指示の文章をファイル名に変換
        document.getElementById("vid_file_name_sub").innerHTML = ""; // アップロード指示の文章をファイル名に変換
        document.getElementById("vid_file_name").style.color = "red"; // 変換したファイル名を黒文字に変更
    }

});
// 動画ファイル選択
vid_file.addEventListener('change', () => {
    previewVidData();
});
// カスタムアップロードボタン
document.getElementById("upload-btn").addEventListener('click', () => {
    vid_file.click();
});

/* 設定項目関連 */
// PoseNetを選択したか否かで表示を変化させる
_poseParam.model.addEventListener('change', () => ChangeCustomOption());
document.getElementById("dnn_model").addEventListener('change', () => ChangeCustomOption());
document.getElementById("custom_valid").addEventListener('change', () => ChangeCustomOption());
// ラベルクリック時に発火（骨格サイド）
document.getElementById("bone-option-label").addEventListener('click', function () {
    if (_Switch[0]) {
        document.getElementById("bone-option-icon").className = "fas fa-angle-down";
        document.getElementById("bone-option").style.display = "none";
        _Switch[0] = false;
    } else {
        document.getElementById("bone-option-icon").className = "fas fa-angle-up";
        document.getElementById("bone-option").style.display = "table-row-group";
        _Switch[0] = true;
    }
});
// ラベルクリック時に発火（DNNサイド）
document.getElementById("dnn-option-label").addEventListener('click', function () {
    if (_Switch[1]) {
        document.getElementById("dnn-option-icon").className = "fas fa-angle-down";
        document.getElementById("dnn-option").style.display = "none";
        _Switch[1] = false;
    } else {
        document.getElementById("dnn-option-icon").className = "fas fa-angle-up";
        document.getElementById("dnn-option").style.display = "table-row-group";
        _Switch[1] = true;
    }
});
// スライダーと数字を同期
document.getElementById("input_threshold_slider").addEventListener("input", () => {
    _poseParam.threshold.value = document.getElementById("input_threshold_slider").value;
});
_poseParam.threshold.addEventListener("input", () => {
    document.getElementById("input_threshold_slider").value = _poseParam.threshold.value;
});