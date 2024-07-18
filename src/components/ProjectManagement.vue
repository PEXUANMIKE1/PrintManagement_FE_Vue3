<template>
  <!-- top bar -->
  <v-card class="card-custom elevation-12 rounded-lg">
    <v-card-text class="rounded-lg">
      <v-row align-center no-gutters>
        <v-col cols="3">
          <v-text-field
            class="search"
            v-model="searchProject"
            variant="outlined"
            placeholder="Tìm kiếm dự án"
            clearable
            prepend-inner-icon="mdi mdi-magnify"
          />
        </v-col>
        <v-col cols="2" class="mx-3">
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                v-model="startDate"
                placeholder="Ngày bắt đầu"
                prepend-inner-icon="mdi-calendar-outline"
                readonly
                clearable
                v-bind="props"
                variant="outlined"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="startDate"
              @update:model-value="menu = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="2" class="mx-3">
          <v-menu
            v-model="menu1"
            :close-on-content-click="false"
            transition="scale-transition"
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                v-model="endDate"
                placeholder="Ngày kết thúc"
                prepend-inner-icon="mdi-calendar-outline"
                readonly
                clearable
                v-bind="props"
                variant="outlined"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="endDate"
              @update:model-value="menu1 = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="2" class="mx-3">
          <v-select
            v-model="teamName"
            variant="outlined"
            label="Lọc theo Leader"
            clearable
            :items="teamNames"
          />
        </v-col>
        <v-col cols="2" class="mx-3">
          <v-select
            v-model="teamName"
            variant="outlined"
            label="Lọc theo tiến độ"
            clearable
            :items="teamNames"
          />
        </v-col>
        <v-row>
          <v-col cols="13" class="mx-3">
            <v-btn variant="outlined" @click="searchTeam">Tìm kiếm</v-btn>
          </v-col>
          <v-col
            v-if="hasRole('Employee') && user.teamName == 'Sales'"
            cols="1"
            class="d-flex align-center justify-center"
          >
            <v-tooltip text="Thêm mới dự án">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  class="mx-2"
                  variant="tonal"
                  icon="mdi-plus"
                  @click="showFormCreateNewProject"
                ></v-btn>
              </template>
            </v-tooltip>
          </v-col>
        </v-row>
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
      <v-col cols="3" v-for="item in paginatedProjects" :key="item.id">
        <v-card class="card-custom elevation-12 rounded-lg">
          <v-img
            class="img-card-project"
            src="https://th.bing.com/th/id/OIP.yaAt923ojNxHZON21b7XOgHaJd?rs=1&pid=ImgDetMain"
          />
          <v-card-title
            ><h3>{{ item.projectName }}</h3></v-card-title
          >
          <v-card-subtitle></v-card-subtitle>
          <v-card-text>
            <h3>Người phụ trách: {{ item.employeeName }}</h3>
          </v-card-text>
          <v-card-text>
            Ngày tạo: {{ formatDateTime(item.startDate) }}
          </v-card-text>
          <v-card-text class="progress-card">
            <div class="d-flex align-center">
              <span>Tiến độ: {{ progress }}%</span>
            </div>
          </v-card-text>

          <v-card-action>
            <v-tooltip
              v-if="hasRole('Employee') && user.teamName == 'Sales'"
              text="Sửa phòng ban"
            >
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
            <v-tooltip text="Xem chi tiết">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  class="mx-3 mt-3 mb-3"
                  color="green"
                  icon="mdi mdi-eye-outline"
                ></v-btn>
              </template>
            </v-tooltip>
            <v-tooltip text="Xóa dự án">
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
    v-model="FormCreateNewProject"
    opacity="0.7"
    :scrim="true"
    class="d-flex align-center justify-center"
  >
    <v-form @submit.prevent="createNewProject">
      <v-card
        class="elevation-12 rounded-lg text-center"
        style="width: 700px; margin: auto; padding: 20px"
      >
        <v-card-title><h2>Tạo mới dự án</h2></v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-card-title>Thông tin khách hàng</v-card-title>
              <v-text-field
                v-model="customerNameCreate"
                variant="outlined"
                label="Tên Khách hàng"
                clearable
                prepend-inner-icon="mdi mdi-account-box"
                required
                :rules="[(v) => !!v || 'This field is required']"
              />
              <v-text-field
                v-model="customerPhoneCreate"
                variant="outlined"
                label="Số điện thoại"
                type="number"
                clearable
                prepend-inner-icon="mdi mdi-phone"
                required
                :rules="[(v) => !!v || 'This field is required']"
              />
              <v-text-field
                v-model="customerAddressCreate"
                variant="outlined"
                label="Địa chỉ"
                clearable
                prepend-inner-icon="mdi mdi-map-marker"
                required
                :rules="[(v) => !!v || 'This field is required']"
              />
            </v-col>
            <v-col>
              <v-card-title>Thông tin dự án</v-card-title>
              <v-text-field
                v-model="projectNameCreate"
                variant="outlined"
                label="Tên dự án"
                clearable
                prepend-inner-icon="mdi mdi-briefcase-edit"
                required
                :rules="[(v) => !!v || 'This field is required']"
              />
              <v-menu
                v-model="menuStartCreate"
                :close-on-content-click="false"
                transition="scale-transition"
              >
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-model="formattedStartDateCreate"
                    placeholder="Ngày bắt đầu"
                    prepend-inner-icon="mdi-calendar-outline"
                    readonly
                    clearable
                    v-bind="props"
                    variant="outlined"
                    :rules="[(v) => !!v || 'This field is required']"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="startDateCreate"
                  @update:model-value="menuStartCreate = false"
                ></v-date-picker>
              </v-menu>
              <v-menu
                v-model="menuEndCreate"
                :close-on-content-click="false"
                transition="scale-transition"
              >
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-model="formattedEndDateCreate"
                    placeholder="Ngày kết thúc dự kiến"
                    prepend-inner-icon="mdi-calendar-outline"
                    readonly
                    clearable
                    v-bind="props"
                    variant="outlined"
                    :rules="[(v) => !!v || 'This field is required']"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="endDateCreate"
                  @update:model-value="menuEndCreate = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-textarea
                v-model="projectDescCreate"
                variant="outlined"
                label="Mô tả yêu cầu"
                clearable
                :rules="[(v) => !!v || 'This field is required']"
              >
              </v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="d-flex align-center justify-end">
          <v-btn class="mx-2" variant="tonal" color="blue" type="submit"
            >Tạo</v-btn
          >
          <v-btn
            @click="FormCreateNewProject = false"
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
import { onMounted, ref, computed } from "vue";
import apiService from "@/services/apiService";
import useAlert from "@/plugins/Alert";
import useFormat from "@/plugins/Format";
import { useStore } from "vuex";

