import React from 'react';
import './App.css';

function getWizard() {
  return {
    "name": "test",
    "sections": [
      {
        name: "section1",
        steps:[
          {
            name: "step1.1",
            question: "question1",
            type: "number"
          },
          {
            name: "step1.2",
            question: "question1.2",
            type: "string"
          }
        ]
      },
      {
        name: "section2",
        steps:[
          {
            name: "step2.1",
            question: "question2.1",
            type: "multi",
            values: ["multi1", "multi2"]
          },
          {
            name: "step2.2",
            question: "question2.2",
            type: "string"
          }
        ]
      }
    ]
  }
}

class Step extends React.Component {
  render() {
    return (
      <li onClick={this.stepClicked.bind(this)}>
        { this.props.isChecked ? "V": "" } { this.props.step.name }
      </li>
    )
  }
  
  stepClicked() {
    this.props.stepClicked(this.props.index)
  }
}

class Section extends React.Component {
  render() {
    return (
      <li>
        { this.props.isChecked ? "V": "" } { this.props.section.name }
        <ol>
          {this.props.section.steps.map((step, i) => 
            <Step 
              key={i} 
              index={i}
              step={step} 
              isChecked={ this.props.isChecked && this.props.selectedStep === i}
              stepClicked={this.stepClicked.bind(this)} />)}
        </ol>
      </li>
    )
  }
  
  stepClicked(stepIndex) {
    this.props.stepClicked(this.props.index, stepIndex)
  }
}

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSection: -1,
      selectedStep: -1
    }
  }
  
  render() {
    return (
      <div>
        {this.props.wizard.name}
        <ol>
          {this.props.wizard.sections.map((section, i) => 
            <Section 
              key={i} 
              index={i}
              section={section} 
              isChecked={ i === this.state.selectedSection }
              selectedStep={ this.state.selectedStep }
              stepClicked={this.stepClicked.bind(this)} />)}
        </ol>
      </div>
    )
  }
  
  stepClicked(sectionIndex, stepIndex) {
    this.setState(prev => ({
      selectedSection: sectionIndex,
      selectedStep: stepIndex
    }))
    this.props.selectedStepChanged(sectionIndex, stepIndex)
  }
}

class Content extends React.Component {
  render() {
    let valueComponent = ""
    
    if (this.props.step.type == "number") {
      valueComponent = (<input type="number"></input>)
    } else if (this.props.step.type == "string") {
      valueComponent = (<input placeholder="enter a string"></input>)
    } else if (this.props.step.type == "multi") {
      valueComponent = (
        <select>
          {this.props.step.values.map((val, i) => <option value={val}>{val}</option>)}
        </select>
      )
    }
    
    return (
      <div>
        <div>{this.props.step.question}</div>
        {valueComponent}
      </div>
    )
  }
}

class Wizard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: null
    }
  }
  
  render() {
    let stepContent = ""
    
    if (this.state.step != null) {
      stepContent = <Content step={this.state.step} />
    }
    
    return (
      <div>
        <Sidebar
          wizard={this.props.wizard} 
          selectedStepChanged={this.selectedStepChanged.bind(this)}/>
        {stepContent}
      </div>
    )
  }
  
  selectedStepChanged(sectionIndex, stepIndex) {
    this.setState(prev => ({
      step: this.props.wizard.sections[sectionIndex].steps[stepIndex]
    }))
  }
}

function App() {
  let wizard = getWizard()
  
  return (
    <div className="App">
    
      <Wizard wizard={wizard} />
    </div>
  );
}

export default App;
