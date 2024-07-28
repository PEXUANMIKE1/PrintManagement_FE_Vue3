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
              <v-col cols="2" style="color:aquamarine" @click="ProjectDetail()">
                <v-icon>mdi-projector-screen-outline</v-icon>
              </v-col>
              <v-col cols="1" style="color: aquamarine" class="icon-chevron">
                <v-icon>mdi-chevron-right</v-icon>
              </v-col>
              <v-col cols="2" style="color: aquamarine">
                <v-icon>mdi-file-document-outline</v-icon>
              </v-col>
              <v-col cols="1" class="icon-chevron">
                <v-icon>mdi-chevron-right</v-icon>
              </v-col>
              <v-col cols="2" @click="ProjectPrint()"><v-icon>mdi-printer</v-icon></v-col>
              <v-col cols="1" class="icon-chevron">
                <v-icon>mdi-chevron-right</v-icon>
              </v-col>
              <v-col cols="2" @click="ProjectDelivery()"><v-icon>mdi-cart</v-icon></v-col>
            </v-row>
            <v-row class="text-step">
              <v-col cols="2" style="color: aquamarine"><p>Dự án</p></v-col>
              <v-col cols="1" style="color: aquamarine"></v-col>
              <v-col cols="2" style="color: aquamarine"><p>Thiết kế</p></v-col>
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
        <v-col cols="8">
          <v-row>
            <v-col cols="4" v-for="item in paginatedDesigns" :key="item.id">
              <v-card
                class="card-project elevation-6 rounded-lg"
                @click="selectCard(item.id)"
                :class="{ 'selected-card': selectedCardId === item.id }"
              >
                <v-img
                  class="img-card-project"
                  height="400px"
                  :src="baseImgUrl + item.filePath"
                />
                <v-card-text>
                  <b>Người tạo: </b>{{ item.designerName }} <br />
                  <b>Ngày tạo: </b>{{ formatDateTime(item.designTime) }} <br />
                  <b>Trạng thái: </b>{{ item.designStatus }}
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-pagination
            v-if="Designs != null"
            v-model="currentPage"
            :length="pageCount"
          ></v-pagination>
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
                    <b>Dự án: </b>{{ projectDetail.projectName }}
                  </div>
                  <div class="mb-3">
                    <b>Khách hàng: </b>{{ projectDetail.customerName }}
                  </div>
                  <div class="mb-3">
                    <b>Nhân viên phụ trách: </b>{{ projectDetail.employeeName }}
                  </div>
                  <div class="mb-3">
                    <b>Yêu cầu của khách hàng: </b
                    >{{ projectDetail.requestDescriptionFromCustomer }}
                  </div>
                </v-card-text>
              </v-card>
            </v-card-text>
          </v-card>
          <v-col v-if="hasRole('Employee') && user.teamName == 'Sales' && designApproved == false && Designs">
            <v-select
              v-model="designStatus"
              class="btn-custom"
              clearable
              variant="outlined"
              placeholder="Phê duyệt/Không phê duyệt"
              :items="['Phê duyệt', 'Không phê duyệt']"
            />
          </v-col>
          <v-col v-if="hasRole('Employee') && user.teamName == 'Sales' && designApproved == false && Designs">
            <v-btn class="btn-custom" color="yellow" @click="ApproveDesign">
              <b>Phê duyệt</b><span class="mdi mdi-arrow-right"></span>
            </v-btn>
          </v-col>
        </v-col>
      </v-row>
      <v-row
        v-if="
          hasRole('Design') &&
          user.teamName == 'Technical' &&
          projectDetail.projectStatus == 'Designing'
        "
        class="mx-7"
      >
        <v-col cols="2">
          <v-btn
            @click="showInputFile = true"
            class="btn-file"
            variant="outlined"
            ><span class="mdi mdi-file text-h5"></span>Tải file</v-btn
          >
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <!-- show input file -->
  <v-overlay
    v-model="showInputFile"
    opacity="0.7"
    :scrim="true"
    class="d-flex align-center justify-center"
  >
    <v-card
      class="elevation-12 rounded-lg text-center"
      style="width: 450px; margin: auto; height: 200px"
    >
      <v-card-title>Tải file ảnh</v-card-title>
      <v-card-text>
        <v-file-input
          v-model="filePath"
          type="file"
          clearable
          label="File"
          variant="outlined"
        ></v-file-input>
      </v-card-text>
      <v-card-actions class="d-flex align-center justify-end mb-3">
        <v-btn
          @click="AddDesignInProject"
          class="mx-2"
          variant="tonal"
          color="blue"
          type="submit"
        >
          Thêm mới
        </v-btn>
        <v-btn
          @click="showInputFile = false"
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
import useAlert from "@/plugins/Alert";
import apiService from "@/services/apiService";
import routerLink from "@/router";
import format from "@/plugins/Format";
import { useStore } from "vuex";

