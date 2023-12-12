import {Request, Response, NextFunction} from 'express';
import {IExceptionFilter} from "./exception.filter.interface";
import {HTTPError} from "./HTTPError.class";
import {inject, injectable} from "inversify";
import {ILoggerService} from "../logger/logger.service.interface";
import {TYPES} from "../types";
import 'reflect-metadata';

@injectable()
export class ExceptionFilter implements IExceptionFilter{
    constructor(@inject(TYPES.ILoggerService) private logger: ILoggerService) {}
    catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction) {
        if(err instanceof HTTPError) {
            this.logger.error(`${!err.context ? '' : `[${err.context}] `}Error ${err.statusCode} : ${err.message}`);
            res.status(err.statusCode).send({err: err.message});
        } else {
            this.logger.error(`${err.message}`);
            res.status(500).send({err: err.message});
        }
    }
}