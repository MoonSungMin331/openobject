<template>
  <div class="todo-list">
    <h1>Todo List</h1>
    <input v-model="newTodo" @keyup.enter="addTodo" placeholder="Add a new todo" />
    <ul>
      <li v-for="todo in todos" :key="todo.id">
        <input type="checkbox" :checked="todo.isEditing" @change="toggleEditing(todo)" />
        <span v-if="!todo.isEditing">{{ todo.text }}</span>
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
      if (this.newTodo.trim() === '') return;
      try {
        const response = await axios.post('http://localhost:3000/api/todos', { text: this.newTodo });
        this.todos.push({ ...response.data, isEditing: false, editText: response.data.text });
        this.newTodo = '';
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    },
    toggleEditing(todo) {
      todo.isEditing = !todo.isEditing;
      if (todo.isEditing) {
        todo.editText = todo.text;
      } else {
        this.saveTodoText(todo);
      }
    },
    async saveTodoText(todo) {
      if (todo.editText !== todo.text) {
        try {
          await axios.put(`http://localhost:3000/api/todos/${todo.id}/text`, { text: todo.editText });
          todo.text = todo.editText;
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
    }
  }
};
</script>

<style>
.todo-list input[type="text"] {
  width: 80%;
}
</style>