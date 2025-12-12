const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const readline = require('readline');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
const SPREADSHEET_ID = '1u1y_XN9lVkjEi8T5JLju239PjQEBPxB7zQspP5zY43o';
const RANGE = 'engenharia_de_software!A1:H27'; // Range que contém os dados dos alunos

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  try {
    const auth = await authorize();
    const sheets = google.sheets({ version: 'v4', auth });

    let option;
    do {
      console.log('Sheet: engenharia_de_software');
      console.log('0. Finalize the application');
      console.log('1. Print the entire spreadsheet');
      console.log('2. Calculate grades');

      option = await askQuestion('Choose an option: ');

      switch (option.trim()) {
        case '0':
          console.log('Application finished.');
          break;
        case '1':
          await printSpreadsheet(sheets);
          break;
        case '2':
          await calculateGrades(sheets);
          break;
        default:
          console.log('Invalid option.');
          break;
      }
    } while (option.trim() !== '0');

    rl.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function authorize() {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const credentials = JSON.parse(content);
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  const token = await fs.readFile(TOKEN_PATH);
  oAuth2Client.setCredentials(JSON.parse(token));
  return oAuth2Client;
}

async function printSpreadsheet(sheets) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: RANGE,
  });
  const rows = response.data.values;
  if (rows && rows.length) {
    console.log('General situation:');
    rows.forEach(row => {
      console.log(row.join(', '));
    });
  } else {
    console.log('No data found in spreadsheet.');
  }
}

async function calculateGrades(sheets) {
  console.log('Calculando notas...');

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'engenharia_de_software!A4:H27',
  });

  const rows = response.data.values;

  if (rows && rows.length) {
    const updatedStudents = [];
    const totalClasses = 60; // Assuming 60 classes

    for (const row of rows) {
      const enrollment = row[0];
      const name = row[1];
      const absences = parseInt(row[2]);
      const P1 = parseInt(row[3]);
      const P2 = parseInt(row[4]);
      const P3 = parseInt(row[5]);
      const average = Math.round((P1 + P2 + P3) / 3);

      let situation = '';
      let finalGrade = null;

      if (absences > 0.25 * totalClasses) {
        situation = 'Reprovado por Falta';
      } else {
        if (average < 50) {
          situation = 'Reprovado por Nota';
        } else if (average >= 50 && average < 70) {
          situation = 'Exame Final';
          const naf = calculateNaf(average);
          finalGrade = calculateFinalGrade(average, naf);
        } else {
          situation = 'Aprovado';
        }
      }

      updatedStudents.push({
        enrollment,
        name,
        absences,
        P1,
        P2,
        P3,
        average,
        situation,
        finalGrade,
      });
    }

    await updateSheetWithGrades(updatedStudents, sheets);
    console.log('Grades calculation completed.');
  } else {
    console.log('No data found in the spreadsheet.');
  }
}

function calculateNaf(average) {
  return (2 * 50 - average);
}

function calculateFinalGrade(average, naf) {
  console.log(average);
  return Math.ceil(naf);
}

async function updateSheetWithGrades(students, sheets) {
  console.log('Updating spreadsheet with grades...');

  const values = students.map(student => [
    student.situation,
    student.finalGrade ? student.finalGrade.toString() : '0',
  ]);

  const resource = {
    values,
  };

  const response = await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: 'engenharia_de_software!G4:H27', // Range where situations and notes for final approval should be written
    valueInputOption: 'RAW',
    resource,
  });

  console.log(`${response.data.updatedCells} cells updated.`);
}

main();