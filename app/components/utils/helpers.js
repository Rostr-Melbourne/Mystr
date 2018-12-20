var axios = require("axios");

var helper = {
  // get department
  getAllDepartments: function() {
    return axios.get("/getAllDepartments");
  },

  //
  getAllEmployees: function() {
    return axios.get("/getAllEmployees");
  },

  getCurrentUser: function() {
    return axios.get("/user");
  },

  // errorMessage: function() {
  //   return axios.get("/register");
  // },


  getEmployee: function(id) {
    return axios.get("/getEmployee/" + id);
  },

  getEmpSchedules:function() {
    return axios.get('/getEmpSchedules')
    .then(function(response){
        return response;
    })
  },

  addEmpSchedule:function(emp_id, firstName, lastName, depart, phone) {
    return axios.post('/addEmpSchedule', {
      emp_id: emp_id,
      firstName: firstName,
      lastName: lastName,
      department: depart,
      phone: phone
    });
  },

  updateEmpSchedule: function(empSchedule) {
    return axios.put('/updateSchedule/' + empSchedule._id, {
      employeeSchedule: empSchedule
    });
  },

  addEmployee: function(firstName, lastName, email, phone, phoneType, password, department) {
    return axios.post("/addEmployee", {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        phoneType: phoneType,
        password: password,
        department: department });
  },

  updateEmployee: function(id, firstName, lastName, email, phone, phoneType, password, department) {
       return axios.put("/updateEmployee/" + id, {
           firstName: firstName,
           lastName: lastName,
           email: email,
           phone: phone,
           phoneType: phoneType,
           password: password,
           department: department
       });
  },

  updateEmpName: function(emp_id, firstName, lastName)  {
    return axios.put("/updateEmpName/" + emp_id, {
        firstName: firstName,
        lastName: lastName
       });
  },

  removeEmployee: function(id) {
    return axios.put("/removeEmployee/" + id);
  },

  removeEmpSchedule: function(emp_id) {
    return axios.put("/removeEmpSchedule/" + emp_id);
  },

  getAnnouncements: function() {
    return axios.get("/getAnnouncements");
  },

  addAnnouncements: function(title, content) {
    return axios.post("/addAnnouncements", {
        title: title,
        content: content });
  }
};

module.exports = helper;
