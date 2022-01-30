const subject_mailEV = "OTP: For Email Verification"

const messageEV = (otp) =>{
     return `Dear User, \n\n` 
      + 'OTP for your email verification is : \n\n'
      + `${otp}\n\n`
      + 'This is a auto-generated email. Please do not reply to this email.\n\n'
      + 'Regards\n'
      + 'Techfortress\n\n'
}
const subject_mailF = "OTP: Forget Password"

const messageF = (otp) =>{
     return `Dear User, \n\n` 
      + 'OTP for your forget Password is : \n\n'
      + `${otp}\n\n`
      + 'This is a auto-generated email. Please do not reply to this email.\n\n'
      + 'Regards\n'
      + 'Techfortress\n\n'
}
const subject_mailPU = "Password Change: Successfull"

const messagePU = (fullname) =>{
    return `Dear ${fullname}, \n\n` 
      + 'Your password has been Changed Successfully '
      + 'This is a auto-generated email. Please do not reply to this email.\n\n'
      + 'Regards\n'
      + 'Techfortress\n\n'
}

export {
    subject_mailEV,
    messageEV,
    subject_mailF,
    messageF,
    subject_mailPU,
    messagePU,
}