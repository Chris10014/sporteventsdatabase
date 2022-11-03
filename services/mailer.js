const nodemailer = require("nodemailer");
const variables = require("../config/variables");
const Teams = require("../models/teams");

const transport = nodemailer.createTransport({
  host: variables.mailserver.host,
  port: variables.mailserver.port,
  auth: {
    user: variables.mailserver.user,
    pass: variables.mailserver.password,
  },
});

exports.sendActivationLink = async (email, userId, activationToken, firstName, randomPw = null, callback) => {
  const tokenExpiresAt = new Date(activationToken.split(".")[1] * 1000).toLocaleString("de-DE"); //new Date(timestamp must be in milliseconds)
  const activationLink = `${variables.base_url}:${variables.port}/api/v1/activate/${userId}/${activationToken}`;

  
    var pwText = (randomPw !== null) 
    ? `<p>Dein zufällig erzeugtes Passwort ist <b>${randomPw}</b>. Bitte ändere das Passwort nach dem ersten Login in ein von dir vergebenes Passwort.</p>`
    : "";
  

  const mailData = {
    from: "activation@bigpoints.de",
    to: email,
    subject: "Aktiviere dein BigPoints-Konto",
    text: `Lieber ${firstName}, \n\nherzlich willkommen bei BigPoints. Aktiviere dein BigPoints-Konto mit der E-Mail Adresse ${email} jetzt, klicke dafür auf diesen Link: ${activationLink}.\nDer Link ist bis ${tokenExpiresAt} gültig. \n\nEs grüßt dich das BigPoints-Team!
    \n\nFalls du dich nicht für BigPoints registriert hast, kannst du diese E-Mail ignorieren.`,
    html: `<p><b>Lieber ${firstName}</b>,</br></br>herzlich willkommen bei <b>BigPoints</b>. Aktiviere dein BigPoints-Konto mit der E-Mail Adresse <b>${email}</b> jetzt, klicke dafür auf diesen Link: <a href="${activationLink}">BigPoints-Konto aktivieren</a>.<br>Der Link ist bis ${tokenExpiresAt} gültig.</br></br>Es grüßt dich das BigPoints-Team!</p>
    <p>Falls du dich nicht für BigPoints registriert hast, kannst du diese E-Mail ignorieren.</p>${pwText}`
  };

  return await transport.sendMail(mailData, (err, info) => {
    return callback({ err, info });
  });
};

exports.askForTeamAdmission = async (user, team, callback) => {
  //find team captains
  const teamCaptains = team.users.filter((member) => member.users_have_teams.team_captain === true)
    console.log("\n\nfrom mailer, askForAdmission. teamCaptains: ", teamCaptains, "\n\n");
    if(teamCaptains.length == 0) {
      return callback({ err: {title: "No team captain", message: `The team ${team.team_name} doesn't have a team captain. You can't admit to this team.` }, info: null })
    }
    const confirmationLink = `${variables.base_url}:${variables.port}/api/v1/confirmAdmission/${team.id}/${user.id}`;
    const rejectAdmissionLink = `${variables.base_url}:${variables.port}/api/v1/rejectAdmission/${team.id}/${user.id}`;

    let eMailCounter = 0;
    teamCaptains.map(async (teamCaptain) => {
      eMailCounter++;
      const mailData = {
        from: "teams@bigpoints.de",
        to: teamCaptain.email,
        subject: `Aufnahme ins Team ${team.team_name}`,
        text: `Hallo ${teamCaptain.first_name}, \n\n${user.first_name} ${user.last_name} möchte in deinem Team aufgenommen werden. Klicke für die Aufnahme ins Team auf den Link ${confirmationLink}. \nUm die Anfrage abzulehnen, klicke hier ${rejectAdmissionLink}.`,
        html: `<p><b>Hallo ${teamCaptain.first_name}</b>,</br></br>${user.first_name} ${user.last_name} möchte in deinem Team aufgenommen werden. Klicke für die Aufnahme ins Team auf den Link <b><a href="${confirmationLink}">Aufnahme bestätigen</a></b>. Um die Anfrage abzulehnen, klicke hier <b><a href="${rejectAdmissionLink}">Aufnahme ablehnen</a></b>.`,
      };

      return await transport.sendMail(mailData, (err, info) => {
        info.eMailCounter = eMailCounter;
        return callback({ err, info });
      });
    });
};

exports.sendTeamAdmission = async (user, team, callback) => {
  const email = user.email;
  const firstName = user.first_name;
  const teamName = team.team_name;
  const mailData = {
    from: "teams@bigpoints.de",
    to: email,
    subject: `Aufnahme ins Team ${teamName}`,
    text: `Lieber ${firstName}, \n\nherzlich willkommen im Team ${teamName}. Wir freuen uns, dich im Team begrüßen zu dürfen. Deine Aufnahme ins Team wurde bestätigt.`,
    html: `<p><b>Lieber ${firstName}</b>,</br></br>herzlich willkommen im Team <b>${teamName}</b>. Wir freuen uns, dich im Team begrüßen zu dürfen. Deine Aufnahme ins Team wurde bestätigt.`,
  };

  return await transport.sendMail(mailData, (err, info) => {
    return callback({ err, info });
  });
};

exports.sendRejectAdmission = async (user, team, callback) => {

  const mailData = {
    from: "teams@bigpoints.de",
    to: email,
    subject: `Aufnahme ins Team ${teamName}`,
    text: `Lieber ${firstName}, \n\ndeine Anfrage zur Aufnahme ins Team ${teamName} wurde leider abgelehnt.`,
    html: `<p><b>Lieber ${firstName}</b>,</br></br>deine Anfrage zur Aufnahme ins Team ${teamName} wurde leider abgelehnt.`,
  };

  return await transport.sendMail(mailData, (err, info) => {
    return callback({ err, info });
  });
};
