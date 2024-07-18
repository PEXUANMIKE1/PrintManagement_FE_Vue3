<template>
  <!-- top bar -->
  <v-card class="card-custom elevation-12 rounded-lg">
    <v-card-text class="rounded-lg">
      <v-row align-center no-gutters>
        <v-col cols="6">
          <v-text-field
            class="search"
            v-model="search"
            variant="outlined"
            placeholder="Tìm kiếm phòng ban"
            clearable
            prepend-inner-icon="mdi mdi-magnify"
          />
        </v-col>
        <v-col cols="5" class="d-flex align-center">
          <v-btn variant="outlined" @click="searchTeam">Tìm kiếm</v-btn>
        </v-col>
        <v-col cols="1" class="d-flex align-center justify-center">
          <v-tooltip text="Thêm mới phòng ban">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                class="mx-2"
                variant="tonal"
                icon="mdi-plus"
                @click="showFormCreateNewTeam"
              ></v-btn>
            </template>
          </v-tooltip>
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

  <!-- show list team -->
  <div v-if="!loading">
    <v-row no-gutters>
      <v-col cols="4" v-for="item in paginatedTeams" :key="item.id">
        <v-card class="card-custom elevation-12 rounded-lg">
          <v-card-title
            ><h3>Tên phòng ban: {{ item.name }}</h3></v-card-title
          >
          <v-card-subtitle>{{ item.description }}</v-card-subtitle>
          <v-card-text> Số thành viên: {{ item.numberOfMember }} </v-card-text>
          <v-card-text> Trưởng phòng: {{ item.managerName }} </v-card-text>
          <hr />
          <v-card-action>
            <v-tooltip text="Sửa phòng ban">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  class="mx-3 mt-3 mb-3"
                  color="blue"
                  icon="mdi-pencil"
                  @click="showFormEditTeam(item.id)"
                ></v-btn>
              </template>
            </v-tooltip>
            <v-tooltip text="Giao KPI cho nhân viên">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  class="mx-3 mt-3 mb-3"
                  color="green"
                  icon="mdi mdi-account-arrow-left"
                ></v-btn>
              </template>
            </v-tooltip>
            <v-tooltip text="Xóa phòng ban">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  class="mx-3 mt-3 mb-3"
                  color="red"
                  icon="mdi-delete"
                  @click="deleteTeam(item.id)"
                ></v-btn>
              </template>
            </v-tooltip>
          </v-card-action>
        </v-card>
      </v-col>
    </v-row>
    <v-pagination v-model="currentPage" :length="pageCount"></v-pagination>
  </div>
  <!-- show form create new team -->
  <v-overlay
    v-model="FormCreateNewTeam"
    opacity="0.7"
    :scrim="true"
    class="d-flex align-center justify-center"
  >
    <v-form @submit.prevent="createNewTeam">
      <v-card
        title="Tạo mới phòng ban"
        class="elevation-12 rounded-lg text-center"
        style="width: 550px; margin: auto; padding: 20px"
      >
        <v-card-text>
          <v-text-field
            v-model="input_NameTeam"
            variant="outlined"
            label="Tên phòng ban"
            clearable
            prepend-inner-icon="mdi mdi-account-group"
            required
            :rules="[(v) => !!v || 'This field is required']"
          />
          <v-text-field
            v-model="input_DescTeam"
            variant="outlined"
            label="Mô tả"
            clearable
            prepend-inner-icon="mdi mdi-card-text"
            required
            :rules="[(v) => !!v || 'This field is required']"
          />
        </v-card-text>
        <v-card-actions class="d-flex align-center justify-end">
          <v-btn class="mx-2" variant="tonal" color="blue" type="submit"
            >Tạo</v-btn
          >
          <v-btn
            @click="FormCreateNewTeam = false"
            class="mx-2"
            color="blue"
            variant="outlined"
            >Thoát</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-form>
  </v-overlay>

  <!-- show form team update -->
  <v-overlay
    v-model="FormEditTeam"
    opacity="0.7"
    :scrim="true"
    class="d-flex align-center justify-center"
  >
    <v-form @submit.prevent="teamEdit">
      <v-card
        title="Sửa thông tin phòng ban"
        class="elevation-12 rounded-lg text-center"
        style="width: 550px; margin: auto; padding: 20px"
      >
        <v-card-text>
          <v-text-field
            v-model="edit_NameTeam"
            variant="outlined"
            label="Tên phòng ban"
            clearable
            prepend-inner-icon="mdi mdi-account-group"
            :rules="[(v) => !!v || 'This field is required']"
          />
          <v-text-field
            v-model="edit_DescTeam"
            variant="outlined"
            label="Mô tả"
            clearable
            prepend-inner-icon="mdi mdi-card-text"
            :rules="[(v) => !!v || 'This field is required']"
          />
          <v-select
            v-model="managerTeam"
            variant="outlined"
            label="Chọn trưởng phòng"
            clearable
            prepend-inner-icon="mdi-account-box-multiple"
            :items="userNameOfTeam"
          />
        </v-card-text>
        <v-card-actions class="d-flex align-center justify-end">
          <v-btn class="mx-2" variant="tonal" color="blue" type="submit"
            >Cập nhật</v-btn
          >
          <v-btn
            @click="FormEditTeam = false"
            class="mx-2"
            color="blue"
            variant="outlined"
          >
            Thoát
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-overlay>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import apiService from "@/services/apiService";
import useAlert from "@/plugins/Alert";

