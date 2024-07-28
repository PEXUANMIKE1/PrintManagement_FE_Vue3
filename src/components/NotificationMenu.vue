<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    location="bottom end"
    origin="top end"
  >
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind="props" :color="unReadCount > 0 ? 'error' : 'default'">
        <v-icon>mdi-bell</v-icon>
        <v-badge
          v-if="unReadCount > 0"
          :content="unReadCount.toString()"
          color="error"
          floating
        ></v-badge>
      </v-btn>
    </template>

    <v-card min-width="300" max-width="400">
      <v-list>
        <v-list-subheader
          >Thông báo ({{ unReadCount }} chưa đọc)</v-list-subheader
        >
        <v-list-item
          class="notification-item"
          v-for="notification in notifications"
          :key="notification.id"
          :to="notification.link"
          @click="markAsSeen(notification.id)"
        >
          <template v-slot:prepend>
            <v-icon :color="notification.isSeen ? 'grey' : 'error'">
              {{ notification.isSeen ? "mdi-check-circle" : "mdi-circle" }}
            </v-icon>
          </template>
          <v-list-item-title class="notification-content mb-2">{{ notification.content }}</v-list-item-title>
          <v-list-item-subtitle>
            {{ formatDate(notification.createTime) }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn v-if="notifications && notifications.filter(n => !n.isSeen).length > 0" text @click="markAllAsSeen">Đánh dấu tất cả là đã đọc</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import apiService from "@/services/apiService";
import { useStore } from "vuex";

const store = useStore();
const user = computed(() => store.state.user);

const menu = ref(false);

const notifications = ref([]);

const unReadCount = computed(() => {
  return notifications.value ? notifications.value.filter((n) => !n.isSeen).length : 0;
});

const markAsSeen = async (id) => {
  const notification = notifications.value.find(n => n.id === id);
  if (notification && !notification.isSeen) {
    try {
      await apiService.MarkAsSeenById(id);
      notification.isSeen = true; // Cập nhật trạng thái đã xem
      menu.value = false;
    } catch (error) {
      console.log(error);
    }
  }
  menu.value = false;
};

const markAllAsSeen = async () => {
  const unSeenNotifications = notifications.value.filter(n => !n.isSeen);
  if (unSeenNotifications.length > 0) {
    try {
      await apiService.MarkAllAsSeenOfUser();
      unSeenNotifications.forEach(n => n.isSeen = true); // Cập nhật trạng thái đã xem cho tất cả thông báo
      menu.value = false;
    } catch (error) {
      console.log(error);
    }
  }
  menu.value = false;
};

function formatDate(date) {
  return new Date(date).toLocaleString();
}

// get notify of user
const GetAllNotifyOfUser = async (userId) => {
  try {
    var res = await apiService.GetAllNotifyOfUser(userId);
    notifications.value = res.data;
  } catch (error) {
    console.log(error);
  }
}

onMounted(() => {
  GetAllNotifyOfUser(user.value.id);
});
</script>
<style scoped>
.notification-content {
  white-space: normal;
  word-break: break-word;
  overflow-wrap: break-word;
  max-height: 60px; /* Điều chỉnh chiều cao tối đa nếu cần */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Số dòng tối đa muốn hiển thị */
  -webkit-box-orient: vertical;
}
.notification-item{
  cursor: pointer;
  border: 2px solid white;
  background-color: rgb(243, 242, 242);
}
</style>