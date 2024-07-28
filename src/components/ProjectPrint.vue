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
          >
            <span class="mdi mdi-file-excel-box text-h4"></span>
          </v-btn>
        </v-col>
      </v-row>
      <hr />
    </v-card-title>
    <v-card-text>
      <v-cow class="d-flex align-center justify-center">
        <v-col cols="6" class="text-center">
          <v-card class="card-project2 elevation-0 text-h5">
            <v-row class="icon-step">
              <v-col
                cols="2"
                style="color: aquamarine"
                @click="ProjectDetail()"
              >
                <v-icon>mdi-projector-screen-outline</v-icon>
              </v-col>
              <v-col cols="1" style="color: aquamarine" class="icon-chevron">
                <v-icon>mdi-chevron-right</v-icon>
              </v-col>
              <v-col
                cols="2"
                style="color: aquamarine"
                @click="ProjectDesign()"
              >
                <v-icon>mdi-file-document-outline</v-icon>
              </v-col>
              <v-col cols="1" style="color: aquamarine" class="icon-chevron">
                <v-icon>mdi-chevron-right</v-icon>
              </v-col>
              <v-col cols="2" style="color: aquamarine"
                ><v-icon>mdi-printer</v-icon></v-col
              >
              <v-col cols="1" class="icon-chevron">
                <v-icon>mdi-chevron-right</v-icon>
              </v-col>
              <v-col cols="2" @click="ProjectDelivery()"
                ><v-icon>mdi-cart</v-icon></v-col
              >
            </v-row>
            <v-row class="text-step">
              <v-col cols="2" style="color: aquamarine"><p>Dự án</p></v-col>
              <v-col cols="1" style="color: aquamarine"></v-col>
              <v-col cols="2" style="color: aquamarine"><p>Thiết kế</p></v-col>
              <v-col cols="1" style="color: aquamarine"></v-col>
              <v-col cols="2" style="color: aquamarine"><p>In ấn</p></v-col>
              <v-col cols="1"></v-col>
              <v-col cols="2"><p>Giao hàng</p></v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-cow>
      <hr />
      <v-row>
        <v-col cols="4" class="mt-4">
          <div class="text-label">Mã đơn hàng</div>
          <v-text-field
            v-model="tradingCode"
            variant="outlined"
            placeholder="Mã đơn hàng"
            disabled
          />
          <div class="text-label">Quản lý</div>
          <v-text-field
            v-model="managerName"
            variant="outlined"
            placeholder="Quản lý"
            disabled
          />
          <div class="text-label">Trạng thái</div>
          <v-text-field
            v-model="billStatus"
            variant="outlined"
            placeholder="Trạng thái"
            disabled
          />
          <div
            v-if="
              projectDetail.projectStatus == 'ConfirmPrint' &&
              user.fullName == projectDetail.employeeName
            "
            class="text-label"
          >
            Loại máy móc
          </div>
          <v-select
            v-if="
              projectDetail.projectStatus == 'ConfirmPrint' &&
              user.fullName == projectDetail.employeeName
            "
            v-model="selectedEquipment"
            variant="outlined"
            placeholder="Chọn loại máy"
            :items="equipment"
            item-title="propertyDetailName"
            item-value="id"
            return-object
            @update:model-value="handleEquipmentChange"
          >
          </v-select>
        </v-col>
        <v-col cols="4" class="mt-4">
          <div class="text-label">Tên đơn hàng</div>
          <v-text-field
            v-model="billName"
            variant="outlined"
            placeholder="Tên đơn hàng"
            disabled
          />
          <div class="text-label">Ngày đặt</div>
          <v-text-field
            v-model="startDate"
            variant="outlined"
            placeholder="Ngày đặt"
            disabled
          />
          <v-table
            v-if="
              projectDetail.projectStatus == 'ConfirmPrint' &&
              user.fullName == projectDetail.employeeName
            "
            class="mt-8 table-custom"
            theme="dark"
          >
            <thead class="header-table">
              <tr>
                <th class="text-left">Tài nguyên</th>
                <th class="text-left">Số lượng</th>
              </tr>
            </thead>
            <tbody class="body-table">
              <tr v-for="item in resources" :key="item.id">
                <td>{{ item.propertyDetailName }}</td>
                <td>
                  <input
                    class="input-quantity"
                    v-model="item.quantity"
                    type="number"
                    min="0"
                    @input="updateSelectedResources(item)"
                  />
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
        <v-col cols="4">
          <v-card class="card-project elevation-6 rounded-lg">
            <v-card-title>
              <b class="text-h6">Thông tin dự án</b>
            </v-card-title>
            <v-col cols="4">
              <v-img
                :src="baseImgUrl + projectDetail.projectImg"
                class="img-card-project"
              >
              </v-img>
            </v-col>
            <v-card-text>
              <v-row>
                <v-col cols="4"><b>Tên dự án: </b></v-col>
                <v-col cols="8" class="d-flex align-center justify-end">
                  {{ projectDetail.projectName }}
                </v-col>
              </v-row>
              <v-row class="mb-3">
                <v-col cols="4"><b>Giá dự án: </b></v-col>
                <v-col cols="8" class="d-flex align-center justify-end">
                  {{ bill.totalMoney }} ₫
                </v-col>
              </v-row>
            </v-card-text>
            <hr />
            <v-card-text>
              <v-row>
                <v-col cols="4"><b>Thành tiền: </b></v-col>
                <v-col cols="8" class="d-flex align-center justify-end">
                  {{ bill.totalMoney }} ₫
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <v-col
            v-if="
              user.fullName == projectDetail.employeeName &&
              projectDetail.projectStatus == 'Designed'
            "
          >
            <v-btn
              class="btn-custom"
              color="yellow"
              @click="createPrintJobsAndBill"
            >
              <b>Tạo đơn in ấn</b>
            </v-btn>
          </v-col>
          <v-col
            v-if="
              user.fullName == projectDetail.employeeName &&
              projectDetail.projectStatus == 'ConfirmPrint'
            "
          >
            <v-btn class="btn-custom" color="yellow" @click="startPrintJobs">
              <b>Bắt đầu in</b>
            </v-btn>
          </v-col>
          <v-col
            v-if="
              user.fullName == projectDetail.employeeName &&
              projectDetail.projectStatus == 'Printing'
            "
          >
            <v-btn
              class="btn-custom"
              color="yellow"
              @click="CompletingPrintJobs"
            >
              <b>Hoàn thành in ấn</b>
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
import useAlert from "@/plugins/Alert";
import apiService from "@/services/apiService";
import routerLink from "@/router";
import format from "@/plugins/Format";
import { useStore } from "vuex";
const store = useStore();
//const hasRole = (role) => store.getters.hasRole(role);
const user = computed(() => store.state.user);

