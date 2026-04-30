 1. Install package
Run this command to install the required dependencies.
Details:
npm install @supabase/supabase-js
Code:
File: Code
```
npm install @supabase/supabase-js
```

2. Add files
Copy the following code into your project.
Code:
File: .env.local
```
VITE_SUPABASE_URL=https://fxxsyzfakknsgtjqcsxg.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_4XRsYiVygNn5Q-TYTeyVKQ_QXb2LMZr
```

File: utils/supabase.ts
```
1import { createClient } from "@supabase/supabase-js";
2
3const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
4const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
5
6export const supabase = createClient(supabaseUrl, supabaseKey);
```

File: App.vue
```
1<script setup>
2  import { ref, onMounted } from 'vue'
3  import { supabase } from '../utils/supabase'
4  
5  const todos = ref([])
6
7  async function getTodos() {
8    const { data } = await supabase.from('todos').select()
9    todos.value = data
10  }
11
12  onMounted(() => {
13    getTodos()
14  })
15
16</script>
17
18<template>
19  <ul>
20    <li v-for="todo in todos" :key="todo.id">{{ todo.name }}</li>
21  </ul>
22</template>
```

3. Install Agent Skills (Optional)
Agent Skills give AI coding tools ready-made instructions, scripts, and resources for working with Supabase more accurately and efficiently.
Details:
npx skills add supabase/agent-skills
Code:
File: Code
```
npx skills add supabase/agent-skills
```