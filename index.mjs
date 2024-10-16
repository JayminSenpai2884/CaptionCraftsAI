import { error } from "console";
import { MailtrapClient } from "mailtrap";

const TOKEN = "4cdc1a0616c1142ffbbe25deba694558";
const SENDER_EMAIL = "hello@demomailtrap.com";
const RECIPIENT_EMAIL = "jayminparmar2884@gmail.com";

if (!TOKEN) {
  throw new error("Mailtrap Error!!!!!!!!:(");
}

const client = new MailtrapClient({ token: TOKEN });
const sender = { name: "Mailtrap Test", email: SENDER_EMAIL };

client.send({
  from: sender,
  to: [{ email: RECIPIENT_EMAIL }],
  subject: "Hey, Welcome to WriteAI😊",
  text: "Welcome to my project that helps user generate Text for Social media sites using AI",
}).then(console.log).catch(console.error);
