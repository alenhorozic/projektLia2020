import { Controller, UseGuards } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { Transaktion } from "entities/transaktion.entity";
import { TransaktionService } from "src/services/transaktion/transaktion.service";
import { RoleCheckerGuard } from "src/misc/role.checker.guard";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";

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
    },
    routes: {
        only:[
            "createOneBase",
            "getManyBase",
            "getOneBase",
        ],
        createOneBase: {
            decorators: [
                UseGuards(RoleCheckerGuard),
                AllowToRoles('administrator','user')
            ],
        },
        getManyBase:{
            decorators: [
                UseGuards(RoleCheckerGuard),
                AllowToRoles('administrator','user')
            ],
        },
        getOneBase:{
            decorators: [
                UseGuards(RoleCheckerGuard),
                AllowToRoles('administrator','user')
            ],
        }
    }
})
export class TransaktionController {
    constructor(public service: TransaktionService) {}
}