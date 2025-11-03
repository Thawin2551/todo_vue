<script setup>
import { useTodoStore } from '@/stores/todo';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import Loading from '@/components/Loading.vue';

const todoStore = useTodoStore();
const todoId = ref(-1);
const route = useRoute();
const isLoaded = ref(false)
const isUpdated = ref(false);

onMounted(async () => {
    console.log(`Edit Todo id: ${route.params.id} Page`)
    await todoStore.loadTodo(route.params.id)
    isLoaded.value = true
    todoId.value = parseInt(route.params.id)
})

const editTodo = async (selectedTodo) => {
    try {
        isLoaded.value = false;
        const bodyData = {
            name: selectedTodo.name,
            status: selectedTodo.status
        }
        await todoStore.editTodo(bodyData, todoId.value)
        isUpdated.value = true;
        isLoaded.value = true;
        // อีก 3 วิให้ isUpdate กลับมาเป็นค่า false message successful จะได้หายไป
        setTimeout(() => {
            isUpdated.value = false 
        }, 3000)
    } catch(error) {
        console.error('error', error)
    }
} 

</script>

<template>
    <div class="py-20 mx-auto w-1/2">
        <div class="toast toast-top toast-center">
            <div  v-if="isUpdated" class="alert alert-success duration-300">
                <span>Message sent successfully.</span>
            </div>
        </div>

        <h1 class="font-semibold text-3xl">Edit Page </h1>
        <div v-if="isLoaded">
            <div class="mt-2 items-center flex">
                ID<div class="badge badge-neutral opacity-50 ml-2">{{ todoId }}</div>
            </div>
    
            
            <div class="form-control w-full">
                <fieldset class="fieldset">
                    <legend class="fieldset-legend">Your name</legend>
                    <input class="h-8 input input-bordered w-full" 
                    placeholder="Edi your name..." 
                    v-model="todoStore.selectedTodo.name"></input>
                </fieldset>
            </div>
            <div class="form-control w-full flex flex-col gap-2 mt-2">
                <label class="label">
                    <span class="label-text">Status</span>
                </label>
                <select class="select selected-bordered w-full" v-model="todoStore.selectedTodo.status">
                    <option>Select Status</option>
                        <option
                        v-for="status in todoStore.statuses"
                        :value="status"
                        >
                        {{ status }}
                    </option>
                </select>
            </div>
            
            <div class="flex flex-col gap-2.5 mt-7">
                <button class="btn btn-primary" @click="editTodo(todoStore.selectedTodo) ">
                    Edit
                </button>
                
                <RouterLink :to="{ name: 'home' }">
                    <button class="btn btn-active w-full ">
                            <h2>Back</h2>
                    </button>
                </RouterLink>
            </div>
    </div>
    <div v-else>
        <Loading></Loading>
    </div>
    </div>
</template>
