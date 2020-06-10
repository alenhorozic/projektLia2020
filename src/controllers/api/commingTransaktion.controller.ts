import { Controller, UseGuards } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { CommingTransaktionService } from "src/services/commingTransaktion/commingTransaktion.service";
import { CommingTransaktion } from "entities/commingTransaktion.entity";
import { RoleCheckerGuard } from "src/misc/role.checker.guard";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";

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
export class CommingTransaktionController{
    constructor(public service: CommingTransaktionService) {}
}