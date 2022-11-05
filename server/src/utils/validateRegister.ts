import { RegisterInput } from "../types/RegisterInput";

export const validateRegister = (registerInput : RegisterInput) => {
    if(!registerInput.email.includes('@'))
    return {
        messeage : 'email không hợp lệ',
        error : [
          {
            field : 'email',
            messeage : 'email phải có @'
          }
        ]
    }
    if(registerInput.username.length <=2)
    return {
        messeage :  'tên người dùng không hợp lệ',
        error : [
            {
                field : 'username',
                messeage : 'tên người dùng phải dài hơn 2 kí tự'
            }
        ]
    }
    if(registerInput.password.length <=2)
    return {
        messeage :  'mật khẩu không đủ mạnh',
        error : [
            {
                field : 'username',
                messeage : 'mật khẩu phải dài hơn 2 kí tự'
            }
        ]
    }
    if(registerInput.username.includes('@'))
    return {
        messeage : 'tên người dùng không hợp lệ',
        error : [
            {
                field : 'username',
                messeage : 'tên người dùng không được có @'
            }
        ]
    }
    return null
}