const { ToggleShowAlert } = useAlert();
const { formatDateTime } = format();
const router = useRoute();
const projectId = ref(null);
const baseImgUrl = "https://localhost:7262/Upload/Files/";

//get project
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

//get bill
const bill = ref(null);
const tradingCode = computed(() => {
  return bill.value ? bill.value.tradingCode : "";
});
const billName = computed(() => {
  return bill.value ? bill.value.billName : "";
});
const managerName = computed(() => {
  return bill.value ? bill.value.employeeName : "";
});
const billStatus = computed(() => {
  return bill.value ? bill.value.billStatus : "";
});
const startDate = computed(() => {
  return bill.value ? formatDateTime(bill.value.createTime) : "";
});
const GetBillByProjectId = async (id) => {
  try {
    var res = await apiService.GetBillByProjectId(id);
    //console.log(res);
    bill.value = res.data;
  } catch (error) {
    console.log(error);
    ToggleShowAlert(error.message, "error");
  }
};

//get all Resource property detail
const equipment = ref([]);
const resources = ref([]);
const selectedEquipment = ref(null);
const selectedResources = ref({});

//khi chọn value thì thêm vào selectedResources với key: propertyDetailName, value: quantity
const handleEquipmentChange = (Value) => {
  if (Value) {
    selectedResources.value[Value.id] = 1;
  }
};

