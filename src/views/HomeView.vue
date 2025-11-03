<script setup>
import { onMounted, ref, computed } from 'vue';
import { useTodoStore } from '@/stores/todo';
import { RouterLink } from 'vue-router';
import Loading
 from '@/components/Loading.vue';

const todoStore = useTodoStore();
const todoText = ref('');
const isLoading = ref(false);
const selectedStatus = ref("Pending");

const filterTodoList = computed( () => {
    return todoStore.list.filter((todo) => todo.status == selectedStatus.value)
    // ดักจีบ selectedStatus โดยให้ filter ผ่าน todo.status
})

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

const changeStatus = async (event, todoId) => {
    isLoading.value = true;
    console.log(event.target.checked)
    // Checklist ถ้ามีการติ้กเกิดขึ้น
    try {
        if (event.target.checked) {
            // ถ้าเช็คแล้วเป็น Done
            await todoStore.editTodo({status: 'Done'}, todoId)
        } else {
            // ถ้าเช็คแล้วเป็นอย่างอื่น
            await todoStore.editTodo({status: 'Doing'}, todoId )
        }
        await todoStore.loadTodos();
        isLoading.value = false;
    } catch(error) {
        console.error('error', error)
    }
}

const changeSelectedStatus = async (newStatus) => {
    selectedStatus.value = newStatus; // newStatus จะกลับไปเลือก status ใน v-for ที่กำลังวนลูปอยู่
}

</script>

<template>  
    <div class="my-5">
        <div class="my-5">
            <div class="flex gap-3">
                <input class="input input-bordered" placeholder="Add To do list..." v-model="todoText">
                <button class="btn btn-primary rounded-lg ml-2" @click="addTodo(todoText)">Add</button>    
            </div>
            <Loading v-if="isLoading">
            </Loading>
            <div class="tabs tabs-box mt-4  ">
                <a 
                    v-for="status in todoStore.statuses"
                    :class="status === selectedStatus ? 'tab tab-active bg-primary duration-300 ' : 'tab duration-300'"
                    @click="changeSelectedStatus(status)">
                    {{ status }}
                </a>
            </div>
            <div class="my-3">
                <!-- v-for ไปวนลูปใน filterTodoList ที่มีการเช็ค value ของ status แต่ละตัวที่ส่งเข้ามาแทน -->
                <div class="justify-between flex items-center mt-2" v-for="todo in filterTodoList" :key="todo.id">
                    <!-- Check box -->
                    <div>   
                        <!-- status === "Done" ให้ติ้กถึก -->   
                        <input type="checkbox" :checked="todo.status === 'Done'" class="checkbox" 
                            @change="changeStatus($event, todo.id)"
                        />
                    </div>
                    <div :class="todo.status === 'Done' ? 'line-through' : '' ">
                        <!-- condition ? true : false -->
                        {{ todo.name }}
                    </div>
                    <div>
                        <RouterLink :to="{name: 'todo-edit', params: { id: todo.id }}">
                            <button class="ml-2 btn btn-square btn-outline">
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/></svg>
                            </button>
                        </RouterLink>
                        <button class="btn btn-square btn-outline ml-2" @click="removeTodo(todo.id)">
                            <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 640 640"><path d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z"/></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
svg{
   fill: white; 
}
</style>