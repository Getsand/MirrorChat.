// import { resend } from "@/lib/resend";
// import VerificationEmail from "../../emails/VerificationEmail";
// import { ApiRespone } from "@/types/ApiResponse";

// export async function sendVerificationEmail(
//   email: string,
//   username: string,
//   verifyCode: string
// ): Promise<ApiRespone> {
//   try {
//     // Log info for debugging purposes
//     console.log(`Attempting to send email to: ${email} with code: ${verifyCode}`);

//     await resend.emails.send({
//       from: 'Acme <onboarding@resend.dev>',
//       to: email,
//       subject: 'Messaging | Verification Code',
//       react: VerificationEmail({ username, otp: verifyCode }),
//     });

//     console.log('Verification email sent successfully');
//     return { success: true, message: 'Verification email sent successfully' };
//   } catch (emailError) {
//     console.error('Error sending verification email', emailError);
//     return { success: false, message: 'Failed to send verification email' };
//   }
// }








import {resend} from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse>{
    try{
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'messsaging | verification code',
            react: VerificationEmail({username, otp: verifyCode}),
        });
        return {success: true, message:'verification email send successfully'}
    }catch(emailError){
        console.log("Error sending verification email",emailError)
        return {success: false, message:'Failed to send verification email'}
    }
}


