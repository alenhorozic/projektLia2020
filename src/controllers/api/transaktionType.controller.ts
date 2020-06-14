import { Controller, UseGuards } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { TransaktionTypeService } from "src/services/transaktionType/transaktionType.service";
import { TransaktionType } from "entities/transaktionType.entity";
import { RoleCheckerGuard } from "src/misc/role.checker.guard";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";

@Controller('api/transaktionType')
@Crud({
    model: {
        type: TransaktionType
    },
    params: {
        id: {
            field: 'transaktionTypeId',
            type: 'number',
            primary: true
        }
    },
    query: {
        join:{
            transaktions:{
                eager: true
            },
        }
    },
    routes: {
        only:[
            "createOneBase",
            "getManyBase",
            "getOneBase",
            "updateOneBase",
        ],
        createOneBase: {
            decorators: [
                UseGuards(RoleCheckerGuard),
                AllowToRoles('administrator')
            ],
        },
        updateOneBase: {
            decorators: [
                UseGuards(RoleCheckerGuard),
                AllowToRoles('administrator')
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
export class TransaktionTypeController{
    constructor(public service: TransaktionTypeService) {}
}