const questions = [
  {
    type: 'list',
    name: 'action',
    message: 'What you want to add?',
    choices: ['Route', 'Component', 'UI Component', 'Util', 'Constant', 'Store', 'Core Function', 'Data']
  },
  {
    type: 'input',
    name: 'actionName',
    message: 'Nombre',
  }
];

const questionFolder = [
  {
    type: 'list',
    name: 'folder',
    message: 'Route in folder?',
    choices: ['Yes', 'No']
  },
]

const questionDynamic = [
  {
    type: 'list',
    name: 'dynamic',
    message: 'Route dynamic params?',
    choices: ['Yes', 'No']
  },
]


const questionsTs = [
  {
    type: 'list',
    name: 'typescript',
    message: 'Does your project use TypeScript?',
    choices: ['Yes', 'No']
  }
];

module.exports.questions = questions;
module.exports.questionDynamic = questionDynamic;
module.exports.questionFolder = questionFolder;
module.exports.questionsTs = questionsTs;