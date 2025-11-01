<script setup>
import { onMounted, ref } from 'vue';
import { useTodoStore } from '@/stores/todo';
import { RouterLink } from 'vue-router';

const todoStore = useTodoStore();
const todoText = ref('');
const isLoading = ref(false);

onMounted(async () => {
    // ก่อนโหลด
    isLoading.value = true
    await todoStore.loadTodos();
    // โหลดเสร็จแล้ว
    isLoading.value = false
    console.log(todoStore.list)
})


// addTodo
const addTodo =  async (todoText) => {
    try {
        isLoading.value = true;
        await todoStore.addTodo(todoText);
        await todoStore.loadTodos();
        isLoading.value = false;
    } catch(error) {
        console.error('error', error)
    }
}

// editTodo
// todoData = ทั้งก้อนข้อมูล
const editStatus = async (todoData, todoId) => {
    try {
        // ข้อมูลที่จะส่งเข้าไปใน editStatus
        isLoading.value = true
        const updateData = {
            name: todoData.name, // เข้าถึง name
            status: todoData.status // เข้าถึง status
        }
        await todoStore.editTodo(updateData, todoId)
        isLoading.value = false
    } catch(error) {
        console.error('error', error)
    }
}

const deleteTodo = async (todoId) => {
    try {
        isLoading.value = true
        await todoStore.removeTodo(todoId)
        await todoStore.loadTodos(todoId)
        isLoading.value = false;
    } catch(error) {
        console.error('error', error)
    }
}


</script>

<template>  
    <div>
        <div>
            <h1>Todo List</h1>
        </div>
            <div v-if="isLoading">
                <h1>Loading . . .</h1>
            </div>
        <div>
            <input type="text" v-model="todoText">
            <button @click="addTodo(todoText)">Add</button>    
        </div>
        <ul>
            <li v-for="todo in todoStore.list">
                id: {{ todo.id }}
                name: {{ todo.name }}
                <select  v-model="todo.status" @change="editStatus(todo, todo.id)">                      
                    <option value="">
                        Select Status
                    </option>                     
                        <option v-for="status in todoStore.statuses" :value="status">
                        {{ status }}
                        </option>
                </select>
                <RouterLink :to="{name: 'todo-edit', params: { id: todo.id }}">
                    <button>edit</button>
                </RouterLink>
                <button @click="deleteTodo(todo.id)">delete</button>
            </li>
        </ul>
    </div>
</template>