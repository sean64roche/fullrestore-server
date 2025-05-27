import axios, {AxiosError, AxiosResponse} from "axios";
import {ApiConfig} from "../config.js";
import Repository from "./repository.js";

export default class FormatRepository extends Repository {

    readonly formatsUrl: string;
    constructor(config: ApiConfig) {
        super(config);
        this.formatsUrl = config.baseUrl + config.formatsEndpoint;
    }

    async create(format: string): Promise<string | undefined> {
        try {
            const response: AxiosResponse = await axios.post(this.formatsUrl, { format: format });
            this.logger.info(`Format '${format}' not found; created successfully`);
            return response.data.format;
        } catch (error) {
            if (error instanceof AxiosError) {
                switch (error.response?.status) {
                    case 409:
                        this.logger.info(`'${format}' exists. Continuing...`);
                        return undefined;
                    default:
                        this.logger.error(
                            `FATAL on creating Format: ${JSON.stringify(error.response?.data) || error.message} ` +
                            `| Request: ${this.formatsUrl} | Body: { format: ${format} }`
                        );
                        throw new Error(error.response?.data || error.message);
                }
            } else {
                this.logger.error(`FATAL on creating Format: ${error.message}`);
                throw new Error(error.response?.data || error.message);
            }
        }
    }
}