import { User } from "../entities/User";
import {Arg ,  Mutation , Resolver , Ctx } from "type-graphql";
import argon2 from 'argon2'
import { UserMulationResponse } from "../types/UserMulationResponse";
import { RegisterInput } from "../types/RegisterInput";
import { validateRegister } from "../utils/validateRegister";
import { LoginInput } from "../types/loginInput";
import { Context } from "../types/Context";

import { COOKIE_NAME } from "../constants";


@Resolver()
export class UserResolver {
    @Mutation(_return => UserMulationResponse , { nullable : true})
   async register(
      @Arg('registerInput') registerInput : RegisterInput,
      @Ctx() {req} : Context 
     
    ):Promise<UserMulationResponse> {
        const validateRigisterError = validateRegister(registerInput)
        if(validateRigisterError !== null)
        return {code : 400 , success : false , messeage : validateRigisterError.messeage , errors : validateRigisterError.error}




        try {
            const {username , email , password} = registerInput
           const existingUser = await User.findOne({
            where : [{username} , {email}]
           })
           if(existingUser) 
           return {
              code : 400,
              success :false,
              messeage :`${existingUser.username === username ? 'tên người dùng' : 'email'} đã tồn tại`,
              errors : [
                {
                    field:existingUser.username === username ? 'tên người dùng' : 'email', 
                    messeage:`${existingUser.username === username ? 'tên người dùng' : 'email'} đã tồn tại`
                }
              ]
           }

           const hashedPassword = await argon2.hash(password)
    
           let newUser = User.create({
              username,
              password: hashedPassword,
              email
           })
           newUser = await User.save(newUser)
           req.session.userId = newUser.id
           return {
            code : 200,
            success : true,
            messeage: 'Đăng kí người dùng thành công',
            user : newUser
           }
           
        } catch (error) {
            console.log(error)
            return {
                code : 500,
                success :false,
                messeage :`Eror ${error.messeage}`
                
             }
        }

    }
    @Mutation(_return => UserMulationResponse)
     async login(
          @Arg('loginInput') {usernameOrEmail,password} : LoginInput,
          @Ctx() {req} : Context
        ): Promise<UserMulationResponse> {
         try {
            const existingUser = await User.findOneBy(
                usernameOrEmail.includes('@') 
                ? { email: usernameOrEmail} 
                : {username : usernameOrEmail }
            )
          if(!existingUser) 
            return {
                code : 400 ,
                success : false,
                messeage : 'Người dùng không tồn tại',
                errors : [
                    {
                        field : 'usernameOrEmail',
                        messeage : 'sai tên người dùng hoặc  email'
                    }
                ]
            }
          
            const passwordValid = await argon2.verify(existingUser.password , password)
            if(!passwordValid)
            return {
                code : 400,
                success : false,
                messeage : 'sai mật khẩu',
                errors : [
                    {
                        field : 'password',
                        messeage : 'sai mật khẩu'
                    }
                ]
                
            }
            // create session
            req.session.userId = existingUser.id
            return {
                code : 200,
                success : true,
                messeage : 'Logged in successfully',
                user : existingUser
            }
           
         }
         catch(error) {
            console.log(error)
            return {
                code : 500,
                success :false,
                messeage :`Eror ${error.messeage}`
                
             }
 
         }

         
     }
    
     @Mutation(_return => Boolean)
     logout(@Ctx() {req , res}: Context) : Promise<boolean> {
        return new Promise((resolve , _reject) =>{
            res.clearCookie(COOKIE_NAME)

            req.session.destroy(error => {
                if(error) {
                    console.log('session error',error)
                    resolve(false)
                }
                resolve(true)
            })
        })

      }
}