const { ToggleShowAlert } = useAlert();
const search = ref("");
const loading = ref(true);
const teams = ref([]);
const currentPage = ref(1);
const itemsPerPage = 6;
const pageCount = computed(() => Math.ceil(teams.value.length / itemsPerPage));

//phân trang
const paginatedTeams = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return teams.value.slice(start, end);
});

//search phòng ban
const searchTeam = async () => {};

//tạo mới phòng ban
const FormCreateNewTeam = ref(false);
const showFormCreateNewTeam = async () => {
  FormCreateNewTeam.value = true;
};
const input_NameTeam = ref("");
const input_DescTeam = ref("");
const createNewTeam = async () => {
  try {
    var data = {
      name: input_NameTeam.value.trim(),
      description: input_DescTeam.value.trim(),
    };
    if (data.name == "" || data.description == "") {
      await ToggleShowAlert("Bạn chưa nhập thông tin", "error");
      return;
    }
    var res = await apiService.CreateTeam(data);
    //console.log(res);
    fetchTeams();
    if (res.status != 201) {
      await ToggleShowAlert(res.message, "error");
      return;
    }
    await ToggleShowAlert(res.message, "success");
    FormCreateNewTeam.value = false;
  } catch (err) {
    console.error(err);
    await ToggleShowAlert(res.message, "error");
  }
};

//xóa phòng ban
const deleteTeam = async (id) => {
  try {
    var res = await apiService.DeleteTeamById(id);
    console.log(res);
    fetchTeams();
    if (res.status != 200) {
      await ToggleShowAlert(res.message, "error");
      return;
    }
    await ToggleShowAlert(res.message, "success");
  } catch (err) {
    console.error(err);
    await ToggleShowAlert("Có lỗi trong quá trình xử lý", "error");
  }
};

//lấy toàn bộ user trong team
const userTeam = ref([]);
const userNameOfTeam = ref([]);
const fetchUserTeam = async (teamId) => {
  try {
    const response = await apiService.GetAllUserOfTeam(teamId);
    //console.log(response.data);
    userTeam.value = response.data;
    //console.log(userTeam.value);
  } catch (err) {
    console.error(err);
  }
};

//sửa team
const teamId = ref(0);
const managerTeam = ref("");
const edit_NameTeam = ref("");
const edit_DescTeam = ref("");
const FormEditTeam = ref(false);
const showFormEditTeam = async (id) => {
  FormEditTeam.value = true;
  teamId.value = id;
  edit_NameTeam.value = teams.value.find((item) => item.id == id).name;
  edit_DescTeam.value = teams.value.find((item) => item.id == id).description;
  managerTeam.value = teams.value.find((item) => item.id == id).managerName;
  await fetchUserTeam(id);
  userNameOfTeam.value = userTeam.value.map((user) => user.fullName);
};
const teamEdit = async () => {
  try {
    var managerId = null;
    if (managerTeam.value != "") {
      managerId = userTeam.value.find(
        (user) => user.fullName == managerTeam.value
      ).id;
    }
    var data = {
      name: edit_NameTeam.value.trim(),
      description: edit_DescTeam.value.trim(),
      managerId: managerId,
    };
    if (data.name == "" || data.description == "") {
      await ToggleShowAlert("Bạn chưa nhập thông tin", "error");
      return;
    }
    var res = await apiService.UpdateTeam(teamId.value, data);
    //console.log(res);
    fetchTeams();
    if (res.status != 200) {
      await ToggleShowAlert(res.message, "error");
      return;
    }
    await ToggleShowAlert(res.message, "success");
    FormEditTeam.value = false;
  } catch (err) {
    console.error(err);
    await ToggleShowAlert("Có lỗi trong quá trình xử lý!", "error");
  }
};

//get all team
const fetchTeams = async () => {
  try {
    const response = await apiService.GetAllTeam();
    //console.log(response.data);
    teams.value = response.data;
    loading.value = false;
  } catch (err) {
    console.error(err);
    ToggleShowAlert("Có lỗi xảy ra khi tải danh sách phòng ban.", "error");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchTeams();
});
</script>

<style>
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
</style>
