#! /usr/bin/env node

const fs = require('fs');
const inquirer = require("inquirer");
const shell = require('shelljs');
const path = process.cwd();

const { questions, questionsTs, questionFolder, questionDynamic } = require('./utils/questions.js');

//Path
const paths = {
  components: {
    template: `${path}/templates/component/`,
    path: `${path}/src/lib/shared/components/`,
    uiPath: `${path}/src/lib/shared/ui/components/`,
  },
  routes: {
    template: `${path}/templates/route/`,
    path: `${path}/src/lib/routes/`,
  },
  store: {
    template: `${path}/templates/store/`,
    path: `${path}/src/lib/stores/`,
  },
  util: {
    template: `${path}/templates/util/`,
    path: `${path}/src/lib/utils/`,
  },
  constant: {
    template: `${path}/templates/constant/`,
    path: `${path}/src/lib/core/constants/`,
  },
  core: {
    template: `${path}/templates/core/`,
    path: `${path}/src/lib/core/functions/`,
  },
  data: {
    template: `${path}/templates/data/`,
    path: `${path}/src/lib/data/`,
  }
}

//Functions
const fileName = (value) => {
  return value.replace(/\s/g, '')
};

const folderName = (value) => {
  return value.toLowerCase().replace(/\s/g, '-')
};

const defaultComponent = function(file){
  return `export { default as ${file} } from "./${file}.svelte";\n`;
}

const defaultUtil = function(file){
  return `
  /**
   * 
   * Change key name in objects
   * 
   * @param {String} name - Variable name
   * @returns {String} name
   */\n
   export const ${file} = (name) => {
     if(!name) return false;
      return name;
   }\n
  `;
}

const defaultConstant = function(file){
  return `
  /**
   * 
   * Change key name in objects
   * 
   * @param {String} ${file} - Constant name
   * @returns {String} ${file}
   */\n
   export const ${file.toUpperCase()} = 'hello ${file.toUpperCase()}'\n
  `;
}

const defaultData = function(file){
  return `
  /**
   * 
   * Change key name in objects
   * 
   * @param {Object} ${file} - data name
   * @returns {Object} {${file}} - ${file}
   */\n
   export const ${file} = {
     name: 'name'
   }\n
  `;
}

const defaultStore = function(file){
  return `import { writable } from "svelte/store";\n
    export const ${file} = writable('hello ${file}');
  `;
}

const defaultIndexComponent = function(file, folder){
  return `export { ${file} } from "./${folder}";\n`;
}

const createComponents = function(path,file, func, folder, append){
  const stream = fs.createWriteStream(path);
  if(append){
    const data = defaultIndexComponent(file, folder)
    let originaFile;
    try { 
      if(fs.existsSync(path)){
        originaFile = fs.readFileSync(path);
        const newData = `${originaFile} ${data}`;
        fs.writeFile(path, newData, { flag: "a+" }, (err) => {
          if (err) throw err;
        }); 
      }else{
        stream.once('open', function(fd){
          stream.write(func(file, folder));
          stream.end();
        })
      }
    } catch{
      //
    }

    return;
  }else{
    return stream.once('open', function(fd){
      stream.write(func(file, folder));
      stream.end();
    })
  }
}


const executeFileCreationg = function({path, route, templatePath,action, ts, writeToFile, writeToIndex, noIndex, folder = true, copy = true}){


  if(folder){
    shell.exec(`mkdir -p ${fileName(path)}${folderName(action)}`);
  }
  if(!route){
    shell.exec(`touch ${fileName(path)}${folderName(action)}/index.js`)
  }
  if(copy){
    if(folder){
      shell.exec(`cp ${fileName(templatePath)}index${ts ?'-ts': ''}.svelte ${fileName(path)}${folderName(action)}/index.svelte`);
    }else{
      shell.exec(`cp ${fileName(templatePath)}index${ts ?'-ts': ''}.svelte ${fileName(path)}${fileName(action)}.svelte`);
    }
  }
  if(noIndex){
    createComponents(`${fileName(path)}${folderName(action)}/index.js`, `${fileName(action)}`, writeToFile);
  }
  if(writeToIndex){
    createComponents(`${fileName(path)}index.js`, fileName(action), writeToIndex, folderName(action), true);
  }
  

  return;
}

