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
            height="428px"
            :src="baseImgUrl + item.projectImg"
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
              <span>Tiến độ: {{ progress(item.projectStatus) }}%</span>
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
                  @click="DetailProject(item.id)"
                ></v-btn>
              </template>
            </v-tooltip>
            <v-tooltip
              text="Xóa dự án"
              v-if="
                hasRole('Admin') ||
                (hasRole('Employee') && user.teamName == 'Sales')
              "
            >
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

  <!-- show form create new peoject -->
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
              <v-text-field
                v-model="customerEmailCreate"
                variant="outlined"
                label="Email"
                type="email"
                clearable
                prepend-inner-icon="mdi mdi-email-outline"
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
                label="Yêu cầu của khách hàng"
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
import router from "@/router";

const baseImgUrl = "https://localhost:7262/Upload/Files/";

const store = useStore();
const hasRole = (role) => store.getters.hasRole(role);
const user = computed(() => store.state.user);

const progress = (projectStatus) => {
  return projectStatus == "Completed"
    ? 100
    : projectStatus == "Designed"
    ? 25
    : projectStatus == "ConfirmPrint"
    ? 50
    : projectStatus == "Printing"
    ? 75
    : 0;
};

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
  Math.ceil((projects.value?.length ?? 0) / itemsPerPage)
);
const paginatedProjects = computed(() => {
  if (!projects.value || !Array.isArray(projects.value)) {
    return [];
  }
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

//thông tin khách hàng input
const customerEmailCreate = ref("");
const customerNameCreate = ref("");
const customerPhoneCreate = ref("");
const customerAddressCreate = ref("");

// thông tin project input
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
    if (
      customerNameCreate.value == "" ||
      customerEmailCreate.value == "" ||
      customerPhoneCreate.value == "" ||
      customerAddressCreate.value == "" ||
      projectNameCreate.value == "" ||
      projectDescCreate.value == "" ||
      startDateCreate.value == "" ||
      endDateCreate.value == ""
    ) {
      await ToggleShowAlert("Yêu cầu nhập đầy đủ thông tin", "error");
      return;
    }
    var data = {
      customerFullName: customerNameCreate.value.trim(),
      customerEmail: customerEmailCreate.value.trim(),
      customerPhoneNumber: customerPhoneCreate.value.trim(),
      customerAddress: customerAddressCreate.value.trim(),
      projectName: projectNameCreate.value.trim(),
      requestDescriptionFromCustomer: projectDescCreate.value.trim(),
      startDate: startDateCreate.value,
      expectedEndDate: endDateCreate.value,
    };
    console.log(data);
    var res = await apiService.CreateProject(data);
    console.log(res);
    fetchProjects();
    if (res.status != 201) {
      await ToggleShowAlert(res.message, "error");
      return;
    }

    FormCreateNewProject.value = false;
    await ToggleShowAlert(res.message, "success");

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
// detail project
const DetailProject = async (id) => {
  try {
    //console.log(id);
    router.push(`/projects-detail/${id}`);
  } catch (err) {
    console.error(err);
  }
};

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
    projects.value = response.data;
    //console.log(projects.value);
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
