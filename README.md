# OPENOBJECT-TODO-LIST

MySql + Vue.js를 사용한 todo-list.

## 프로젝트 소개

백엔드를 구현해보기 위해 간단하게 제작했습니다.

## 프로젝트 구성

todo-list-backend : MySql DB연동, CRUD 기능이 구현된 백엔드 폴더.
todo-list-frontend : DB연동확인 및 테이블 조회를 위한 메인화면.

## 개발환경

프로그래밍 언어 : JavaScript(Node.js)
프레임워크 : Express.js, Vue.js
데이터베이스 : MySql
코드 에디터 : Visual Studio Code 

## 주요기능

CRUD : Mysql DB 와 연결이 잘되어있는지 확인할 수 있도록 테이블 조회 기능을 server.js에 제작.

```
//테이블 조회
app.get('/api/todos', (req, res) => {
  connection.query('SELECT * FROM todos', (error, results, fields) => {
    if (error) {
      console.error('Error fetching todos: ', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});

//테이블 값 추가
app.post('/api/todos', (req, res) => {
  const { text } = req.body;
  connection.query('INSERT INTO todos (text) VALUES (?)', [text], (error, results, fields) => {
    if (error) {
      console.error('Error creating todo: ', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.status(201).json({ id: results.insertId, text: text });
  });
});

//테이블 값 수정
app.put('/api/todos/:id/text', (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  connection.query('UPDATE todos SET text = ? WHERE id = ?', [text, id], (error, results, fields) => {
    if (error) {
      console.error('Error updating todo text: ', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.status(200).json({ message: 'Todo text updated successfully' });
  });
});

//테이블 값 삭제
app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM todos WHERE id = ?', [id], (error, results, fields) => {
    if (error) {
      console.error('Error deleting todo: ', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.status(200).json({ message: 'Todo deleted successfully' });
  });
});

``` 
