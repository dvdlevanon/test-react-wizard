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
        <span onClick={this.sectionClicked.bind(this)}>
          { this.props.isChecked ? "V": "" } { this.props.section.name }
        </span>
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
  
  sectionClicked() {
    this.props.stepClicked(this.props.index, 0)
  }
}

class Sidebar extends React.Component {
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
              isChecked={ i === this.props.selectedSection }
              selectedStep={ this.props.selectedStep }
              stepClicked={this.props.stepClicked} />)}
        </ol>
      </div>
    )
  }
}

class Content extends React.Component {
  render() {
    let valueComponent = ""
    
    if (this.props.step.type === "number") {
      valueComponent = (<input type="number"></input>)
    } else if (this.props.step.type === "string") {
      valueComponent = (<input placeholder="enter a string"></input>)
    } else if (this.props.step.type === "multi") {
      valueComponent = (
        <select>
          {this.props.step.values.map((val, i) => <option key={i} value={val}>{val}</option>)}
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
      selectedSection: 0,
      selectedStep: 0
    }
  }
  
  render() {
    let section = this.props.wizard.sections[this.state.selectedSection]
    let step = section.steps[this.state.selectedStep]
    
    let isLastSection = this.state.selectedSection === this.props.wizard.sections.length - 1
    let isLastStep = this.state.selectedStep === section.steps.length - 1
    
    let stepContent = <Content step={step} />
    
    return (
      <div>
        <Sidebar
          wizard={this.props.wizard} 
          selectedSection={ this.state.selectedSection }
          selectedStep={ this.state.selectedStep }
          stepClicked={this.stepClicked.bind(this)}/>
        {stepContent}
        <button disabled={isLastSection && isLastStep} onClick={this.nextClicked.bind(this)}>Next</button>
      </div>
    )
  }
  
  stepClicked(sectionIndex, stepIndex) {
    this.setState(prev => ({
      selectedSection: sectionIndex,
      selectedStep: stepIndex
    }))
  }
  
  nextClicked() {
    let wizard = this.props.wizard
    
    this.setState(prev => {
      let section = wizard.sections[prev.selectedSection]
      let isLastStep = prev.selectedStep === section.steps.length - 1
      
      if (isLastStep) {
        return {
          selectedSection: prev.selectedSection + 1,
          selectedStep: 0
        }
      } else {
        return {
          selectedSection: prev.selectedSection,
          selectedStep: prev.selectedStep + 1
        }
      }
    })
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
