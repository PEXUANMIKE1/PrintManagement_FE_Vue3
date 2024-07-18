<template>
  <v-card class="card-custom elevation-12 rounded-lg">
    <v-card-text class="rounded-lg">
      <v-row align-center no-gutters>
        <v-col cols="5">
          <v-text-field
            class="search"
            v-model="search"
            variant="outlined"
            placeholder="Tìm kiếm nhân viên"
            clearable
            prepend-inner-icon="mdi mdi-magnify"
          />
        </v-col>
        <v-col cols="5">
          <v-select
            class="search"
            v-model="search_team"
            variant="outlined"
            label="Lọc theo phòng"
            clearable
            :items="teamNames"
          />
        </v-col>
        <v-col cols="1" class="d-flex align-center justify-center">
          <v-btn variant="outlined" @click="searchUsers">Tìm kiếm</v-btn>
        </v-col>
      </v-row>
      <div class="mt-2"></div>
    </v-card-text>
  </v-card>
    <!-- loading -->
    <v-card-text v-if="loading">
    <v-row class="d-flex justify-center">
      <v-col cols="12" class="text-center">
        <v-progress-circular
          indeterminate
          size="64"
          color="primary"
        ></v-progress-circular>
      </v-col>
    </v-row>
  </v-card-text>
  <!-- show list users -->
  <div v-if="!loading">
    <v-card class="card-custom elevation-12 rounded-lg">
    <v-table fixed-header class="table-custom">
      <thead>
        <tr>
          <th class="text-left" width="300px">Họ và tên</th>
          <th class="text-left" width="300px">Email</th>
          <th class="text-left">Số điện thoại</th>
          <th class="text-left" width="230px">Phòng</th>
          <th class="text-center" width="250px">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginatedUsers" :key="item.name">
          <td>{{ item.fullName }}</td>
          <td>{{ item.email }}</td>
          <td>{{ item.phoneNumber }}</td>
          <td>{{ item.teamName }}</td>
          <td>
            <v-tooltip text="Cập nhật phòng ban nhân viên">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  class="mx-2"
                  color="blue"
                  icon="mdi-account-group"
                  @click="showAddTeam(item.fullName, item.id)"
                ></v-btn>
              </template>
            </v-tooltip>
            <v-tooltip text="Cập nhật quyền nhân viên">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  class="mx-2"
                  color="green"
                  icon="mdi-account-edit"
                ></v-btn>
              </template>
            </v-tooltip>
            <v-tooltip text="Xóa nhân viên">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  class="mx-2"
                  color="red"
                  icon="mdi-delete"
                ></v-btn>
              </template>
            </v-tooltip>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
  <v-pagination v-if="!loading" v-model="currentPage" :length="pageCount"></v-pagination>
  </div>
  <!-- show form add team --> 
  <v-overlay
    v-model="formAddTeam"
    opacity="0.7"
    :scrim="true"
    class="d-flex align-center justify-center"
  >
    <v-form @submit.prevent="addTeam">
      <v-card
        title="Cập nhật phòng ban nhân viên"
        class="elevation-12 rounded-lg text-center"
        style="width: 500px; margin: auto; padding: 20px"
      >
        <v-card-text> Nhân viên: {{ userName }} </v-card-text>
        <v-card-text>
          <v-select
            v-model="teamName"
            variant="outlined"
            label="Chọn phòng"
            clearable
            :items="teamNames"
            :rules="[(v) => !!v || 'This field is required']"
          />
        </v-card-text>
        <v-card-actions class="d-flex align-center justify-end">
          <v-btn type="submit" class="mx-2" variant="tonal" color="blue"
            >Cập nhật</v-btn
          >
          <v-btn
            @click="formAddTeam = false"
            class="mx-2"
            color="blue"
            variant="outlined"
            >Thoát</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-form>
  </v-overlay>
</template>
<script setup>
import { computed, onMounted, ref } from "vue";
import apiService from "@/services/apiService";
import useAlert from "@/plugins/Alert";

const { message, ToggleShowAlert } = useAlert();

const search = ref("");
const search_team = ref("");
const users = ref([]);
const loading = ref(true);
const teams = ref([]);
const currentPage = ref(1);
const itemsPerPage = 9;
const pageCount = computed(() => Math.ceil(users.value.length / itemsPerPage));
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return users.value.slice(start, end);
});
const teamNames = computed(() => {
  return teams.value.map((team) => team.name);
});

const getTeamIdByTeamName = async (teamName) => {
  return teams.value.find((team) => team.name === teamName).id;
};

const formAddTeam = ref(false);
const userName = ref("");
const userId = ref("");

const showAddTeam = async (name, id) => {
  formAddTeam.value = true;
  userName.value = name;
  userId.value = id;
};

const teamName = ref("");
const addTeam = async () => {
  try {
    if (teamName.value == "") {
      await ToggleShowAlert("Bạn chưa chọn phòng", "error");
      return;
    }
    var teamId = await getTeamIdByTeamName(teamName.value);
    var res = await apiService.AddEmployeeToTeam(userId.value, teamId);
    fetchUsers();
    if (res.status != 200) {
      await ToggleShowAlert(res.message, "error");
      return;
    }
    console.log(res);
    formAddTeam.value = false;
    await ToggleShowAlert(res.message, "success");
  } catch (err) {
    console.error(err);
    await ToggleShowAlert("Có lỗi trong quá trình xử lý", "error");
  }
};

const searchUsers = async () => {};

const fetchTeams = async () => {
  try {
    const response = await apiService.GetAllTeam();
    if (response.status != 200) {
      await ToggleShowAlert(response.message, "error");
      return;
    }
    teams.value = response.data;
  } catch (err) {
    console.log(err);
    message.value = "Có lỗi xảy ra khi tải danh sách phòng ban.";
    await ToggleShowAlert(message.value, "error");
  }
};

const fetchUsers = async () => {
  loading.value = true;
  try {
    const response = await apiService.GetAllUser();
    users.value = response.data;
  } catch (err) {
    console.log(err);
    message.value = "Có lỗi xảy ra khi tải danh sách người dùng.";
    await ToggleShowAlert(message.value, "error");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUsers();
  fetchTeams();
});
</script>
<style scoped>
.card-custom {
  margin: 15px;
  background-image: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}
.search {
  width: 90%;
  height: 50px;
  color: white;
}
.table-custom {
  background-image: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}
.table-custom thead tr th {
  background: #667eea !important;
  color: white;
}
.table-custom tbody tr {
  height: 60px;
}
</style>
