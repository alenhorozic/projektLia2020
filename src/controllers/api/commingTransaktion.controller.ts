import { Controller } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { CommingTransaktionService } from "src/services/commingTransaktion/commingTransaktion.service";
import { CommingTransaktion } from "entities/commingTransaktion.entity";

@Controller('api/commingTeansaktion')
@Crud({
    model: {
        type: CommingTransaktion
    },
    params: {
        id: {
            field: 'commingTransaktionId',
            type: 'number',
            primary: true
        }
    },
    query: {
        join:{
            user:{
                eager: true
            },
            accaunt:{
                eager: true
            },
        }
    }
})
export class CommingTransaktionController{
    constructor(public service: CommingTransaktionService) {}
}