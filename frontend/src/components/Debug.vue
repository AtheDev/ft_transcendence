<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
  getAllMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch
} from '../services/matchRequests';
import { Get, Post, Patch, Delete } from '@/services/requests';

import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import type { User } from '@/models/user.model';

// Request url to API
const urlUser = 'http://localhost:3000/users';
const urlMatch = 'http://localhost:3000/matches';

// List of all users
const userStore = useUserStore();
const { users } = storeToRefs(userStore);
// List of all Matches
const dataMatches: any = ref(null);

// Single user
const user = ref<User | null>(null);
// Single match
const match: any = ref({});

// Track forms inputs
const input = ref({
  search: '',
  create: '',
  update: '',
  user_id: '',
  match_id: '',
  p1: '',
  p2: '',
  s1: '',
  s2: '',
  update_match_id: '',
  update_p1: '',
  update_p2: '',
  update_s1: '',
  update_s2: ''
});

function filteredDataMatch(id: string) {
  dataMatches.value = dataMatches.value.filter((t: any) => t.id !== id);
  return dataMatches.value;
}

onMounted(() => {
  Get(urlUser).then(res => (users.value = res.data));
  getAllMatches(urlMatch, dataMatches);
});
</script>

<template>
  <h2 class="debug">Debug</h2>
  <h3 class="title">Tests GET requests to backend API => USER</h3>

  <h4>Get by name</h4>
  <form
    @submit.prevent.trim.lazy="
      Get(urlUser + '?username=' + input.search).then(res => {
        if (res.status == 200) {
          user = res.data[0];
        }
        input.search = '';
      })
    "
    method="GET"
  >
    <label for="name">Username:</label>
    <input v-model="input.search" name="username" type="text" />
    <input type="submit" value="Submit" />
  </form>
  <p>{{ user }}</p>

  <h4>Create User</h4>
  <form
    @submit.prevent.trim.lazy="
      Post(urlUser, { username: input.create }).then(res => {
        if (res.status == 201) {
          userStore.createUser(res.data);
        }
        input.create = '';
      })
    "
    method="POST"
  >
    <label for="name">Username:</label>
    <input v-model="input.create" name="name" type="text" />
    <input type="submit" value="Submit" />
  </form>

  <h4>Update User</h4>
  <form
    @submit.prevent.trim.lazy="
      Patch(urlUser + '/' + input.user_id, {
        username: input.update
      }).then(res => {
        if (res.status == 200) {
          userStore.updateUser(+input.user_id, res.data);
        }
        input.update = '';
        input.user_id = '';
      })
    "
    method="PATCH"
  >
    <label for="id">id:</label>
    <input v-model="input.user_id" name="id" type="text" />
    <label for="name">new username:</label>
    <input v-model="input.update" name="name" type="text" />
    <input type="submit" value="Submit" />
  </form>

  <h4>Get all - id, name</h4>
  <ul v-if="users">
    <li v-for="item in users" :key="item.id">
      Id: {{ item.id }}, Username: {{ item.username }}
      <button
        @click="
          Delete(urlUser + '/' + item.id.toString()).then(res => {
            if (res.status == 200) {
              userStore.deleteUser(item.id);
            }
          })
        "
      >
        delete
      </button>
    </li>
  </ul>
  <p v-else>Not Found</p>

  <h3 class="title">Tests GET requests to backend API => MATCH</h3>

  <h4>Get by id</h4>
  <form
    @submit.prevent.trim.lazy="
      getMatchById(urlMatch + '?id=' + input.match_id, match).then(m => {
        match = m;
        input.match_id = '';
      })
    "
    method="GET"
  >
    <label for="name">Id:</label>
    <input v-model="input.match_id" name="id" type="text" />
    <input type="submit" value="Submit" />
  </form>
  <p>{{ match.data }}</p>

  <h4>Create Match</h4>
  <form
    @submit.prevent.trim.lazy="
      createMatch(
        urlMatch,
        input.p1,
        input.p2,
        Number(input.s1),
        Number(input.s2),
        dataMatches
      ).then(() => {
        input.p1 = '';
        (input.p2 = ''), (input.s1 = ''), (input.s2 = '');
      })
    "
    method="POST"
  >
    <label for="name">Player1:</label>
    <input v-model="input.p1" name="name" type="text" />
    <label for="name">Player2:</label>
    <input v-model="input.p2" name="name" type="text" />
    <label for="name">Score1:</label>
    <input v-model="input.s1" name="name" type="text" />
    <label for="name">Score2:</label>
    <input v-model="input.s2" name="name" type="text" />
    <input type="submit" value="Submit" />
  </form>

  <h4>Update Match</h4>
  <form
    @submit.prevent.trim.lazy="
      updateMatch(
        input.update_match_id,
        input.update_p1,
        input.update_p2,
        input.update_s1,
        input.update_s2,
        urlMatch + '/' + input.update_match_id,
        dataMatches
      ).then(() => {
        input.update_match_id = '';
        input.update_p1 = '';
        input.update_p2 = '';
        input.update_s1 = '';
        input.update_s2 = '';
      })
    "
    method="PATCH"
  >
    <label for="id">id:</label>
    <input v-model="input.update_match_id" name="id" type="text" />
    <label for="name">Player1:</label>
    <input v-model="input.update_p1" name="name" type="text" />
    <label for="name">Player2:</label>
    <input v-model="input.update_p2" name="name" type="text" />
    <label for="name">Score1:</label>
    <input v-model="input.update_s1" name="name" type="text" />
    <label for="name">Score2:</label>
    <input v-model="input.update_s2" name="name" type="text" />
    <input type="submit" value="Submit" />
  </form>

  <h4>Get all - id, playerOne, playerTwo, winner, score</h4>
  <ul v-if="dataMatches">
    <li v-for="item in dataMatches" :key="item.id">
      Id: {{ item.id }}, Player1: {{ item.playerOne }}, Player2:
      {{ item.playerTwo }}, Winner: {{ item.winner }}, Score: {{ item.score }}
      <button
        @click="
          deleteMatch(item.id, urlMatch + '/' + item.id.toString()).then(id =>
            filteredDataMatch('' + id)
          )
        "
      >
        delete
      </button>
    </li>
  </ul>
  <p v-else>Not Found</p>
</template>

<style>
.debug {
  color: red;
}
.title {
  color: blue;
}
</style>
*/
