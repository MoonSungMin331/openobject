<template>
  <div class="todo-list">
    <h1>Todo List</h1>
    <input v-model="newTodo" @keyup.enter="addTodo" placeholder="오늘의 할일" />
    <ul>
      <li v-for="todo in todos" :key="todo.id" :class="{ completed: todo.completed }">
        <input type="checkbox" v-model="todo.completed" @change="toggleCompletion(todo)" />
        <span v-if="!todo.isEditing" @dblclick="toggleEditing(todo)">{{ todo.text }}</span>
        <input v-else v-model="todo.editText" @keyup.enter="saveTodoText(todo)" @blur="saveTodoText(todo)" />
        <button @click="deleteTodo(todo.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      todos: [],
      newTodo: ''
    };
  },
  created() {
    this.fetchTodos();
  },
  methods: {
    async fetchTodos() {
      try {
        const response = await axios.get('http://localhost:3000/api/todos');
        this.todos = response.data.map(todo => ({ ...todo, isEditing: false, editText: todo.text }));
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    },
    async addTodo() {
      const trimmedTodo = this.newTodo.trim();
      if (trimmedTodo.length < 3) {
        alert('최소 글자 길이는 3글자입니다.');
        return
      }
      try {
        const response = await axios.post('http://localhost:3000/api/todos', { text: trimmedTodo });
        this.todos.push({ ...response.data, isEditing: false, editText: response.data.text, completed: false });
        this.newTodo = '';
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    },
    toggleEditing(todo) {
      todo.isEditing = !todo.isEditing;
      if (todo.isEditing) {
        todo.editText = todo.text;
      }
    },
    async saveTodoText(todo) {
      const trimmedEditText = todo.editText.trim();
      if (trimmedEditText.length < 3) {
        alert('수정된 텍스트 길이가 3글자 이하입니다.');
        return;
      }
      if (trimmedEditText !== todo.text) {
        try {
          await axios.put(`http://localhost:3000/api/todos/${todo.id}/text`, { text: trimmedEditText });
          todo.text = trimmedEditText;
        } catch (error) {
          console.error('Error updating todo text:', error);
        }
      }
      todo.isEditing = false;
    },
    async deleteTodo(id) {
      try {
        await axios.delete(`http://localhost:3000/api/todos/${id}`);
        this.todos = this.todos.filter(todo => todo.id !== id);
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    },
    async toggleCompletion(todo) {
      try {
        await axios.put(`http://localhost:3000/api/todos/${todo.id}/completed`, { completed: todo.completed });
      } catch (error) {
        console.error('Error updating todo completed status:', error);
      }
    }
  }
};
</script>

<style>
.todo-list ul {
  list-style-type: none;
  padding: 0;
}

.todo-list li {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.todo-list input[type="text"] {
  width: 80%;
  margin-right: 8px;
}

.todo-list input[type="checkbox"] {
  margin-right: 8px;
}

.completed span {
  text-decoration: line-through;
  opacity: 0.3;
}
</style>

