import { defineStore } from 'pinia'
import axios from 'axios'

const BASE_URL = 'https://6905ba4bee3d0d14c13382e9.mockapi.io'

export const useTodoStore = defineStore('todo', {
  state: () => ({
    list: [],
    selectedTodo: {},
    statuses: ['Pending', 'Doing', 'Done']
  }),
  // actions ใน store เก็บ Method ต่างๆไว้ (โดยที่ method คือ function)
  actions: {

    // load All
    async loadTodos() {
      try {
          const res = await axios.get(`${BASE_URL}/todos`)
          this.list = res.data // เพิ่มกลับเข้าไปใน list
          console.log(res.data)
          console.log('Load Todos All Complete')
      } catch(error) {
        console.error('erroror', error)
      }
    },

    // load todo id
    async loadTodo(id) {
      try {
        const res = await axios.get(`${BASE_URL}/todos/${id}`)
        this.selectedTodo = res.data
        console.log(`Load todos id: ${id} complete`)
      } catch {
        console.error('error', error)
      }
    },

    // add todo
    async addTodo(todoText) { // status แรกสุดควรจะเป็น pending คือรอก่อนจะเปลี่ยนเป็น doing done
      // data ที่จะเพิ่มเข้าไปใน Todo
      const bodyData = {
        name: todoText,
        status: 'Pending'
      }
      try {
        const res = await axios.post(`${BASE_URL}/todos`, bodyData)
        this.list.push(res.data)
        console.log(res.data)
        console.log('Add Todo compelte')
      } catch(error) {
        console.error('error', error)
      }
    },
    
    // edit todo แค่เฉพาะ id ที่เราอยากจะเข้าไป edit
    async editTodo(todoData, id) { // แก้ไขแค่ name กับ status
      try {
        const res = await axios.put(`${BASE_URL}/todos/${id}`, todoData)
        console.log(res.data)
        console.log('Edit todo complete')
      } catch(error) {
        console.error('error', error)
      }
    },

    // remove todo
    async removeTodo(id) {
      try {
        const res = await axios.delete(`${BASE_URL}/todos/${id}`)
        console.log(res.data)
        console.log('Remove todo Complete')
      } catch(error) {
        console.error('error', error)
      }
    }
  }
})
