import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const PAZE_SIZE = 10;
export const toIntegerOrZero = (val: any) => {
    return Number(val) || 1;
}

export const AUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    }
)