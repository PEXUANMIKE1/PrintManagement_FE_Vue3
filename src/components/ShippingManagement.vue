<template>
  <v-card class="card-custom elevation-12 rounded-lg">
    <v-card-text class="rounded-lg">
      <v-row align-center no-gutters>
        <v-col cols="5">
          <v-text-field
            class="search"
            variant="outlined"
            placeholder="Tìm kiếm theo tên"
            clearable
            prepend-inner-icon="mdi mdi-magnify"
          />
        </v-col>
        <v-col cols="5">
          <v-select
            class="search"
            variant="outlined"
            label="Lọc theo trạng thái"
            clearable
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
  <!-- list bll delivery -->
  <div v-if="!loading">
    <v-card class="card-custom elevation-12 rounded-lg">
      <v-table fixed-header class="table-custom">
        <thead>
          <tr>
            <th class="text-left" width="300px">TÊN ĐƠN HÀNG</th>
            <th class="text-left">KHÁCH HÀNG</th>
            <th class="text-left">ĐỊA CHỈ</th>
            <th class="text-left">PHƯƠNG THỨC</th>
            <th class="text-left">NGƯỜI VẪN CHUYỂN</th>
            <th class="text-left">TRẠNG THÁI</th>
            <th class="text-center"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paginatedUsers" :key="item.name">
            <td>{{ item.projectName }}</td>
            <td>{{ item.customerName }}</td>
            <td>{{ item.deliveryAddress }}</td>
            <td>{{ item.shippingMethodName }}</td>
            <td>{{ item.deliverName }}</td>
            <td>{{ item.deliveryStatus }}</td>
            <td>
              <v-tooltip text="Xem chi tiết">
                <template v-slot:activator="{ props }">
                  <span
                    v-bind="props"
                    class="mdi mdi-dots-vertical"
                    @click="showDetail(item.id)"
                  >
                  </span>
                </template>
              </v-tooltip>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
    <v-pagination
      v-if="!loading && Deliverys != null"
      v-model="currentPage"
      :length="pageCount"
    ></v-pagination>
  </div>
  <!-- detail bill delivery -->
  <v-overlay
    v-model="ShowDetailBillDeliverys"
    opacity="0.7"
    :scrim="true"
    class="d-flex align-center justify-center"
  >
    <v-card
      class="elevation-12 rounded-lg"
      style="width: 500px; margin: auto; padding: 20px"
    >
      <v-card-title class="text-center"><b>Chi tiết đơn hàng</b></v-card-title>
      <v-card-text class="">
        <div class="text mt-4">
          Mã đơn hàng: {{ BillDeliverys.tradingCode }}
        </div>
        <div class="text mt-4">
          Giá đơn hàng: {{ BillDeliverys.totalMoney }}
        </div>
        <div class="text mt-4">Tên đơn hàng: {{ BillDeliverys.billName }}</div>
        <div class="text mt-4">
          Khách hàng: {{ BillDeliverys.customerName }}
        </div>
        <div class="text mt-4">Số điện thoại: {{ BillDeliverys.dDT }}</div>
        <div class="text mt-4">
          Địa chỉ giao hàng: {{ BillDeliverys.deliveryAddress }}
        </div>
        <div class="text mt-4">
          Phương thức vận chuyển: {{ BillDeliverys.shippingMethodName }}
        </div>
        <div class="text mt-4">
          Người giao hàng: {{ BillDeliverys.deliverName }}
        </div>
        <div class="text mt-4">
          Trạng thái đơn hàng: {{ BillDeliverys.deliveryStatus }}
        </div>
      </v-card-text>
      <v-card-text>
        <v-select
          v-if="BillDeliverys.deliveryStatus == 'InTransit'"
          v-model="selectStatus"
          variant="outlined"
          label="Câp nhật trạng thái đơn hàng"
          clearable
          :items="['Đã trả lại', 'Từ chối nhận', 'Đã giao hàng']"
        />
      </v-card-text>
      <v-card-actions class="d-flex align-center justify-end">
        <v-btn
          v-if="
            BillDeliverys.deliveryStatus == 'Pending' &&
            user.fullName == BillDeliverys.deliverName
          "
          @click="UpdateStatusDelivery('Xác nhận giao hàng')"
          type="submit"
          class="mx-2"
          variant="tonal"
          color="blue"
        >
          Xác nhận giao hàng
        </v-btn>
        <v-btn
          v-if="
            BillDeliverys.deliveryStatus == 'InTransit' &&
            user.fullName == BillDeliverys.deliverName
          "
          @click="UpdateStatusDelivery(selectStatus)"
          type="submit"
          class="mx-2"
          variant="tonal"
          color="blue"
        >
          Cập nhật
        </v-btn>
        <v-btn @click="closeDetail" class="mx-2" color="blue" variant="outlined"
          >Thoát
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-overlay>
</template>
<script setup>
import { computed, onMounted, ref } from "vue";
import apiService from "@/services/apiService";
import useAlert from "@/plugins/Alert";
import { useStore } from "vuex";

const store = useStore();
const user = computed(() => store.state.user);

const { ToggleShowAlert } = useAlert();

const loading = ref(true);

const currentPage = ref(1);
const itemsPerPage = 9;
const pageCount = computed(() =>
  Math.ceil(Deliverys.value.length / itemsPerPage)
);
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return Deliverys.value.slice(start, end);
});

//close detail
const closeDetail = () => {
  deliveryId.value = null;
  selectStatus.value = null;
  ShowDetailBillDeliverys.value = false;
};

// show detail bill delivery
const deliveryId = ref(null);

const ShowDetailBillDeliverys = ref(false);
const BillDeliverys = ref(null);

const showDetail = async (Id) => {
  deliveryId.value = Id;
  try {
    const response = await apiService.GetBillDeliveryById(Id);
    //console.log(response);
    if (response.status != 200) {
      await ToggleShowAlert(response.message, "error");
      return;
    }
    //console.log(response)
    BillDeliverys.value = response.data;
    ShowDetailBillDeliverys.value = true;

  } catch (err) {
    console.log(err.message);
  }
};

// update delivery status
const selectStatus = ref(null);

const UpdateStatusDelivery = async (status) => {
  try {
    if (status == null) {
      await ToggleShowAlert("Bạn chưa chọn trạng thái đơn hàng", "error");
      return;
    }
    console.log(deliveryId.value, status);
    const res = await apiService.UpdateStatusDelivery(deliveryId.value,status);
    console.log(res);
    if (res.status != 200) {
      await ToggleShowAlert(res.message, "error");
      return;
    }
    ShowDetailBillDeliverys.value = false;
    
    fetchDeliveries();
    
    selectStatus.value = null;
    deliveryId.value = null;
    ToggleShowAlert(res.message, "success");
  } catch (err) {
    console.log(err.message);
  }
};

//get data bill delivery of user
const Deliverys = ref(null);
const fetchDeliveries = async () => {
  loading.value = true;
  try {
    const response = await apiService.GetDeliveryOfUser();
    //console.log(response);
    Deliverys.value = response.data;
  } catch (err) {
    console.log(err.message);
  } finally {
    loading.value = false;
  }
};
onMounted(() => {
  fetchDeliveries();
  //GetTeamByTeamName("Delivery");
});
</script>
<style scoped>
.text {
  font-size: 16px;
  font-weight: 500;
}
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
