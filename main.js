// グローバル空間に変数や関数をセットしないために即時関数で閉じ込めている
(() => {
  // - 入力したTodoタスクの一覧を保持する配列を定義する
  //   - 変数名は `todos` とする
  const todos = [];

  // - HTMLのID値を使って以下のDOM要素を取得する
  //   - テキストボックス(input[type="text"])
  //   - 追加ボタン(button要素)
  //   - Todoリストを一覧表示するul要素
  const inputElement = document.getElementById('input-todo-box');
  const addButtonElement = document.getElementById('add-button');
  const ulElement = document.getElementById('todo-list');


  // `pickupTodoFromTextBox関数` を実装する
  // - 実現したい機能
  //   - `input[type="text"]`から文字列を取得する
  //   - 文字列を取得した後は`input[type="text"]`を空にする
  // - 引数
  //   - 無し
  // - 戻り値
  //   - `input[type="text"]`から取得した文字列を返す
  function pickupTodoFromTextBox() {
    const todo = inputElement.value;
    inputElement.value = '';

    return todo;
  }

  // `validateTodo関数` を実装する
  // - 実現したい機能
  //   - テキストが空の時は「何も入力されていません」という文字列をErrorオブジェクトにセットして例外として投げる
  //   - 既に同名のタスクがある場合は「同じ名前のタスクは既に作成されています」という文字列をErrorオブジェクトにセットして例外として投げる
  // - 引数
  //   - todo : 文字列を受け取る。
  // - 戻り値
  //   - 引数で受け取ったtodoをそのまま返す
  function validateTodo(todo) {

    if (todo === '') {
      throw new Error('何も入力されていません');
    }

    todos.forEach(function (arrayElement) {
      if (arrayElement === todo) {
        throw new Error('同じ名前のタスクは既に作成されています');
      }
    });

    return todo;
  }


  // `addTodo関数` を実装する
  // - 実現したい機能
  //   - 引数に受け取ったTodoを配列todosに追加する
  // - 引数
  //   - todo
  // - 戻り値
  //   - 無し
  function addTodo(todo) {
    todos.push(todo);
  }

  // `showTodos関数` を実装する
  // - 実現したい機能
  //   - Todoタスクの一覧を表示している要素を全削除する
  //   - 全削除後、todosに格納されているタスク一覧を表示する
  //   - 各タスクの右に削除ボタンを配置する
  //   - 削除ボタンをクリックしたら後述の「promiseTaskOfDeletingTodo関数」実行する
  // - 引数
  //   - 無し
  // - 戻り値
  //   - 無し
  function showTodos() {

    while (ulElement.firstChild) {
      ulElement.removeChild(ulElement.firstChild);
    }

    todos.forEach(function (todo, index) {
      const liElement = document.createElement('li');
      const taskNumber = index + 1;

      ulElement.appendChild(liElement);

      liElement.textContent = taskNumber + ':' + todo;

      const removeButton = document.createElement('button');
      removeButton.textContent = '削除';
      removeButton.addEventListener('click', (event) => {
        promiseTaskOfDeletingTodo(index);
      });

      liElement.appendChild(removeButton);
    });
  }


  // `deleteTodo関数` を実装する
  // - 実現したい機能
  //   - 配列todosから対応するtodo情報を削除する
  // - 引数
  //   - index : 配列から削除したい要素のインデックス番号
  function deleteTodo(index) {
    todos.splice(index, 1);
  }

  // `promiseTaskOfAddingTodo関数を実装する`
  // - 実現したい機能
  //   - Promiseを使って以下のフローを実現する
  //     - Promise.resolveメソッドでPromiseオブジェクトを作成する
  //     - Promiseのthenにここまでに実装した関数をセットする。(メソッドチェーンの形式実装する)
  //       - 関数をセットする順番は以下の通り
  //         ①. `input[type="text"]` を取得する関数
  //         ②. ①で取得した文字列が配列todosに追加しても良いか事前に検証する関数
  //         ③. ②の検証を通過したタスクを配列todosに追加する関数
  //         ④. ③で配列todosにタスクを追加した後にWebページ上にタスク一覧を表示する関数
  //     - ②の検証で例外が発生したときに、Promiseのcatchを使ってエラーオブジェクトを受け取りメッセージ内容をアラート表示する
  // - 引数
  //   - 無し
  // - 戻り値
  //   - 無し

  function promiseTaskOfAddingTodo() {
    const promise = Promise.resolve();
    promise
      .then(pickupTodoFromTextBox)
      .then(validateTodo)
      .then(addTodo)
      .then(showTodos)
      .catch((error) => {
        alert(error.message);
      });
  }



  // `promiseTaskOfDeletingTodo関数を実装する`
  // - 実現したい機能
  //   - Promiseを使って以下のフローを実現する
  //     - Promise.resolveメソッドでPromiseオブジェクトを作成する。その際にresolveに引数indexを渡す
  //     - Promiseのthenにここまでに実装した関数をセットする(メソッドチェーンの形式実装する)
  //       - 関数をセットする順番は以下の通り
  //         ①. 配列todosから指定した要素を削除する関数
  //         ②. ①で配列todosから指定したタスクを削除した後にWebページ上にタスク一覧を表示する関数
  // - 引数
  //   - index : 配列から削除したい要素のインデックス番号
  // - 戻り値
  //   - 無し
  function promiseTaskOfDeletingTodo(index) {
    const promise = Promise.resolve(index);

    promise
      .then(deleteTodo)
      .then(showTodos);
  }


  // 追加ボタンをクリックしたら `promiseTaskOfAddingTodo` を実行する
  addButtonElement.addEventListener('click', (event) => {
    promiseTaskOfAddingTodo();
  });

})();