const store = useStore();
const hasRole = (role) => store.getters.hasRole(role);
const user = computed(() => store.state.user);

const progress = ref(100);
const startDate = ref(null);
const endDate = ref(null);
const menu1 = ref(false);
const menu = ref(false);

const { ToggleShowAlert } = useAlert();
const { formatDateTime } = useFormat();
const searchProject = ref("");

const projects = ref([]);

const loading = ref(false);

//phân trang
const currentPage = ref(1);
const itemsPerPage = 8;
const pageCount = computed(() =>
  Math.ceil(projects.value.length / itemsPerPage)
);
const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return projects.value.slice(start, end);
});

//search dự án
//const searchTeam = async () => {};

//tạo mới project
const FormCreateNewProject = ref(false);
const showFormCreateNewProject = async () => {
  FormCreateNewProject.value = true;
};

//thông tin khách hàng
const customerNameCreate = ref("");
const customerPhoneCreate = ref("");
const customerAddressCreate = ref("");

// thông tin project
const projectNameCreate = ref("");
const projectDescCreate = ref("");
const startDateCreate = ref(null);
const endDateCreate = ref(null);

const formattedStartDateCreate = computed(() => {
  return startDateCreate.value ? formatDateTime(startDateCreate.value) : "";
});

const formattedEndDateCreate = computed(() => {
  return endDateCreate.value ? formatDateTime(endDateCreate.value) : "";
});
const menuStartCreate = ref(false);
const menuEndCreate = ref(false);

const createNewProject = async () => {
  try {
    var data = {
      customerFullName: customerNameCreate.value.trim(),
      customerPhoneNumber: customerPhoneCreate.value.trim(),
      customerAddress: customerAddressCreate.value.trim(),
      projectName: projectNameCreate.value.trim(),
      requestDescriptionFromCustomer: projectDescCreate.value.trim(),
      startDate: startDateCreate.value,
      expectedEndDate: endDateCreate.value,
    };
    if (
      data.customerFullName == "" ||
      data.customerPhoneNumber == "" ||
      data.customerAddress == "" ||
      data.projectName == "" ||
      data.requestDescriptionFromCustomer == "" ||
      data.startDate == "" ||
      data.expectedEndDate == ""
    ) {
      await ToggleShowAlert("Yêu cầu nhập đầy đủ thông tin", "error");
      return;
    }
    console.log(data);
    var res = await apiService.CreateProject(data);
    console.log(res);
    fetchProjects();
    if (res.status != 201) {
      await ToggleShowAlert(res.message, "error");
      return;
    }
    await ToggleShowAlert(res.message, "success");
    FormCreateNewProject.value = false;

    customerAddressCreate.value = "";
    customerNameCreate.value = "";
    customerPhoneCreate.value = "";
    projectNameCreate.value = "";
    projectDescCreate.value = "";
    startDateCreate.value = "";
    endDateCreate.value = "";
  } catch (err) {
    console.error(err);
    await ToggleShowAlert(err.message, "error");
  }
};
//
//get all project
const fetchProjects = async () => {
  loading.value = true;
  try {
    let response = {};
    if (hasRole("Employee") && user.value.teamName == "Sales") {
      response = await apiService.GetAllProjectOfUser();
    } else {
      response = await apiService.GetAllProject();
    }
    console.log(response.data);
    if (response.data == null) {
      ToggleShowAlert("Danh sách trống", "error");
    }
    projects.value = response.data;
    loading.value = false;
  } catch (err) {
    console.error(err);
    ToggleShowAlert("Có lỗi xảy ra khi tải danh sách dự án.", "error");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchProjects();
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
</style>
