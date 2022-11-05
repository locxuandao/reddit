import { User } from "../entities/User";
import {Field, ObjectType } from "type-graphql";
import { IMultationResponse } from "./MultationResponse";
import { FieldError } from "./FieldError";

@ObjectType({implements: IMultationResponse})
export class UserMulationResponse implements IMultationResponse { 
    code : number
    success : boolean
    messeage? : string

    @Field({nullable : true})
    user? : User

    @Field(_type => [FieldError] , {nullable : true})
    errors?:FieldError[]

}