const store = useStore();
const hasRole = (role) => store.getters.hasRole(role);
const user = computed(() => store.state.user);

const { ToggleShowAlert } = useAlert();
const { formatDateTime } = format();
const router = useRoute();
const projectId = ref(null);

const baseImgUrl = "https://localhost:7262/Upload/Files/";

//phân trang
const currentPage = ref(1);
const itemsPerPage = 3;
const pageCount = computed(() =>
  Math.ceil((Designs.value?.length ?? 0) / itemsPerPage)
);
const paginatedDesigns = computed(() => {
  if (!Designs.value || !Array.isArray(Designs.value)) {
    return [];
  }
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return Designs.value.slice(start, end);
});

// thêm thiết kế
const showInputFile = ref(false);
const filePath = ref(null);
const AddDesignInProject = async () => {
  try {
    if (filePath.value == null || projectId.value == null) {
      await ToggleShowAlert("Yêu cầu nhập đầy đủ thông tin", "error");
      return;
    }
    // Lấy đuôi file
    const allowedExtensions = ["jpg", "jpeg", "png"];
    const fileExtension = filePath.value.name.split(".").pop().toLowerCase();

    // Kiểm tra đuôi file có trong danh sách allowedExtensions không
    if (!allowedExtensions.includes(fileExtension)) {
      await ToggleShowAlert("Định dạng tệp không được hỗ trợ", "error");
      return;
    }
    let formData = new FormData();
    formData.append("ProjectId", projectId.value);
    formData.append("FilePath", filePath.value);

    console.log(formData);
    var res = await apiService.AddDesignInProject(formData);
    //console.log(res);
    if (res.status != 201) {
      await ToggleShowAlert(res.message, "error");
      return;
    }
    showInputFile.value = false;
    await ToggleShowAlert(res.message, "success");
    filePath.value = null;
    GetDesignsOfProject(projectId.value);
  } catch (error) {
    console.log(error);
  }
};

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
// go to project detail
const ProjectDetail = async () => {
  try {
    //console.log(projectId.value);
    routerLink.push(`/projects-detail/${projectId.value}`);
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

// kiểm tra bản thiết kế đã được phê duyệt hay chưa
const designApproved = computed(() => {
  if (Designs.value) {
    //console.log(Designs.value);
    return Designs.value.some((design) => design.designStatus == "Approved");
  }
  return false;
});

// duyệt hoặc k duyệt thiết kế

const designStatus = ref(null);
const designId = ref(null);
const selectedCardId = ref(null);

const selectCard = (id) => {
  selectedCardId.value = id;
  designId.value = id;
  //console.log(id);
};

const ApproveDesign = async () => {
  try 
  {
    // console.log(projectId.value);
    // console.log(designId.value);
    // console.log(designStatus.value);
    if(projectId.value == null || designId.value == null || designStatus.value==null){
      await ToggleShowAlert("Bạn chưa chọn thiết kế hoặc chưa chọn trạng thái", "error");
      return;
    }
    var designstatus = "";
    if(designStatus.value == "Phê duyệt"){
      designstatus = "Approve";
    }else{
      designstatus = "Reject";
    }
    var res = await apiService.ApproveDesign(projectId.value, designId.value, designstatus);
    //console.log(res);
    if (res.status != 200) {
      await ToggleShowAlert(res.message, "error");
      return;
    }
    GetDesignsOfProject(projectId.value);
    designStatus.value = "";
    designId.value = "";
    await ToggleShowAlert(res.message, "success");
  } 
  catch (err) {
    console.error(err);
  }
};

//get design
const Designs = ref(null);
const GetDesignsOfProject = async (id) => {
  try {
    var res = await apiService.GetDesignsOfProject(id);
    Designs.value = res.data;
    //console.log(res);
  } catch (error) {
    console.log(error);
    ToggleShowAlert(error.message, "error");
  }
};
onMounted(() => {
  projectId.value = router.params.id;
  GetProjectDetail(projectId.value);
  GetDesignsOfProject(projectId.value);
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
  transition: all 0.3s ease;
}
.selected-card {
  box-shadow: 0 0 0 3px #e5e91e !important;
  transform: scale(1.05);
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
.btn-file {
  width: 130px;
  height: 40px;
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
