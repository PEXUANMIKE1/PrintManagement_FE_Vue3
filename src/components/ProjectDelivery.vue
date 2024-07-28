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
              <v-col cols="2" style="color: aquamarine" @click="ProjectDetail()"
                ><v-icon>mdi-projector-screen-outline</v-icon></v-col
              >
              <v-col cols="1" style="color: aquamarine" class="icon-chevron"
                ><v-icon>mdi-chevron-right</v-icon></v-col
              >
              <v-col cols="2" style="color: aquamarine" @click="ProjectDesign()"
                ><v-icon>mdi-file-document-outline</v-icon></v-col
              >
              <v-col cols="1" style="color: aquamarine" class="icon-chevron"
                ><v-icon>mdi-chevron-right</v-icon></v-col
              >
              <v-col cols="2" style="color: aquamarine" @click="ProjectPrint()"
                ><v-icon>mdi-printer</v-icon></v-col
              >
              <v-col cols="1" style="color: aquamarine" class="icon-chevron"
                ><v-icon>mdi-chevron-right</v-icon></v-col
              >
              <v-col cols="2" style="color: aquamarine"
                ><v-icon>mdi-cart</v-icon></v-col
              >
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
      <v-row v-if="projectBill != null">
        <v-col cols="8">
          <v-card class="card-project elevation-0">
            <v-card-title class="mt-4 mb-5 text-h5">
              <v-col
                class="alert-text"
                v-if="projectDetail.projectStatus == 'Completed'"
              >
                <span class="mdi mdi-bookmark-multiple-outline"></span>
                <b>&nbsp; Đơn hàng đã tạo thành công</b><br />
                <p>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Đơn hàng đã được
                  giao cho nhân viên giao hàng
                </p>
              </v-col>
            </v-card-title>
            <v-card-text>
              <v-table class="mt-8 table-custom" theme="dark">
                <thead>
                  <tr>
                    <th class="text-left">TÊN ĐƠN HÀNG</th>
                    <th class="text-left">KHÁCH HÀNG</th>
                    <th class="text-left">ĐỊA CHỈ</th>
                    <th class="text-left">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ projectBill.billName }}</td>
                    <td>{{ projectCustommer.customerName }}</td>
                    <td>{{ projectCustommer.customerAddress }}</td>
                    <td>
                      <v-btn
                        v-if="
                          projectDetail.projectStatus == 'Completed' &&
                          user.fullName == Team.managerName &&
                          Delivery == null
                        "
                        color="yellow"
                        @click="showDeliveryForm"
                      >
                        Giao hàng
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card class="card-project elevation-6 rounded-lg">
            <v-card-title class="text-center mt-4 mb-4 text-h5">
              <b>Thông tin đơn hàng</b>
            </v-card-title>
            <v-card-text>
              <v-card class="card-project1 elevation-0">
                <v-card-text>
                  <div class="mb-3">
                    <b>Mã đơn hàng: </b>{{ projectBill.tradingCode }}
                  </div>
                  <div class="mb-3">
                    <b>Tên đơn hàng: </b>{{ projectBill.billName }}
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
                  <div class="mb-3">
                    <b>Thành tiền: </b>{{ projectBill.totalMoney }} đ
                  </div>
                </v-card-text>
              </v-card>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <!-- show form delivery-->
  <v-overlay
    v-model="showDelivery"
    opacity="0.7"
    :scrim="true"
    class="d-flex align-center justify-center"
  >
    <v-card
      class="elevation-12 rounded-lg"
      style="width: 500px; margin: auto; height: 370px; padding: 10px"
    >
      <v-card-title>Giao hàng</v-card-title>
      <v-card-text>
        <div class="text-label">Ngày giao hàng dự kiến</div>
        <v-date-input
          prepend-icon=""
          placeholder="dd-MM-yyyy"
          v-model="estimateDeliveryDate"
          clearable
          variant="outlined"
          :rules="[(v) => !!v || 'This field is required']"
        ></v-date-input>

        <div class="text-label">Nhân viên giao hàng</div>
        <v-select
          v-model="selectDeliver"
          variant="outlined"
          placeholder="Nhân viên giao hàng"
          clearable
          :items="TeamMember"
          item-title="fullName"
          item-value="id"
          :rules="[(v) => !!v || 'This field is required']"
        ></v-select>
      </v-card-text>
      <v-card-actions class="d-flex align-center justify-end mb-3">
        <v-btn
          @click="createDeliveries"
          class="mx-2"
          variant="tonal"
          color="blue"
        >
          Gửi
        </v-btn>
        <v-btn
          @click="showDelivery = false"
          class="mx-2"
          color="blue"
          variant="outlined"
        >
          Thoát
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-overlay>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import routerLink from "@/router";
import useAlert from "@/plugins/Alert";
import apiService from "@/services/apiService";
import { VDateInput } from "vuetify/labs/VDateInput";
import { useStore } from "vuex";
const store = useStore();
// const hasRole = (role) => store.getters.hasRole(role);
const user = computed(() => store.state.user);

