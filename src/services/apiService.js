import axiosInstance from "@/plugins/axios";

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
    const res = await axiosInstance.put('api/Auth/ConfirmCreateNewPassword',val);
    return res.data;
  },

  //api UserService
  async GetInforMyself() {
    const res = await axiosInstance.get('api/User/GetInforMyself');
    return res.data;
  },
  async ChangePassword(val) {
    const res = await axiosInstance.put('api/Auth/ChangePassword',val);
    return res.data;
  },
  async GetAllUser() {
    const res = await axiosInstance.get('api/User/GetAllUser');
    return res.data;
  },
  async GetAllUserOfTeam(teamId) {
    const res = await axiosInstance.get('api/User/GetAllUserOfTeam?teamId='+teamId);
    return res.data;
  },


  //api TeamService
  async GetAllTeam() {
    const res = await axiosInstance.get('api/Team/GetAllTeam');
    return res.data;
  },
  async AddEmployeeToTeam(userId,teamId) {
    const res = await axiosInstance.put('api/Team/AddEmployeeInTeam?userId='+userId+'&teamId='+teamId);
    return res.data;
  },
  async CreateTeam(val) {
    const res = await axiosInstance.post('api/Team/CreateTeam',val);
    return res.data;
  },
  async DeleteTeamById(id) {
    const res = await axiosInstance.delete('api/Team/DeleteTeamById?teamId='+id);
    return res.data;
  },
  async UpdateTeam(id,val) {
    const res = await axiosInstance.put(`api/Team/UpdateTeam?teamId=${id}`,val);
    return res.data;
  },

  //api ProjectService
  async GetAllProject() {
    const res = await axiosInstance.get('api/Project/GetAllProject');
    return res.data;
  },
  async GetAllProjectOfUser() {
    const res = await axiosInstance.get('api/Project/GetAllProjectOfUser');
    return res.data;
  },
  async CreateProject(val) {
    const res = await axiosInstance.post('api/Project/CreateProject',val);
    return res.data;
  },
};