//khi có mỗi trường thay đổi thì thêm vào selectedResources với key: propertyDetailName, value: quantity
const updateSelectedResources = (item) => {
  if (item.quantity > 0) {
    selectedResources.value[item.id] = parseInt(item.quantity);
  } else {
    delete selectedResources.value[item.id];
  }
};

//tạo 1 object truyền selectedResources vào để xử lý trong apiService
const getSelectedResourcesForAPI = () => {
  return Object.entries(selectedResources.value).map(([id, quantity]) => {
    // Tìm item trong resources hoặc equipment
    const resourceItem =
      resources.value.find((r) => r.id === parseInt(id)) ||
      equipment.value.find((e) => e.id === parseInt(id));

    return {
      id: parseInt(id),
      quantity,
      price: resourceItem ? resourceItem.price : 0,
      resourceName: resourceItem ? resourceItem.resourceName : "",
    };
  });
};
const startPrintJobs = async () => {
  try {
    if (getSelectedResourcesForAPI().length === 0) {
      ToggleShowAlert("Bạn chưa chọn tài nguyên", "error");
    } else {
      var data = getSelectedResourcesForAPI();
      console.log(data,projectId.value);
      var res = await apiService.StartPrintJobs(projectId.value, data);
      console.log(res);
      if (res.status != 200) {
        GetBillByProjectId(projectId.value);
        ToggleShowAlert(res.message, "error");
        return;
      }
      GetBillByProjectId(projectId.value);
      GetProjectDetail(projectId.value);
      ToggleShowAlert(
        "Đơn đã được gửi xuống xưởng in. Vui lòng chờ hoàn thành!",
        "success"
      );
    }
  } catch (error) {
    console.log(error);
  }
};

const propertyDetails = ref(null);
const GetAllPropertyDetail = async () => {
  try {
    var res = await apiService.GetAllPropertyDetail();
    //console.log(res);
    propertyDetails.value = res.data;
    if (propertyDetails.value) {
      propertyDetails.value.forEach((element) => {
        if (element.resourceName == "Equipment") {
          equipment.value.push(element);
        } else {
          resources.value.push(element);
        }
      });

      // console.log(equipment.value);
      // console.log(resources.value);
    }
  } catch (error) {
    console.log(error);
    ToggleShowAlert(error.message, "error");
  }
};
// create PrintJobs
const createPrintJobsAndBill = async () => {
  try {
    //console.log(projectId.value);
    var res1 = await apiService.CreateBill(projectId.value);
    var res2 = await apiService.CreatePrintJobs(projectId.value);
    console.log(res1, res2);
    if (res1.status != 201 || res2.status != 201) {
      ToggleShowAlert(res1.message, "error");
      return;
    }
    GetBillByProjectId(projectId.value);
    GetProjectDetail(projectId.value);
    ToggleShowAlert(res2.message, "success");
  } catch (error) {
    console.log(error.message);
  }
};

//completing Print Jobs
const CompletingPrintJobs = async () => {
  try {
    var res = await apiService.CompletingPrintJobs(projectId.value);
    //console.log(res);
    if (res.status != 200) {
      ToggleShowAlert(res.message, "error");
      return;
    }
    GetBillByProjectId(projectId.value);
    GetProjectDetail(projectId.value);
    ToggleShowAlert(res.message, "success");
  } catch (error) {
    console.log(error.message);
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
// go to project design btn
const ProjectDesign = async () => {
  try {
    //console.log(projectId.value);
    routerLink.push(`/projects-design/${projectId.value}`);
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
  GetBillByProjectId(projectId.value);
  GetAllPropertyDetail();
});
</script>

<style scoped>
.text-label {
  font-size: 17px;
  margin-bottom: 7px;
}
.img-card-project {
  object-fit: cover;
  border-radius: 15px;
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
.table-custom {
  background-color: rgba(255, 255, 255, 0);
  color: white;
  height: 350px;
}
.input-quantity {
  border: 1px solid white;
  height: 40px;
  width: 80px;
  border-radius: 5px;
  color: white;
  text-align: center;
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
