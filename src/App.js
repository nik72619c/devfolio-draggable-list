import React from "react";
import axios from "axios";
import "./App.css";
import { IoIosCloseCircleOutline } from "react-icons/io";
import {skillsRef} from './firebase'

export default class App extends React.Component {
  state = {
    items: [],
    skills: [],
    searchedOptions: [],
    isOptionsVisible: false
  };

  onDragStart = (e, index) => {
    this.draggedItem = this.state.items[index];
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.parentNode);
    e.dataTransfer.setDragImage(e.target, 20, 20);
  };

  onDragOver = index => {
    const draggedOverItem = this.state.items[index];

    if (this.draggedItem === draggedOverItem) {
      return;
    }

    let items = this.state.items.filter(item => item !== this.draggedItem);

    items.splice(index, 0, this.draggedItem);

    this.setState({ items });
  };

  onDragEnd = () => {
    this.draggedIdx = null;
  };

  fetchSkills = () => {
  skillsRef.once("value", snapshot => {
      this.setState({items: snapshot.val() || []})
  });
};


  async componentDidMount() {
    try {
      this.fetchSkills();
      let result = await axios.get(
        "https://api.stackexchange.com/2.2/tags?order=desc&sort=popular&site=stackoverflow"
      );
      console.log(result);
      let skills = result.data.items.map(item => item.name);
      this.setState({ skills });
    } catch (e) {
      alert(
        "oops ! something went wrong...please check the logs to learn more"
      );
      console.log(e);
    }
  }

  setFocus = () => this.setState({ isOptionsVisible: true });

  removeFocus = () => {
    setTimeout(() => {
        this.setState({ isOptionsVisible: false });
    }, 500);
  
  }
  saveSkills = () => {
  skillsRef.set(this.state.items);
};

  handleChange = e => {
    let suggestedSkills = this.state.skills.filter(skill =>
      skill.includes(e.target.value)
    );
    this.setState({ searchedOptions: suggestedSkills });
  };

  selectSkill = e => {
    this.state.items.push(e.target.firstChild.nodeValue);
    this.setState({
      items: this.state.items,
      isOptionsVisible: false,
      searchedOptions: []
    });
    document.getElementsByClassName("input-skill")[0].value = "";
    this.saveSkills();
  };

  render() {
    return (
      <div className="App">
        <main className="main">
          <h6>Things you mention here will help hackathon members in assessing you as a potential participant</h6>
          <ul>
            {this.state.items.map((item, idx) => (
              <li
                key={item}
                onDragOver={() => this.onDragOver(idx)}
                className="drag"
                draggable
                onDragStart={e => this.onDragStart(e, idx)}
                onDragEnd={this.onDragEnd}
              >
                <span className="content">
                  {idx + 1}. {item}
                </span>
                <IoIosCloseCircleOutline style={{ color: "black" }} />
              </li>
            ))}
            <li style={{ position: "relative", backgroundColor: "#CEFAF2" }}>
              <input
                list="skills"
                name="skills"
                type="text"
                className="input-skill"
                onFocus={this.setFocus}
                onBlur={this.removeFocus}
                onChange={this.handleChange}
                placeholder="Add Skill.."
              />
              {this.state.isOptionsVisible && (
                <div className="options">

                  {this.state.searchedOptions.map((skill, i) => (
                    <div key={i} onClick={this.selectSkill} style={{border: 'none'}}>
                      {skill}
                    </div>
                  ))}
                </div>
              )}
            </li>
          </ul>
        </main>
      </div>
    );
  }
}
