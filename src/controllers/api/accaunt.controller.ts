import { Controller } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { Accaunt } from "entities/accaunt.entity";
import { AccauntService } from "src/services/accaunt/accaunt.service";

@Controller('api/accaunt')
@Crud({
    model: {
        type: Accaunt
    },
    params: {
        id: {
            field: 'accauntId',
            type: 'number',
            primary: true
        }
    },
    query: {
        join:{
            user:{
                eager: true
            },
            transaktions:{
                eager: true
            },
            commingTransaktions:{
                eager: true
            },
        }
    }
})
export class AccauntControler{
    constructor(public service: AccauntService) {}
}