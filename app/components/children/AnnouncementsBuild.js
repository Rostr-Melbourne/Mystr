var React = require("react");
var helpers = require("../utils/helpers");

var AnnouncementsBuild = React.createClass({
  getInitialState: function () {
    return {
      location: "",
      content: "",
      departments: [],
      sendTo: "all",
      empSchedules: [],
      day: "",
      time: "",
      wordCount: 0
    };
  },

  componentDidMount: function () {
    helpers.getAllDepartments().then(
      function (response) {
        this.setState(
          {
            departments: response.data.department
          },
          this.setState({ isLoaded: true })
        );
      }.bind(this)
    );
    helpers.getEmpSchedules().then(
      function (response) {
        if (response !== this.state.empSchedules) {
          this.setState({ empSchedules: response.data, wordCount: $(".preview").text().length });

        }
      }.bind(this)
    );
  },

  handleAnnouncementBuild(event) {
    this.setState({ [event.target.id]: event.target.value });
  },

  wordCount(event) {
    this.setState({ wordCount: $(".preview").text().length });
  },

  handleManagerSelect(event) {
    this.setState({ [event.target.name]: event.target.value, wordCount: $(".preview").text().length + event.target.value.length });
  },

  setTime(event) {
    this.setState({ time: event.target.value });
  },

  addAnnouncements: function (event) {
    event.preventDefault(event);
    helpers.addAnnouncements(this.state.location, this.state.content).then(
      function (response) {
        this.clearStates();
      }.bind(this)
    );
    Materialize.toast("Announcement added", 3000);
    this.clearForm();
  },

  clearForm: function () {
    var elements = document.getElementsByTagName("input");
    for (var i = 0; i < elements.length; i++) {
      elements[i].value = "";
      elements[i].classList.remove("valid");
    }
  },

  clearStates: function () {
    this.setState({ location: "", content: "" });
  },

  handleUpdateEmpSchedule: function (event) {

    var toArray = [];

    // loop through all employees
    this.state.empSchedules.map((person, i) => {
      if (this.state.sendTo == "all") {
        person = this.assignSchedule(person);
        toArray.push(person.phoneCode);

      } else if (person.department == this.state.sendTo) {
        person = this.assignSchedule(person);
        toArray.push(person.phoneCode);
      }
    });

    // send out the text blast
    this.prepareSMS(toArray);
  },

  // assign announcement to this person
  assignSchedule: function (person) {
    person[this.state.day] = this.state.time;
    person[this.state.day + "_location"] = this.state.location;
    person[this.state.day + "_des"] = this.state.content;
    person[this.state.day + "_accept"] = 0;

    helpers.updateEmpSchedule(person).then(
      function (response) {
        var empName = person.firstName + " " + person.lastName + "'s ";
        Materialize.toast(empName + "schedule updated", 2000);
      }.bind(this)
    );

    return person; // BIG STRETCH
  },

  // blast out text messages
  prepareSMS: function (toArray) {

    // prepare string
    var textBody = "Location: " + this.state.location +
      " Time: " + this.state.time + " " + this.state.day +
      " Description: " + this.state.content +
      "\nRespond with y-" + this.state.day.slice(0, 3) +
      " or n-" + this.state.day.slice(0, 3);

    // send phone array and text to backend
    $.ajax({
      url: "/sms-send",
      type: "post",
      data: {
        to: toArray,
        des: textBody,
      }
    })
  },

  render: function () {
    return (
      <div className="card-panel">
        <div className="row">
          <div className="col s12">
            <h5>Assign new shifts</h5>
          </div>
        </div>
        <form onSubmit={this.addAnnouncements}>
          <select
            className="browser-default"
            name="sendTo"
            onChange={this.handleManagerSelect}
          >
            <option value="all">All Departments</option>
            {this.state.isLoaded ? (
              this.state.departments.map((each, i) => {
                return (
                  <option key={i} value={each}>
                    {each}
                  </option>
                );
              })
            ) : (
                <option>Nothing</option>
              )}
          </select>
          <br />
          <select
            className="browser-default"
            name="day"
            onChange={this.handleManagerSelect}
          >
            <option value="">Select a day</option>
            <option value="monday">Monday</option>
            <option value="tuesday">Tuesday</option>
            <option value="wednesday">Wednesday</option>
            <option value="thursday">Thursday</option>
            <option value="friday">Friday</option>
            <option value="saturday">Saturday</option>
            <option value="sunday">Sunday</option>
          </select>
      

          <div className="row">
            <div className="input-field col s12">
              <input
                placeholder="Job location"
                id="location"
                type="text"
                className="validate"
                value={this.state.location}
                onChange={this.handleAnnouncementBuild} onKeyDown={this.wordCount} onKeyUp={this.wordCount}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="input-field col s12">
              <input type="text" placeholder="Time" onInput={this.setTime} onKeyDown={this.wordCount} onKeyUp={this.wordCount}/>

            </div>
          </div>

          <div className="row">
            <div className="input-field col s12">
              <textarea
                placeholder="Description"
                id="content"
                type="text"
                className="materialize-textarea"
                value={this.state.content}
                onChange={this.handleAnnouncementBuild} onKeyDown={this.wordCount} onKeyUp={this.wordCount}
                required
              />

            </div>
          </div>
          {(this.state.wordCount > 160) ?
          <div className="row">
              <div className="col s12">
                 <div className="alert"><strong>Oh snap!</strong> You exceeded 160 characters. This will result in charging <strong>twice as much.</strong></div>
              </div>
          </div>: null}
          <div className="row">
            <div className="col s12">
            <h5>PREVIEW</h5>
              <div className="preview">
              Location: {this.state.location} Time: {this.state.time} {this.state.day} Description: {this.state.content}<br />
              Respond with y-{this.state.day.slice(0, 3)} or n-{this.state.day.slice(0, 3)}
              </div>
              <div className="wordCount">
                  Character count: {this.state.wordCount} / 160
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col s12">
              <button
                className="btn waves-effect waves-light btn-large green accent-3 loginButtons"
                type="submit"
                value="Submit"
                name="action"
                onClick={this.handleUpdateEmpSchedule}
              >
                Submit<i className="material-icons right">add</i>
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
});

module.exports = AnnouncementsBuild;
