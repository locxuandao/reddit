import { Field, InterfaceType } from "type-graphql";

@InterfaceType()
export abstract class IMultationResponse {
    @Field()
    code : number;

    @Field()
    success : boolean;;

    @Field({nullable : true})
    messeage? : string;
}
