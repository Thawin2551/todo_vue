<script setup>
import { useTodoStore } from '@/stores/todo';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const todoStore = useTodoStore();
const todoId = ref(-1);
const route = useRoute();
const isLoaded = ref(false)

onMounted(async () => {
    console.log(`Edit Todo id: ${route.params.id} Page`)
    await todoStore.loadTodo(route.params.id)
    isLoaded.value = true
    todoId.value = parseInt(route.params.id)
})

const editTodo = async (selectedTodo) => {
    try {
        const bodyData = {
            name: selectedTodo.name,
            status: selectedTodo.status
        }
        await todoStore.editTodo(bodyData, todoId.value)
        alert('edit complete !!')
    } catch(error) {
        console.error('error', error)
    }
} 

</script>

<template>
    <div>
        <h1>Edit </h1>
        <div v-if="isLoaded">
            <h2>id {{ todoId }}</h2>
            <span style="color: green; font-size: 20px;">Current name:</span>
            {{ todoStore.selectedTodo.name }}
            <br></br>
            <span style="color: red; font-size: 20px">Edit name:</span>
            <input type="text" v-model="todoStore.selectedTodo.name" style="border-width: 5px;">
            
            <div>
                status
                <!-- เข้าถึง status ของแต่ละค่าในขณะนั้น -->
                <select v-model="todoStore.selectedTodo.status">
                    <option>
                        Select Status
                    </option>
                    <option v-for="status in todoStore.statuses" :value="status">
                        {{ status }}
                    </option>
                </select>
                <br></br>
                <!-- edit button --> 
                <button @click="editTodo(todoStore.selectedTodo)">
                    Edit
                </button>
            </div>

        </div>
        <div v-else>
            <h1>Loading ...</h1>
        </div>

        <RouterLink :to="{ name: 'home' }">
            <button>
                Back to home
            </button>
        </RouterLink>
    </div>
</template>