<template>
  <div :class="{ 'bg-gray-800 text-white': isDarkMode, 'bg-white text-black': !isDarkMode }" class="container mx-auto px-4 py-6 min-h-screen">
    <h1 class="text-2xl font-bold mb-4">Task List</h1>

    <div class="flex flex-col md:flex-row md:justify-between">
      <!-- Task name input -->
      <input
        v-model="newTask.title"
        type="text"
        placeholder="Add a new task"
        class="border border-gray-300 p-2 mb-4 md:mb-0 md:mr-4 w-full md:w-2/3"
      />

      <!-- Deadline datetime picker -->
      <input
        v-model="newTask.deadline"
        type="datetime-local"
        class="border border-gray-300 p-2 mb-4 md:mb-0 md:mr-4"
      />

      <!-- Add Task Button -->
      <button
        @click="addTask"
        class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Add Task
      </button>
    </div>

    <table class="min-w-full pt-6">
      <thead>
        <tr>
          <th class="w-auto"></th> <!-- Columna vacía para el checkbox -->
          <th class="w-2/3 text-left px-4 py-2">Task</th>
          <th class="text-left px-4 py-2">Deadline</th>
          <th class="text-left px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in tasks" :key="task.id" class="border-b">
          <td class="w-auto">
            <input type="checkbox" v-model="task.completed" @click="completeTask(task.id)" />
          </td>
          <td :class="{ 'line-through': task.completed }" class="w-2/3 px-4 py-2">{{ task.title }}</td>
          <td class="px-4 py-2">{{ formattedDate(task.deadline) }}</td>
          <td class="px-4 py-2">
            <button @click="deleteTask(task.id)" class="text-red-500 hover:text-red-700">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>


    <!-- Archives Section -->
    <div class="mt-8">
      <button 
        @click="fetchArchives"
        class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
      >
        Show Archives
      </button>
      <h2 class="text-xl font-semibold mt-4">Archives</h2>
      <ul class="mt-4">
        <li
          v-for="archive in archives"
          :key="archive.id"
          class="flex items-center justify-between border-b py-2"
        >
          <div class="flex items-center">
            <input
              type="checkbox"
              v-model="archive.completed"
              class="mr-2"
              disabled
            />
            <span :class="{ 'line-through': archive.completed }">{{ archive.title }}</span>
          </div>
          <span class="text-gray-500">{{ formattedDate(new Date(archive.deadline), 'MMMM d, yyyy h:mm a') }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { taskService } from '../services/task.service';
import { format } from 'date-fns'
import { ref } from 'vue';

export default {
  name: 'TaskList',
  setup() {
    const tasks = ref([]);
    const newTask = ref({ title: '' });
    const archives = ref([]);

    // Function to get the current date at 18:00
    const setDefaultDeadline = () => {
      const now = new Date();
      now.setHours(15, 0, 0, 0); // Set to 18:00:00
      return now.toISOString().slice(0, 16); // Format for datetime-local input
    };

    // Set the default deadline when the component is mounted
    newTask.value.deadline = setDefaultDeadline();
    
    const fetchTasks = async () => {
      try {
        const responseData = await taskService.getTasks();
        console.log('Raw response data:', responseData); // Log the raw response data
        tasks.value = responseData; // Set the reactive variable
        console.log('Tasks after fetching:', tasks.value); // Log the tasks after fetching
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    const fetchArchives = async () => {
      try {
        const responseData = await taskService.getArchives(); // Call the service to fetch archives
        archives.value = responseData; // Set the archived tasks
        console.log('Archived tasks:', archives.value); // Log the archived tasks
      } catch (error) {
        console.error('Error fetching archives:', error);
      }
    };

    const addTask = async () => {
      if (newTask.value.title.trim()) {
        await taskService.createTask(newTask.value);
        newTask.value.title = '';
        fetchTasks();
      }
    };

    const deleteTask = async (id) => {
      await taskService.deleteTask(id);
      fetchTasks();
    };

    const completeTask = async (id) => {
      await taskService.completeTask(id);
      fetchTasks();
    };

    const formattedDate = (date) => {
      return format(new Date(date), 'MMMM d, yyyy h:mm a');
    };


    fetchTasks();

    return { tasks, newTask, addTask, deleteTask, completeTask, archives, formattedDate, fetchArchives, setDefaultDeadline };
  },
};
</script>

<style scoped>
.line-through {
  text-decoration: line-through;
}
</style>
