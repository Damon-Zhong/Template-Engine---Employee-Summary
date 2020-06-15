const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
// let ID = 1;

async function main(){
    const team = []

    const managerData = await inquirer.prompt([
        { name:'name', type:'input', message:`Please enter manager's name`},
        { name:'id', type:'input', message:`Please enter your ID number`},
        { name:'email', type:'input', message:`Please enter your email.`, validate:validateEmail },
        { name:'officeNumber', type:'input', message:`Please enter manager's office number.`},
        { name:'count', type:'input', message:`How many people work in this team?` }
    ])
    //Create manager obj
    team.push( new Manager( managerData.name, managerData.id, managerData.email, managerData.officeNumber ))

    //Gather team member info
    for( let memberCnt=1; memberCnt <= managerData.count; memberCnt++ ){
        const member = await inquirer.prompt([
            { name:'position', type:'list', message:`For person ${memberCnt}/${managerData.count}`, choices:['engineer', 'intern'] }
        ])

        if( member.position == 'engineer'){
            const employeeInfo = await inquirer.prompt([
                { name:"name", type:"input", message:`Please enter your name` },
                { name:"id", type:"input", message:`Please enter your ID` },
                { name:"email", type:"input", message:`Please provide your email`, validate:validateEmail },
                { name:"github", type:"input", message:`Please provide your Github username`}
            ]);
            team.push( new Engineer( employeeInfo.name, employeeInfo.id, employeeInfo.email, employeeInfo.github) );
        }else{
            const employeeInfo = await inquirer.prompt([
                { name:"name", type:"input", message:`Please enter your name` },
                { name:"id", type:"input", message:`Please enter your ID` },
                { name:"email", type:"input", message:`Please provide your email`, validate:validateEmail },
                { name:"school", type:"input", message:`Please provide your school name`}
            ]);
            team.push( new Intern( employeeInfo.name, employeeInfo.id, employeeInfo.email, employeeInfo.school) );
        }
    }

    //Generate html and write file
    const html = render( team )

    fs.writeFileSync( outputPath, html );

}

main();

async function validateEmail( email ){
    const charSet = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if( charSet.test( email ) ){
        return true;
    }else{
        console.log( `Invalid email. Please enter again.` );
    }
}

// async function validateNum( input ){
//     if( typeof( input ) == 'number' ){
//         return true;
//     }else{
//         console.log( `Please enter a number` )
//     }
// }
  
// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
