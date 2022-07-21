import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { UsersService } from '../users.service';

@ValidatorConstraint({ name: "IsUniqueUser", async: true })
export class UniqueValidator implements ValidatorConstraintInterface {
    constructor(private readonly usersService: UsersService) { }
    async validate(value: any, args: ValidationArguments): Promise<boolean> {
        const filter = {};
        filter[args.property] = value;
        return !await this.usersService.countDocUser(filter);
    }
}