inquirer
    .prompt(questions, questionsTs, questionFolder).then((answers) => {
      // Use user feedback
      if(answers.action === 'Component'){
        inquirer.prompt(questionsTs).then((answersTs) => {
          if(answersTs.typescript === 'Yes'){
            // Si usamos TS
            executeFileCreationg({
              path: paths.components.path,
              templatePath: paths.components.template, 
              action: answers.actionName, 
              ts: true, 
              writeToFile: defaultComponent, 
              writeToIndex: defaultIndexComponent, 
              noIndex: true
            })
          } else {
            //
            executeFileCreationg({
              path: paths.components.path,
              templatePath: paths.components.template, 
              action: answers.actionName, 
              ts: false, 
              writeToFile: defaultComponent, 
              writeToIndex: defaultIndexComponent, 
              noIndex: true
            })
          }
        });
      }else if(answers.action === 'UI Component'){
        inquirer.prompt(questionsTs).then((answersTs) => {
          if(answersTs.typescript === 'Yes'){
            // Si usamos TS
            executeFileCreationg({
              path: paths.components.uiPath,
              templatePath: paths.components.template, 
              action: answers.actionName, 
              ts: true, 
              writeToFile: defaultComponent, 
              writeToIndex: defaultIndexComponent, 
              noIndex: true
            })
          } else {
            //
            executeFileCreationg({
              path: paths.components.uiPath,
              templatePath: paths.components.template, 
              action: answers.actionName, 
              ts: false, 
              writeToFile: defaultComponent, 
              writeToIndex: defaultIndexComponent, 
              noIndex: true
            })
          }
        });
      }else if(answers.action === 'Route'){
        inquirer.prompt(questionDynamic).then((answersFd) => {
          if(answersFd.dynamic === 'Yes'){
            inquirer.prompt(questionFolder).then((awnserF) => {
              if(awnserF.dynamic === 'Yes'){
                executeFileCreationg({
                  path: paths.routes.path,
                  route: true,
                  templatePath: paths.routes.template, 
                  action: `${answers.actionName}`, 
                  ts: false,
                  dynamic: true,
                  folder: true,
                  writeToFile: defaultComponent, 
                })
              } else {
                executeFileCreationg({
                  path: paths.routes.path,
                  route: true,
                  templatePath: paths.routes.template, 
                  action: `${answers.actionName}`, 
                  ts: false,
                  dynamic: true,
                  folder: false,
                  writeToFile: defaultComponent, 
                })
              }
              
            });
            
          }else if(answersFd.dynamic === 'No'){
            executeFileCreationg({
              path: paths.routes.path,
              route: true,
              templatePath: paths.routes.template, 
              action: answers.actionName, 
              ts: false,
              folder: false,
              writeToFile: defaultComponent, 
            })
          }
        });
      } else if(answers.action === 'Util'){
        //
        executeFileCreationg({
            path: paths.util.path,
            templatePath: paths.util.template, 
            action: answers.actionName, 
            ts: false, 
            writeToFile: defaultUtil, 
            writeToIndex: defaultIndexComponent, 
            noIndex: true,
            copy: false
        })
      } else if(answers.action === 'Constant'){
        //
        executeFileCreationg({
            path: paths.constant.path,
            templatePath: paths.constant.template, 
            action: answers.actionName.toUpperCase(), 
            ts: false, 
            writeToFile: defaultConstant, 
            writeToIndex: defaultIndexComponent, 
            noIndex: true,
            copy: false
        })
      } else if(answers.action === 'Store'){
          executeFileCreationg({
                path: paths.store.path,
                templatePath: paths.store.template, 
                action: answers.actionName, 
                ts: false, 
                writeToFile: defaultStore, 
                writeToIndex: defaultIndexComponent, 
                noIndex: true,
                copy: false
            })
      } else if(answers.action === 'Core Function'){
        //
          executeFileCreationg({
            path: paths.core.path,
            templatePath: paths.core.template, 
            action: answers.actionName, 
            ts: false, 
            writeToFile: defaultUtil, 
            writeToIndex: defaultIndexComponent, 
            noIndex: true,
            copy: false
        })
      } else if(answers.action === 'Data'){
        //
        executeFileCreationg({
            path: paths.data.path,
            templatePath: paths.data.template, 
            action: answers.actionName, 
            ts: false, 
            writeToFile: defaultData, 
            writeToIndex: defaultIndexComponent, 
            noIndex: true,
            copy: false
        })
      } else {
        //
        
      }
    })