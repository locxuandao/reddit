import { User } from "../entities/User";
import {Arg ,  Mutation , Resolver } from "type-graphql";
import argon2 from 'argon2'
import { UserMulationResponse } from "../types/UserMulationResponse";
import { RegisterInput } from "../types/RegisterInput";
import { validateRegister } from "../utils/validateRegister";


@Resolver()
export class UserResolver {
    @Mutation(_return => UserMulationResponse , { nullable : true})
   async register(
      @Arg('registerInput') registerInput : RegisterInput,
     
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
    
           const newUser = User.create({
              username,
              password: hashedPassword,
              email
           })
           return {
            code : 200,
            success : true,
            messeage: 'Đăng kí người dùng thành công',
            user : await User.save(newUser),
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
}