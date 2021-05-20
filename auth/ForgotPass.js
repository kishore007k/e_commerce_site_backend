import nodemailer from "nodemailer";

const ForgotPass = (email, secretKey) => {
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
		subject: "Password Reset Link",
		html: `<p>Click on the below link to reset your Password</p>
    <p><a href=http://localhost:3001/api/users/resetPass/${email}/${secretKey}> http://localhost:3001/api/users/resetPass/${email}/${secretKey} </a></p>`,
	};

	Transport.sendMail(mailOptions, (err, res) => {
		if (err) {
			console.log(err);
		} else {
			console.log("The password reset link is sent to your email address");
		}
	});
};

export default ForgotPass;