const { ToggleShowAlert } = useAlert();
const router = useRoute();
const projectId = ref(null);

const projectBill = ref(null);
const projectCustommer = ref(null);

//tạo đơn giao hàng
const estimateDeliveryDate = ref(null);
const selectDeliver = ref(null);
//show form giao hàng
const showDelivery = ref(false);
const showDeliveryForm = async () => {
  estimateDeliveryDate.value = null;
  selectDeliver.value = null;
  showDelivery.value = true;
};

const createDeliveries = async () => {
  try {
    if (estimateDeliveryDate.value == null || selectDeliver.value == null) {
      ToggleShowAlert("Yêu cầu nhập đủ thông tin", "error");
      return;
    }
    var data = {
      deliverId: selectDeliver.value,
      projectId: projectId.value,
      estimateDeliveryTime: estimateDeliveryDate.value.toISOString(),
    };
    console.log(data);
    var res = await apiService.CreateDelivery(data);
    console.log(res);
    if (res.status != 201) {
      ToggleShowAlert(res.message, "error");
      return;
    }
    showDelivery.value = false;
    GetDeliveryByProjectId(projectId.value);
    ToggleShowAlert(res.message, "success");
  } catch (error) {
    console.log(error);
    ToggleShowAlert(error.message, "error");
  }
};

// get Customer
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
//get team by team Name
const Team = ref(null);
const GetTeamByTeamName = async (teamName) => {
  try {
    var res = await apiService.GetTeamByTeamName(teamName);
    Team.value = res.data;
    //console.log(Team.value);
  } catch (error) {
    console.log(error);
    ToggleShowAlert(error.message, "error");
  }
};
//Get All Member Of Team Not Manager Team
const TeamMember = ref(null);
const GetAllMemberOfTeamNotManager = async (teamName) => {
  try {
    var res = await apiService.GetAllMemberOfTeamNotManager(teamName);
    //console.log(res);
    TeamMember.value = res.data;
  } catch (error) {
    console.log(error);
    ToggleShowAlert(error.message, "error");
  }
};
//get bill of project
const GetBillOfProject = async (id) => {
  try {
    var res = await apiService.GetBillByProjectId(id);
    projectBill.value = res.data;
    //console.log(projectCustommer.value);
  } catch (error) {
    console.log(error);
    ToggleShowAlert(error.message, "error");
  }
};
// go to project design btn
const ProjectDesign = async () => {
  try {
    //console.log(projectId.value);
    routerLink.push(`/projects-design/${projectId.value}`);
  } catch (err) {
    console.error(err);
  }
};
// go to project detail btn
const ProjectDetail = async () => {
  try {
    //console.log(projectId.value);
    routerLink.push(`/projects-detail/${projectId.value}`);
  } catch (err) {
    console.error(err);
  }
};
// go to  project print btn
const ProjectPrint = async () => {
  try {
    //console.log(projectId.value);
    routerLink.push(`/projects-print/${projectId.value}`);
  } catch (err) {
    console.error(err);
  }
};
//get delivery by projectId
const Delivery = ref(null);
const GetDeliveryByProjectId = async (id) => {
  try {
    var res = await apiService.GetDeliveryByProjectId(id);
    Delivery.value = res.data;
    //console.log(res);
  } catch (error) {
    console.log(error);
    ToggleShowAlert(error.message, "error");
  }
};

//get project detail
const projectDetail = ref([]);
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
onMounted(() => {
  projectId.value = router.params.id;
  GetProjectDetail(projectId.value);
  GetBillOfProject(projectId.value);
  GetCustomerOfProject(projectId.value);
  GetTeamByTeamName("Delivery");
  GetAllMemberOfTeamNotManager("Delivery");
  GetDeliveryByProjectId(projectId.value);
});
</script>

<style scoped>
.text-label {
  font-size: 17px;
  margin-bottom: 10px;
  margin-top: 5px;
}
.mdi-bookmark-multiple-outline {
  border-radius: 5px;
  font-size: 14px;
  padding: 4px;
  background-color: rgba(0, 0, 0, 0.315);
}
.alert-text {
  color: rgb(78, 252, 72);
  background-color: rgba(0, 201, 27, 0.432);
  border-radius: 7px;
}
.alert-text p {
  font-size: 17px;
}
.alert-text b {
  font-size: 20px;
}
.table-custom {
  background-color: rgba(255, 255, 255, 0);
  color: white;
  height: 350px;
}
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
