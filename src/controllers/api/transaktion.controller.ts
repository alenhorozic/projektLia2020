import { Controller } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { Transaktion } from "entities/transaktion.entity";
import { TransaktionService } from "src/services/transaktion/transaktion.service";

@Controller('api/transaktion')
@Crud({
    model: {
        type: Transaktion
    },
    params: {
        id: {
            field: 'transaktionId',
            type: 'number',
            primary: true
        },
    },
    query: {
        join:{
            accaunt:{
                eager: true
            },
            transaktionType:{
                eager: true
            }
        }
    }
})
export class TransaktionController {
    constructor(public service: TransaktionService) {}
}