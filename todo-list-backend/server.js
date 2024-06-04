const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3000;

// MySQL 연결 설정 (본인이 사용하는 설정에 맞춰서 적을것.)
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'username', // MySQL 유저 이름
  password: 'password', // MySQL 비밀번호
  database: 'database' // MySQL 데이터베이스 이름
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database: ', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// 데이터베이스 테이블 생성
const createTodoTableQuery = `
  CREATE TABLE IF NOT EXISTS todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    text VARCHAR(12) NOT NULL 
  )
`; //text << 최대 255자에서 12자로 줄임.

connection.query(createTodoTableQuery, (err, results, fields) => {
  if (err) {
    console.error('Error creating todos table: ', err);
    return;
  }
  console.log('Todos table created successfully');
});

// 미들웨어 설정
app.use(bodyParser.json());
app.use(cors());

// API 라우트
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

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
