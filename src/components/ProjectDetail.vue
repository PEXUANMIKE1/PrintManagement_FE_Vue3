<template>
  <v-card
    class="card-custom elevation-12 rounded-lg"
    witdh="100%"
    height="930px"
  >
    <v-card-title>
      <v-row>
        <v-col class="d-flex align-center justify-end">
          <v-btn
            class="mb-2"
            color="white"
            variant="none"
            to="/projects-management"
            ><span class="mdi mdi-file-excel-box text-h4"></span
          ></v-btn>
        </v-col>
      </v-row>
      <hr />
    </v-card-title>
    <v-card-text>
      <v-cow class="d-flex align-center justify-center">
        <v-col cols="6" class="text-center">
          <v-card class="card-project2 elevation-0 text-h5">
            <v-row class="icon-step">
              <v-col cols="2" style="color: aquamarine"
                ><v-icon>mdi-projector-screen-outline</v-icon></v-col
              >
              <v-col cols="1" class="icon-chevron"
                ><v-icon>mdi-chevron-right</v-icon></v-col
              >
              <v-col cols="2" @click="ProjectDesign()"
                ><v-icon>mdi-file-document-outline</v-icon></v-col
              >
              <v-col cols="1" class="icon-chevron"
                ><v-icon>mdi-chevron-right</v-icon></v-col
              >
              <v-col cols="2" @click="ProjectPrint()"
                ><v-icon>mdi-printer</v-icon></v-col
              >
              <v-col cols="1" class="icon-chevron"
                ><v-icon>mdi-chevron-right</v-icon></v-col
              >
              <v-col cols="2" @click="ProjectDelivery()"><v-icon>mdi-cart</v-icon></v-col>
            </v-row>
            <v-row class="text-step">
              <v-col cols="2" style="color: aquamarine"><p>Dự án</p></v-col>
              <v-col cols="1"></v-col>
              <v-col cols="2"><p>Thiết kế</p></v-col>
              <v-col cols="1"></v-col>
              <v-col cols="2"><p>In ấn</p></v-col>
              <v-col cols="1"></v-col>
              <v-col cols="2"><p>Giao hàng</p></v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-cow>
      <hr />
      <v-row>
        <v-col cols="3">
          <v-img
            :src="projectImage"
            height="600"
            contain
            class="img-card rounded-4"
          />
        </v-col>
        <v-col cols="5">
          <v-card class="card-project elevation-0">
            <v-card-title class="mt-4 mb-5 text-h5"
              ><b>{{ projectDetail.projectName }}</b></v-card-title
            >
            <v-card-text>
              <div class="mb-5"><b>Ngày tạo: </b>{{ formatStartDate }}</div>
              <div class="mb-5">
                <b>Ngày kết thúc dự kiến: </b>{{ formatEndDate }}
              </div>
              <div class="mb-5">
                <b>Yêu cầu của khách hàng: </b
                >{{ projectDetail.requestDescriptionFromCustomer }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card class="card-project elevation-6 rounded-lg">
            <v-card-title class="text-center mt-4 mb-4 text-h5">
              <b>Thông tin dự án</b>
            </v-card-title>
            <v-card-text>
              <v-card class="card-project1 elevation-0">
                <v-card-text>
                  <div class="mb-3">
                    <b>Người phụ trách: </b>{{ projectEmployee.employeeName }}
                  </div>
                  <div class="mb-3">
                    <b>Số điện thoại: </b>{{ projectEmployee.employeePhone }}
                  </div>
                  <div class="mb-3">
                    <b>Email: </b>{{ projectEmployee.employeeEmail }}
                  </div>
                </v-card-text>
              </v-card>
              <v-card class="card-project1 elevation-0">
                <v-card-text>
                  <div class="mb-3">
                    <b>Khách hàng: </b>{{ projectCustommer.customerName }}
                  </div>
                  <div class="mb-3">
                    <b>Số điện thoại: </b>{{ projectCustommer.customerPhone }}
                  </div>
                  <div class="mb-3">
                    <b>Email: </b>{{ projectCustommer.customerEmail }}
                  </div>
                  <div class="mb-3">
                    <b>Địa chỉ: </b>{{ projectCustommer.customerAddress }}
                  </div>
                </v-card-text>
              </v-card>
            </v-card-text>
            <hr />
            <v-card-text>
              <v-row>
                <v-col cols="6">
                  <b>Giá dự án:</b>
                </v-col>
                <v-col cols="6" class="d-flex align-center justify-end">
                  10.000.000đ
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <v-col>
            <v-btn class="btn-custom" color="yellow" @click="ProjectDesign()">
              <b>Thiết kế</b><span class="mdi mdi-arrow-right"></span>
            </v-btn>
          </v-col>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import routerLink from "@/router";
import useAlert from "@/plugins/Alert";
import apiService from "@/services/apiService";
import useFormat from "@/plugins/Format";

const baseUrl = "https://localhost:7262/";
const projectImage = computed(() => {
  return projectDetail.value
    ? `${baseUrl}Upload/Files/${projectDetail.value.projectImg}`
    : "";
});

const { ToggleShowAlert } = useAlert();
const { formatDateTime } = useFormat();
const router = useRoute();
const projectId = ref(null);

const projectDetail = ref([]);
const projectCustommer = ref([]);
const projectEmployee = ref([]);

//get project
const formatStartDate = computed(() => {
  return projectDetail.value.startDate
    ? formatDateTime(projectDetail.value.startDate)
    : "";
});
const formatEndDate = computed(() => {
  return projectDetail.value.expectedEndDate
    ? formatDateTime(projectDetail.value.expectedEndDate)
    : "";
});
const GetProjectDetail = async (id) => {
  try {
    var res = await apiService.GetProjectById(id);

    projectDetail.value = res.data;
    //console.log(projectDetail.value);
  } catch (error) {
    console.log(error);
    ToggleShowAlert(error.message, "error");
  }
};

const GetEmployeeOfProject = async (id) => {
  try {
    var res = await apiService.GetEmployeeOfProject(id);

    projectEmployee.value = res.data;
    //console.log(projectEmployee.value);
  } catch (error) {
    console.log(error);
    ToggleShowAlert(error.message, "error");
  }
};

const GetCustomerOfProject = async (id) => {
  try {
    var res = await apiService.GetCustomerOfProject(id);

    projectCustommer.value = res.data;
    //console.log(projectCustommer.value);
  } catch (error) {
    console.log(error);
    ToggleShowAlert(error.message, "error");
  }
};

// go to project design
const ProjectDesign = async () => {
  try {
    //console.log(projectId.value);
    routerLink.push(`/projects-design/${projectId.value}`);
  } catch (err) {
    console.error(err);
  }
};

// go to  project print
const ProjectPrint = async () => {
  try {
    //console.log(projectId.value);
    routerLink.push(`/projects-print/${projectId.value}`);
  } catch (err) {
    console.error(err);
  }
};

// go to Project Delivery btn
const ProjectDelivery = async () => {
  try {
    //console.log(projectId.value);
    routerLink.push(`/projects-delivery/${projectId.value}`);
  } catch (err) {
    console.error(err);
  }
};

onMounted(() => {
  projectId.value = router.params.id;
  GetProjectDetail(projectId.value);
  GetEmployeeOfProject(projectId.value);
  GetCustomerOfProject(projectId.value);
});
</script>

<style scoped>
.card-custom {
  margin: 15px;
  background-image: linear-gradient(135deg, #4156b3, #4d2c6e);
  color: white;
}
.card-project {
  margin: 15px;
  background-color: rgba(255, 255, 255, 0);
  color: rgb(249, 255, 216);
}
.card-project1 {
  margin: 10px;
  background-color: rgba(255, 255, 255, 0.068);
  color: white;
  padding: 10px;
}
.card-project2 {
  margin: 10px;
  background-color: rgba(255, 255, 255, 0);
  color: white;
  padding: 10px;
}
.btn-custom {
  width: 100%;
  height: 50px;
}
.text-step {
  margin-top: -35px;
}
.text-step p {
  font-size: 19px;
}
.icon-step {
  font-size: xx-large;
}
.icon-chevron {
  margin-top: 15px;
}
</style>
