const nodemailer = require("nodemailer");
const variables = require("../config/variables");

const transport = nodemailer.createTransport({
  host: variables.mailserver.host,
  port: variables.mailserver.port,
  auth: {
    user: variables.mailserver.user,
    pass: variables.mailserver.password,
  },
});

exports.sendActivationLink = async (email, userId, activationToken, firstName, callback) => {
  const tokenExpiresAt = new Date(activationToken.split(".")[1] * 1000).toLocaleString("de-DE"); //new Date(timestamp must be in milliseconds)
  const activationLink = `${variables.base_url}:${variables.port}/api/v1/activate/${userId}/${activationToken}`;

  const mailData = {
    from: "activation@bigpoints.de",
    to: email,
    subject: "Aktiviere dein BigPoints-Konto",
    text: `Lieber ${firstName}, \n\nherzlich willkommen bei BigPoints. Aktiviere dein BigPoints-Konto mit der E-Mail Adresse ${email} jetzt, klicke dafür auf diesen Link: ${activationLink}.\nDer Link ist bis ${tokenExpiresAt} gültig. \n\nEs grüßt dich das BigPoints-Team!
    \n\nFalls du dich nicht für BigPoints registriert hast, kannst du diese E-Mail ignorieren.`,
    html: `<p><b>Lieber ${firstName}</b>,</br></br>herzlich willkommen bei <b>BigPoints</b>. Aktiviere dein BigPoints-Konto mit der E-Mail Adresse <b>${email}</b> jetzt, klicke dafür auf diesen Link: <a href="${activationLink}">BigPoints-Konto aktivieren</a>.<br>Der Link ist bis ${tokenExpiresAt} gültig.</br></br>Es grüßt dich das BigPoints-Team!</p>
    <p>Falls du dich nicht für BigPoints registriert hast, kannst du diese E-Mail ignorieren.</p>`,
  };

  return await transport.sendMail(mailData, (err, info) => {
    return callback({ err, info });
  });
};
