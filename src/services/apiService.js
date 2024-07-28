import axiosInstance from "@/plugins/axios";
import store from "@/store";
import router from "@/router";

const handleApiCall = async (apiCall) => {
  try {
    const response = await apiCall();
    //console.log(response);
    if (response.data.status == 401) {
      await store.dispatch('logout');
      router.push('/loginform');
    }
    return response.data;
  } catch (error) {
    // if (error.response && error.response.status === 401) {
    //   await store.dispatch('logout');
    //   router.push('/loginform');
    // }
    console.log(error);
    return error.response.data;
  }
};

export default {

  //api authService
  async Register(val) {
    const res = await axiosInstance.post('api/Auth/Register', val);
    return res.data;
  },
  async ConfirmEmail(val) {
    const res = await axiosInstance.post(`api/Auth/ConfirmEmail?confirmCode=${val}`);
    return res.data;
  },
  async ForgotPassword(val) {
    const res = await axiosInstance.post(`api/Auth/ForgotPassword?email=${val}`);
    return res.data;
  },
  async ConfirmCreateNewPass(val) {
    return handleApiCall(() => axiosInstance.put('api/Auth/ConfirmCreateNewPassword', val));
  },
  async ChangePassword(val) {
    return handleApiCall(() => axiosInstance.put('api/Auth/ChangePassword', val));
  },
  async ChangeRoleForUser(userId, role) {
    return handleApiCall(() => axiosInstance.put(`api/Auth/ChangeRoleForUser?userId=${userId}&role=${role}`));
  },
  async GetAllRole() {
    return handleApiCall(() => axiosInstance.get('api/Auth/GetAllRole'));
  },
  async GetRoleByUserId(userId) {
    return handleApiCall(() => axiosInstance.get(`api/Auth/GetRoleByUserId?userId=${userId}`));
  },

  //User Service
  async GetAllUser() {
    return handleApiCall(() => axiosInstance.get('api/User/GetAllUser'));
  },
  async GetAllUserOfTeam(teamId) {
    return handleApiCall(() => axiosInstance.get('api/User/GetAllUserOfTeam?teamId=' + teamId)); //cho thằng Admin
  },
  async GetAllMemberOfTeamNotManager(teamName) {
    return handleApiCall(() => axiosInstance.get('api/User/GetAllMemberOfTeamNotManager?teamName=' + teamName)); //Cho thằng trưởng phòng
  },
  async GetInforMyself() {
    return handleApiCall(() => axiosInstance.get('api/User/GetInforMyself'));
  },

  //Team Service
  async GetAllTeam() {
    return handleApiCall(() => axiosInstance.get('api/Team/GetAllTeam'));
  },
  async AddEmployeeToTeam(userId, teamId) {
    return handleApiCall(() => axiosInstance.put(`api/Team/AddEmployeeInTeam?userId=${userId}&teamId=${teamId}`));
  },
  async CreateTeam(val) {
    return handleApiCall(() => axiosInstance.post('api/Team/CreateTeam', val));
  },
  async DeleteTeamById(id) {
    return handleApiCall(() => axiosInstance.delete('api/Team/DeleteTeamById?teamId=' + id));
  },
  async UpdateTeam(id, val) {
    return handleApiCall(() => axiosInstance.put(`api/Team/UpdateTeam?teamId=${id}`, val));
  },
  async GetTeamByTeamName(name) {
    return handleApiCall(() => axiosInstance.get(`api/Team/GetTeamByTeamName?teamName=${name}`));
  },

  //api ProjectService

  async GetAllProject() {
    return handleApiCall(() => axiosInstance.get('api/Project/GetAllProject'));
  },
  async GetProjectById(id) {
    return handleApiCall(() => axiosInstance.get('api/Project/GetProjectById?projectId=' + id));
  },
  async GetCustomerOfProject(id) {
    return handleApiCall(() => axiosInstance.get('api/Project/GetCustomerOfProject?projectId=' + id));
  },
  async GetEmployeeOfProject(id) {
    return handleApiCall(() => axiosInstance.get('api/Project/GetEmployeeOfProject?projectId=' + id));
  },
  async GetAllProjectOfUser() {
    return handleApiCall(() => axiosInstance.get('api/Project/GetAllProjectOfUser'));
  },
  async CreateProject(val) {
    return handleApiCall(() => axiosInstance.post("api/Project/CreateProject", val));
  },

  //design service

  async AddDesignInProject(val) {
    return handleApiCall(() => axiosInstance.post("api/Design/AddDesignInProject", val, { headers: { 'Content-Type': 'multipart/form-data' } }));
  },
  async GetDesignsOfProject(id) {
    return handleApiCall(() => axiosInstance.get(`api/Design/GetDesignsOfProject?projectId=${id}`));
  },
  async ApproveDesign(projectId, designId, action) {
    return handleApiCall(() => axiosInstance.put(`api/Design/ApproveDesign?projectId=${projectId}&designId=${designId}&action=${action}`));
  },

  //Bill Service

  async GetBillByProjectId(id) {
    return handleApiCall(() => axiosInstance.get('api/Bill/GetBillByProjectId?projectId=' + id));
  },
  async CreateBill(id) {
    return handleApiCall(() => axiosInstance.post('api/Bill/CreateBill?projectId=' + id));
  },
  //PrintJobs Service 

  async GetPrintJobsByProjectId(id) {
    return handleApiCall(() => axiosInstance.get('api/PrintJobs/GetPrintJobsByProjectId?projectId=' + id));
  },
  async CreatePrintJobs(id) {
    return handleApiCall(() => axiosInstance.post('api/PrintJobs/CreatePrintJobs?projectId=' + id));
  },
  async StartPrintJobs(id,val) {
    return handleApiCall(() => axiosInstance.post(`api/PrintJobs/StartPrintJobs?projectId=${id}`,val));
  },
  async CompletingPrintJobs(id) {
    return handleApiCall(() => axiosInstance.put(`api/PrintJobs/CompletingPrintJobs?projectId=${id}`));
  },

  //propertyDetail
  async GetAllPropertyDetail() {
    return handleApiCall(() => axiosInstance.get('api/PropertyDetail/GetAllResourcePropertyDetail'));
  },


  //delivery service
  async CreateDelivery(val) {
    return handleApiCall(() => axiosInstance.post('api/Delivery/CreateDelivery', val));
  },
  async GetDeliveryByProjectId(id) {
    return handleApiCall(() => axiosInstance.get('api/Delivery/GetDeliveryByProjectId?projectId=' + id));
  },
  async GetDeliveryOfUser() {
    return handleApiCall(() => axiosInstance.get('api/Delivery/getDeliveryOfUser'));
  },
  async GetBillDeliveryById(id) {
    return handleApiCall(() => axiosInstance.get('api/Delivery/GetBillDeliveryById?deliveryId='+id));
  },

  async UpdateStatusDelivery(id,status) {
    return handleApiCall(() => axiosInstance.put(`api/Delivery/UpdateStatusDelivery?deliveryId=${id}&status=${status}`));
  },

  //Notification Service
  async GetAllNotifyOfUser() {
    return handleApiCall(() => axiosInstance.get("api/Notification/GetAllNotifyOfUser"));
  },
  async MarkAsSeenById(id) {
    return handleApiCall(() => axiosInstance.put("api/Notification/MarkAsSeenById?notifyId="+id));
  },
  async MarkAllAsSeenOfUser() {
    return handleApiCall(() => axiosInstance.put("api/Notification/MarkAllAsSeenOfUser"));
  },
};