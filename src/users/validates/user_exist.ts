import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments} from 'class-validator';
import { UsersService } from '../users.service';

@ValidatorConstraint({ name: "IsExistUser", async: true })
export class ExistValidator implements ValidatorConstraintInterface {
    constructor(private readonly usersService: UsersService) { }
    async validate(value: any, args: ValidationArguments): Promise<boolean> {
        const filter = {};
        filter[args.property] = value;
        return await this.usersService.countDocUser(filter) > 0;
    }
}