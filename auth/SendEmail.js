import nodemailer from "nodemailer";

const SendEmail = (email, secretKey) => {
	const Transport = nodemailer.createTransport({
		service: "Gmail",
		auth: {
			user: "kishorekumar150399@gmail.com",
			pass: "Rajkrithika@99",
		},
	});

	const sender = "Kishore";
	const mailOptions = {
		from: sender,
		to: email,
		subject: "Email confirmation & Account Activation",
		html: `Press <a href=http://localhost:3001/api/users/verify/${secretKey}> here </a> to verify your Email! :) Thanks`,
	};

	Transport.sendMail(mailOptions, (err, res) => {
		if (err) {
			console.log(err);
		} else {
			console.log(
				"An email activation link is sent to your email. Please verify to login."
			);
		}
	});
};

export default SendEmail;
